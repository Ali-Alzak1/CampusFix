import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import reportsRouter    from './routes/reports.js';
import analyticsRouter  from './routes/analytics.js';
import facilitiesRouter from './routes/facilities.js';
import lookupsRouter    from './routes/lookups.js';
import usersRouter      from './routes/users.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/reports',    reportsRouter);
app.use('/api/analytics',  analyticsRouter);
app.use('/api/facilities', facilitiesRouter);
app.use('/api/lookups',    lookupsRouter);
app.use('/api/users',      usersRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CampusFix API running on http://localhost:${PORT}`);
});