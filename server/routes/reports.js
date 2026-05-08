import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Formats a flat DB row into the nested shape the frontend expects
function formatReport(row) {
  return {
    report_id:    row.report_id,
    title:        row.title,
    description:  row.description,
    submitted_at: row.submitted_at,
    updated_at:   row.updated_at,
    resolved_at:  row.resolved_at,
    user_id:      row.user_id,
    facility_id:  row.facility_id,
    category_id:  row.category_id,
    priority_id:  row.priority_id,
    status_id:    row.status_id,
    submitter: {
      user_id:  row.s_user_id,
      name:     row.s_name,
      role:     row.s_role,
      kfupm_id: row.s_kfupm_id,
    },
    facility: {
      facility_id:      row.f_facility_id,
      name:             row.f_name,
      building_name:    row.f_building_name,
      area_description: row.f_area_description,
      type_name:        row.f_type_name,
    },
    category: {
      category_id:     row.c_category_id,
      category_name:   row.c_category_name,
      default_unit_id: row.c_default_unit_id,
    },
    priority: {
      priority_id: row.p_priority_id,
      level_name:  row.p_level_name,
      rank:        row.p_rank,
      sla_hours:   row.p_sla_hours,
      color_code:  row.p_color_code,
    },
    status: {
      status_id:   row.st_status_id,
      status_name: row.st_status_name,
      sort_order:  row.st_sort_order,
    },
  };
}

const REPORT_SELECT = `
  SELECT
    r.report_id, r.title, r.description, r.submitted_at, r.updated_at, r.resolved_at,
    r.user_id, r.facility_id, r.category_id, r.priority_id, r.status_id,
    u.user_id   AS s_user_id,   u.name     AS s_name,     u.role AS s_role, u.kfupm_id AS s_kfupm_id,
    f.facility_id AS f_facility_id, f.name AS f_name, f.building_name AS f_building_name,
    f.area_description AS f_area_description, ft.type_name AS f_type_name,
    ic.category_id AS c_category_id, ic.category_name AS c_category_name, ic.default_unit_id AS c_default_unit_id,
    pl.priority_id AS p_priority_id, pl.level_name AS p_level_name, pl.rank AS p_rank,
    pl.sla_hours AS p_sla_hours, pl.color_code AS p_color_code,
    rs.status_id AS st_status_id, rs.status_name AS st_status_name, rs.sort_order AS st_sort_order
  FROM reports r
  JOIN users            u  ON u.user_id      = r.user_id
  JOIN facilities       f  ON f.facility_id  = r.facility_id
  JOIN facility_types   ft ON ft.type_id     = f.type_id
  JOIN issue_categories ic ON ic.category_id = r.category_id
  JOIN priority_levels  pl ON pl.priority_id = r.priority_id
  JOIN report_statuses  rs ON rs.status_id   = r.status_id
`;

