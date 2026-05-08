import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/facility-types',    async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM facility_types ORDER BY type_id')).rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/categories', async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM issue_categories ORDER BY category_id')).rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/priorities', async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM priority_levels ORDER BY rank')).rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/statuses', async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM report_statuses ORDER BY sort_order')).rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/maintenance-units', async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM maintenance_units ORDER BY unit_id')).rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;