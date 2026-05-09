/**
 * Standalone PostgreSQL connectivity check (similar to a pg Client script).
 * Run from the server folder: npm run db:test
 *
 * Uses the same variables as the API: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD.
 */
import './loadEnv.js';
import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'campusfix',
});

async function main() {
  const missing = ['DB_USER', 'DB_PASSWORD'].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing env: ${missing.join(', ')} — ensure server/.env exists and is filled in.`);
    process.exitCode = 1;
    return;
  }

  try {
    await client.connect();
    const { rows } = await client.query(
      `SELECT current_database() AS database, current_user AS role`
    );
    console.log('PostgreSQL connection OK:', rows[0]);

    try {
      const { rows: counts } = await client.query(
        `SELECT COUNT(*)::int AS report_count FROM reports`
      );
      console.log('Sample query (reports count):', counts[0]);
    } catch (tableErr) {
      console.warn(
        'Connected, but `reports` query failed (schema/migrations missing?):',
        tableErr.message
      );
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();