// GET /api/reports
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(REPORT_SELECT + ' ORDER BY r.submitted_at DESC');
    res.json(rows.map(formatReport));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(REPORT_SELECT + ' WHERE r.report_id = $1', [req.params.id]);
    if (!rows.length) return res.json(null);

    const report = formatReport(rows[0]);

    const { rows: logs } = await pool.query(`
      SELECT sl.*, 
        u.user_id AS u_id, u.name AS u_name, u.role AS u_role,
        os.status_id AS os_id, os.status_name AS os_name,
        ns.status_id AS ns_id, ns.status_name AS ns_name
      FROM status_logs sl
      JOIN users u ON u.user_id = sl.changed_by
      LEFT JOIN report_statuses os ON os.status_id = sl.old_status_id
      JOIN report_statuses ns ON ns.status_id = sl.new_status_id
      WHERE sl.report_id = $1
      ORDER BY sl.changed_at ASC
    `, [req.params.id]);

    const { rows: asgns } = await pool.query(`
      SELECT a.*,
        u.user_id AS u_id, u.name AS u_name, u.role AS u_role,
        mu.unit_id AS m_id, mu.unit_name AS m_name
      FROM assignments a
      JOIN users u ON u.user_id = a.staff_id
      JOIN maintenance_units mu ON mu.unit_id = u.unit_id
      WHERE a.report_id = $1
      ORDER BY a.assigned_at ASC
    `, [req.params.id]);

    res.json({
      ...report,
      status_logs: logs.map((l) => ({
        ...l,
        changed_by_user: { user_id: l.u_id, name: l.u_name, role: l.u_role },
        old_status: l.os_id ? { status_id: l.os_id, status_name: l.os_name } : null,
        new_status: { status_id: l.ns_id, status_name: l.ns_name },
      })),
      assignments: asgns.map((a) => ({
        ...a,
        staff: { user_id: a.u_id, name: a.u_name, role: a.u_role },
        unit:  { unit_id: a.m_id, unit_name: a.m_name },
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reports
router.post('/', async (req, res) => {
  const { user_id, facility_id, category_id, priority_id, title, description } = req.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO reports (user_id, facility_id, category_id, priority_id, status_id, title, description)
      VALUES ($1, $2, $3, $4, 1, $5, $6)
      RETURNING report_id
    `, [user_id, facility_id, category_id, priority_id, title, description ?? null]);

    const { rows: full } = await pool.query(REPORT_SELECT + ' WHERE r.report_id = $1', [rows[0].report_id]);
    res.status(201).json(formatReport(full[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/reports/:id/status
router.patch('/:id/status', async (req, res) => {
  const reportId = Number(req.params.id);
  const { status_id: newStatusId, changed_by, note } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Load report
    const { rows: rRows } = await client.query(
      'SELECT * FROM reports WHERE report_id = $1 FOR UPDATE', [reportId]
    );
    if (!rRows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Report not found.' }); }
    const report = rRows[0];

    if (report.status_id === Number(newStatusId)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Report is already in this status.' });
    }

    // Validate actor
    const { rows: uRows } = await client.query('SELECT * FROM users WHERE user_id = $1', [changed_by]);
    if (!uRows.length || !['maintenance_staff', 'admin'].includes(uRows[0].role)) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Only staff can update report status.' });
    }
    const actor = uRows[0];

    // Check unit match
    const { rows: catRows } = await client.query(
      'SELECT default_unit_id FROM issue_categories WHERE category_id = $1', [report.category_id]
    );
    const requiredUnit = catRows[0]?.default_unit_id ?? null;
    const canHandle = actor.role === 'admin' ||
      (actor.role === 'maintenance_staff' && actor.unit_id === requiredUnit);
    if (!canHandle) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'This report belongs to another maintenance unit.' });
    }

    const now = new Date().toISOString();
    const closing = [4, 5, 6].includes(Number(newStatusId));

    // Update report
    await client.query(`
      UPDATE reports SET status_id = $1, updated_at = $2, resolved_at = $3 WHERE report_id = $4
    `, [newStatusId, now, closing ? now : null, reportId]);

    // Upsert assignment
    const { rows: aRows } = await client.query(
      'SELECT * FROM assignments WHERE report_id = $1 AND staff_id = $2 ORDER BY assigned_at DESC LIMIT 1',
      [reportId, actor.user_id]
    );
    if (!aRows.length) {
      await client.query(
        'INSERT INTO assignments (report_id, staff_id, assigned_at) VALUES ($1, $2, $3)',
        [reportId, actor.user_id, now]
      );
    } else if (closing && !aRows[0].completed_at) {
      await client.query(
        'UPDATE assignments SET completed_at = $1, resolution_notes = $2 WHERE assignment_id = $3',
        [now, note?.trim() || aRows[0].resolution_notes, aRows[0].assignment_id]
      );
    }

    // Status log
    await client.query(`
      INSERT INTO status_logs (report_id, changed_by, old_status_id, new_status_id, changed_at, note)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [reportId, actor.user_id, report.status_id, newStatusId, now, note?.trim() || null]);

    await client.query('COMMIT');

    const { rows: full } = await pool.query(REPORT_SELECT + ' WHERE r.report_id = $1', [reportId]);
    res.json(formatReport(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;