import './loadEnv.js';
import express from 'express';
import cors from 'cors';

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
const server = app.listen(PORT, () => {
  console.log(`CampusFix API running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use.\nRun this to free it (Windows):\n  netstat -ano | findstr :${PORT}\n  taskkill /PID <PID> /F\n`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});