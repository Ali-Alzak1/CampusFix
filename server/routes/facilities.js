import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT f.*, ft.type_name
      FROM facilities f
      JOIN facility_types ft ON ft.type_id = f.type_id
      ORDER BY f.facility_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT f.*, ft.type_name
      FROM facilities f
      JOIN facility_types ft ON ft.type_id = f.type_id
      WHERE f.facility_id = $1
    `, [req.params.id]);
    res.json(rows[0] ?? null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;