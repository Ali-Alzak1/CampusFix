-- CampusFix - Verification and Demonstration Queries
-- Run after the schema and data have been loaded.

-- Q1: Row counts per table
SELECT 'maintenance_units' AS table_name, COUNT(*) AS rows FROM maintenance_units
UNION ALL SELECT 'facility_types',     COUNT(*) FROM facility_types
UNION ALL SELECT 'facilities',         COUNT(*) FROM facilities
UNION ALL SELECT 'priority_levels',    COUNT(*) FROM priority_levels
UNION ALL SELECT 'report_statuses',    COUNT(*) FROM report_statuses
UNION ALL SELECT 'issue_categories',   COUNT(*) FROM issue_categories
UNION ALL SELECT 'users',              COUNT(*) FROM users
UNION ALL SELECT 'reports',            COUNT(*) FROM reports
UNION ALL SELECT 'assignments',        COUNT(*) FROM assignments
UNION ALL SELECT 'status_logs',        COUNT(*) FROM status_logs
ORDER BY table_name;


-- Q2: Full report listing — shows submitter, location, category, priority,
--     current status, submission time, and resolution time if completed
SELECT  r.report_id,
        r.title,
        u.user_id        AS submitter_id,
        u.name           AS submitter_name,
        u.role           AS submitter_role,
        f.name           AS facility,
        f.building_name,
        ic.category_name AS issue_category,
        pl.level_name    AS priority,
        rs.status_name   AS current_status,
        r.submitted_at,
        r.updated_at,
        CASE
            WHEN r.resolved_at IS NOT NULL THEN r.resolved_at::TEXT
            ELSE 'Not yet resolved'
        END              AS resolved_at
FROM    reports r
JOIN    users            u  ON u.user_id      = r.user_id
JOIN    facilities       f  ON f.facility_id  = r.facility_id
JOIN    issue_categories ic ON ic.category_id = r.category_id
JOIN    priority_levels  pl ON pl.priority_id = r.priority_id
JOIN    report_statuses  rs ON rs.status_id   = r.status_id
ORDER BY r.report_id;


-- Q3: Facilities ranked by number of reports
SELECT  f.facility_id,
        f.name           AS facility,
        f.building_name,
        ft.type_name     AS facility_type,
        COUNT(r.report_id) AS total_reports
FROM    facilities f
JOIN    facility_types ft ON ft.type_id = f.type_id
LEFT JOIN reports r       ON r.facility_id = f.facility_id
GROUP BY f.facility_id, f.name, f.building_name, ft.type_name
ORDER BY total_reports DESC, f.name;


-- Q4: Most frequent issue categories with their default unit and priority
SELECT  ic.category_id,
        ic.category_name,
        mu.unit_name       AS responsible_unit,
        pl.level_name      AS default_priority,
        COUNT(r.report_id) AS total_reports
FROM    issue_categories ic
JOIN    maintenance_units mu ON mu.unit_id     = ic.default_unit_id
JOIN    priority_levels   pl ON pl.priority_id = ic.default_priority_id
LEFT JOIN reports r           ON r.category_id = ic.category_id
GROUP BY ic.category_id, ic.category_name, mu.unit_name, pl.level_name
ORDER BY total_reports DESC, ic.category_name;


-- Q5: Open reports past their SLA deadline
SELECT  r.report_id,
        r.title,
        u.name        AS submitted_by,
        f.name        AS facility,
        pl.level_name AS priority,
        pl.sla_hours  AS sla_limit_hours,
        rs.status_name AS current_status,
        r.submitted_at,
        ROUND( EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - r.submitted_at))/3600 ) AS hours_open
FROM    reports r
JOIN    users           u  ON u.user_id     = r.user_id
JOIN    priority_levels pl ON pl.priority_id = r.priority_id
JOIN    report_statuses rs ON rs.status_id   = r.status_id
JOIN    facilities      f  ON f.facility_id  = r.facility_id
WHERE   r.resolved_at IS NULL
  AND   EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - r.submitted_at))/3600 > pl.sla_hours
ORDER BY hours_open DESC;


-- Q6: Status history for a single report (report 5 as example)
--     shows who changed the status, from what, to what, and when
SELECT  sl.log_id,
        sl.changed_at,
        u.name         AS changed_by,
        u.role,
        COALESCE(os.status_name, 'Initial') AS old_status,
        ns.status_name AS new_status,
        sl.note
