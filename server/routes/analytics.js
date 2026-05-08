import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/analytics/summary
router.get('/summary', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)                                                        AS total,
        COUNT(*) FILTER (WHERE resolved_at IS NULL)                    AS open,
        COUNT(*) FILTER (WHERE resolved_at >= NOW() - INTERVAL '7 days') AS resolved_this_week
      FROM reports
    `);
    const { rows: breach } = await pool.query(`
      SELECT COUNT(*) AS breach_count
      FROM reports r
      JOIN priority_levels pl ON pl.priority_id = r.priority_id
      WHERE r.resolved_at IS NULL
        AND EXTRACT(EPOCH FROM (NOW() - r.submitted_at))/3600 > pl.sla_hours
    `);
    res.json({
      total:            Number(rows[0].total),
      open:             Number(rows[0].open),
      resolvedThisWeek: Number(rows[0].resolved_this_week),
      breachCount:      Number(breach[0].breach_count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/reports-by-status  (Q9)
router.get('/reports-by-status', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT rs.status_id, rs.status_name,
             COUNT(r.report_id) AS count
      FROM report_statuses rs
      LEFT JOIN reports r ON r.status_id = rs.status_id
      GROUP BY rs.status_id, rs.status_name, rs.sort_order
      ORDER BY rs.sort_order
    `);
    res.json(rows.map((r) => ({ ...r, count: Number(r.count) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/reports-by-facility?limit=6  (Q3)
router.get('/reports-by-facility', async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  try {
    const { rows } = await pool.query(`
      SELECT f.facility_id, f.name, f.building_name,
             ft.type_name,
             COUNT(r.report_id) AS total_reports
      FROM facilities f
      JOIN facility_types ft ON ft.type_id = f.type_id
      LEFT JOIN reports r ON r.facility_id = f.facility_id
      GROUP BY f.facility_id, f.name, f.building_name, ft.type_name
      ORDER BY total_reports DESC, f.name
      LIMIT $1
    `, [limit]);
    res.json(rows.map((r) => ({ ...r, total_reports: Number(r.total_reports) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/reports-by-category  (Q4)
router.get('/reports-by-category', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ic.category_id, ic.category_name,
             mu.unit_name       AS responsible_unit,
             pl.level_name      AS default_priority,
             COUNT(r.report_id) AS total_reports
      FROM issue_categories ic
      JOIN maintenance_units mu ON mu.unit_id     = ic.default_unit_id
      JOIN priority_levels   pl ON pl.priority_id = ic.default_priority_id
      LEFT JOIN reports r       ON r.category_id  = ic.category_id
      GROUP BY ic.category_id, ic.category_name, mu.unit_name, pl.level_name
      ORDER BY total_reports DESC, ic.category_name
    `);
    res.json(rows.map((r) => ({ ...r, total_reports: Number(r.total_reports) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/urgent-queue  (Q12)
router.get('/urgent-queue', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.report_id, r.title, r.submitted_at,
             pl.level_name AS priority, pl.rank,
             u.name        AS submitter,
             f.name        AS facility,
             rs.status_name AS status
      FROM reports r
      JOIN priority_levels  pl ON pl.priority_id = r.priority_id
      JOIN users            u  ON u.user_id      = r.user_id
      JOIN facilities       f  ON f.facility_id  = r.facility_id
      JOIN report_statuses  rs ON rs.status_id   = r.status_id
      WHERE pl.rank <= 2 AND r.resolved_at IS NULL
      ORDER BY pl.rank, r.submitted_at
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/sla-breaches  (Q5)
router.get('/sla-breaches', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.report_id, r.title, r.submitted_at,
             pl.level_name AS priority, pl.sla_hours,
             ROUND(EXTRACT(EPOCH FROM (NOW() - r.submitted_at))/3600) AS hours_open,
             u.name        AS submitter,
             f.name        AS facility,
             rs.status_name AS status
      FROM reports r
      JOIN priority_levels  pl ON pl.priority_id = r.priority_id
      JOIN users            u  ON u.user_id      = r.user_id
      JOIN facilities       f  ON f.facility_id  = r.facility_id
      JOIN report_statuses  rs ON rs.status_id   = r.status_id
      WHERE r.resolved_at IS NULL
        AND EXTRACT(EPOCH FROM (NOW() - r.submitted_at))/3600 > pl.sla_hours
      ORDER BY hours_open DESC
    `);
    res.json(rows.map((r) => ({ ...r, hours_open: Number(r.hours_open), breached: true })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/resolution-vs-sla  (Q11)
router.get('/resolution-vs-sla', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT pl.priority_id, pl.level_name, pl.sla_hours, pl.rank,
             COUNT(r.report_id) AS resolved_reports,
             ROUND(AVG(EXTRACT(EPOCH FROM (r.resolved_at - r.submitted_at))/3600)::numeric, 1)
               AS avg_resolution_hours
      FROM priority_levels pl
      LEFT JOIN reports r ON r.priority_id = pl.priority_id AND r.resolved_at IS NOT NULL
      GROUP BY pl.priority_id, pl.level_name, pl.sla_hours, pl.rank
      ORDER BY pl.rank
    `);
    res.json(rows.map((r) => ({
      ...r,
      resolved_reports:      Number(r.resolved_reports),
      avg_resolution_hours:  r.avg_resolution_hours !== null ? Number(r.avg_resolution_hours) : null,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/staff-workload  (Q8)
router.get('/staff-workload', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.user_id, u.name, u.email, mu.unit_name,
             COUNT(*) FILTER (WHERE a.completed_at IS NULL)     AS open,
             COUNT(*) FILTER (WHERE a.completed_at IS NOT NULL) AS completed,
             COUNT(*)                                           AS total
      FROM users u
      JOIN maintenance_units mu ON mu.unit_id = u.unit_id
      LEFT JOIN assignments a   ON a.staff_id = u.user_id
      WHERE u.role = 'maintenance_staff'
      GROUP BY u.user_id, u.name, u.email, mu.unit_name
      ORDER BY total DESC
    `);
    res.json(rows.map((r) => ({
      ...r,
      open:      Number(r.open),
      completed: Number(r.completed),
      total:     Number(r.total),
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;