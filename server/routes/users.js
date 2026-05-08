import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const USER_SELECT = `
  SELECT u.*,
    mu.unit_name,
    CASE WHEN u.role IN ('maintenance_staff','admin') THEN u.kfupm_id ELSE NULL END AS staff_id
  FROM users u
  LEFT JOIN maintenance_units mu ON mu.unit_id = u.unit_id
`;

router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    if (role) {
      const { rows } = await pool.query(USER_SELECT + ' WHERE u.role = $1 ORDER BY u.user_id', [role]);
      return res.json(rows);
    }
    const { rows } = await pool.query(USER_SELECT + ' ORDER BY u.user_id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/maintenance-staff', async (_req, res) => {
  try {
    const { rows } = await pool.query(USER_SELECT + ` WHERE u.role = 'maintenance_staff' ORDER BY u.user_id`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(USER_SELECT + ' WHERE u.user_id = $1', [req.params.id]);
    res.json(rows[0] ?? null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/login  — identifier can be user_id or kfupm_id
router.post('/login', async (req, res) => {
  const raw = String(req.body?.identifier ?? '').trim();
  if (!raw) return res.json(null);
  try {
    const { rows } = await pool.query(
      USER_SELECT + ` WHERE u.user_id::text = $1 OR LOWER(u.kfupm_id) = LOWER($1)`,
      [raw]
    );
    res.json(rows[0] ?? null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;