FROM    status_logs sl
LEFT JOIN report_statuses os ON os.status_id = sl.old_status_id
JOIN    report_statuses    ns ON ns.status_id = sl.new_status_id
JOIN    users              u  ON u.user_id    = sl.changed_by
WHERE   sl.report_id = 5
ORDER BY sl.changed_at;


-- Q7: Assignments with staff details and completion status
SELECT  a.assignment_id,
        r.report_id,
        r.title                AS report_title,
        u.name                 AS assigned_staff,
        mu.unit_name           AS staff_unit,
        a.assigned_at,
        CASE
            WHEN a.completed_at IS NOT NULL THEN a.completed_at::TEXT
            ELSE 'Not yet completed'
        END                    AS completed_at,
        CASE
            WHEN a.completed_at IS NOT NULL
            THEN ROUND( EXTRACT(EPOCH FROM (a.completed_at - a.assigned_at))/3600 )::TEXT || ' hrs'
            ELSE 'In progress'
        END                    AS time_to_complete,
        COALESCE(a.resolution_notes, '—') AS resolution_notes
FROM    assignments a
JOIN    reports r              ON r.report_id = a.report_id
JOIN    users   u              ON u.user_id   = a.staff_id
JOIN    maintenance_units mu   ON mu.unit_id  = u.unit_id
ORDER BY a.assigned_at;


-- Q8: Workload per maintenance staff member
SELECT  u.user_id,
        u.name            AS staff,
        mu.unit_name,
        COUNT(*) FILTER (WHERE a.completed_at IS NULL)     AS open_assignments,
        COUNT(*) FILTER (WHERE a.completed_at IS NOT NULL) AS completed_assignments,
        COUNT(*)                                            AS total_assignments
FROM    users u
JOIN    maintenance_units mu ON mu.unit_id = u.unit_id
LEFT JOIN assignments a      ON a.staff_id = u.user_id
WHERE   u.role = 'maintenance_staff'
GROUP BY u.user_id, u.name, mu.unit_name
ORDER BY total_assignments DESC;


-- Q9: Reports grouped by current status
SELECT  rs.status_id,
        rs.status_name,
        COUNT(r.report_id) AS reports_in_status
FROM    report_statuses rs
LEFT JOIN reports r ON r.status_id = rs.status_id
GROUP BY rs.status_id, rs.status_name, rs.sort_order
ORDER BY rs.sort_order;


-- Q10: Reports by facility type — open vs resolved
SELECT  ft.type_name        AS facility_type,
        COUNT(r.report_id)  AS total_reports,
        COUNT(*) FILTER (WHERE r.resolved_at IS NOT NULL) AS resolved,
        COUNT(*) FILTER (WHERE r.resolved_at IS NULL)     AS still_open
FROM    facility_types ft
JOIN    facilities f  ON f.type_id     = ft.type_id
LEFT JOIN reports r   ON r.facility_id = f.facility_id
GROUP BY ft.type_id, ft.type_name
ORDER BY total_reports DESC;


-- Q11: Average resolution time vs SLA per priority level
SELECT  pl.level_name,
        pl.sla_hours               AS sla_limit_hours,
        COUNT(*)                   AS resolved_reports,
        ROUND( AVG( EXTRACT(EPOCH FROM (r.resolved_at - r.submitted_at))/3600 )::numeric, 1 )
                                   AS avg_resolution_hours
FROM    reports r
JOIN    priority_levels pl ON pl.priority_id = r.priority_id
WHERE   r.resolved_at IS NOT NULL
GROUP BY pl.priority_id, pl.level_name, pl.sla_hours
ORDER BY pl.rank;


-- Q12: Critical and high priority open reports (urgent queue)
SELECT  r.report_id,
        pl.level_name  AS priority,
        r.title,
        u.name         AS submitted_by,
        f.name         AS facility,
        rs.status_name AS current_status,
        r.submitted_at
FROM    reports r
JOIN    priority_levels pl ON pl.priority_id = r.priority_id
JOIN    facilities      f  ON f.facility_id  = r.facility_id
JOIN    report_statuses rs ON rs.status_id   = r.status_id
JOIN    users           u  ON u.user_id      = r.user_id
WHERE   pl.rank <= 2
  AND   r.resolved_at IS NULL
ORDER BY pl.rank, r.submitted_at;
