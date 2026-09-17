// Temporary loopback-only receiver. Never loads the production environment.
import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';
import express from 'express';
import { initializeBerlinMeasurement, berlinMeasurementSummary } from '../server/berlinMeasurement.js';
import { registerBerlinWebhook, berlinWebhookConfig } from '../server/berlinWebhook.js';
import { registerConsent, revokeConsent } from '../server/berlinConsent.js';

const database = process.env.BERLIN_MYSQL_DISPOSABLE_DATABASE || '';
if (!/^u[0-9]+_bltest[0-9]{4}$/.test(database)) throw new Error('Disposable test database required');
const secret = (await readFile(new URL('./webhook-secret', import.meta.url), 'utf8')).trim();
const password = (await readFile(new URL('./database-password', import.meta.url), 'utf8')).trim();
const config = berlinWebhookConfig({ BERLIN_MEASUREMENT_ENABLED: 'true', BERLIN_STRIPE_MODE: 'test',
  BERLIN_STRIPE_WEBHOOK_SECRET: secret,
  BERLIN_STRIPE_TEST_LINKS: JSON.stringify({ own_full: 'plink_1U9lwHQ90vf7AvfHlcBEr3F1',
    intensive_full: 'plink_1U9lwRQ90vf7AvfHaSyVnkSO' }) });
const db = mysql.createPool({ host: '127.0.0.1', user: database, database, password,
  timezone: 'Z', connectTimeout: 5000, multipleStatements: false,
  connectionLimit: 2, maxIdle: 1, idleTimeout: 10000, enableKeepAlive: true });
db.on('connection', connection => connection.query("SET time_zone = '+00:00'"));
const [tables] = await db.query('SHOW TABLES');
const ownTables = ['berlin_measurement_events', 'berlin_payments', 'berlin_payment_adjustments', 'berlin_measurement_erasures', 'berlin_measurement_consents'];
if (tables.length && !(process.env.BERLIN_TEST_RESUME === 'true'
  && tables.every(row => ownTables.includes(Object.values(row)[0])))) {
  await db.end(); throw new Error('Test database is not empty');
}
await initializeBerlinMeasurement(db);
const app = express();
let deliveries = 0;
const results = {};
app.use((request, response, next) => {
  if (request.path === '/api/berlin/stripe-webhook') {
    response.on('finish', () => { deliveries++; results[response.statusCode] = (results[response.statusCode] || 0) + 1; });
  }
  next();
});
registerBerlinWebhook(app, { db, config });
app.use(express.json({ limit: '4kb' }));
// Loopback-only test setup. A consent receipt must precede the tagged test checkout.
app.post('/api/berlin/measurement/consent', async (request, response) => {
  try { const ok = await registerConsent(db, request.body); response.status(ok ? 201 : 400).json({ok}); }
  catch { response.status(503).json({ok:false}); }
});
app.post('/api/berlin/measurement/revoke', async (request, response) => {
  try { await revokeConsent(db, request.body?.receipt); response.json({ok:true}); }
  catch { response.status(503).json({ok:false}); }
});
app.get('/status', async (_request, response) => {
  try { response.set('Cache-Control', 'no-store').json({ testMode: true, deliveries, results,
    summary: await berlinMeasurementSummary(db) }); }
  catch (error) { console.error('Test status failed', /^[A-Z0-9_]+$/.test(error?.code || '') ? error.code : 'UNKNOWN'); response.status(503).json({ ok: false }); }
});
app.use((_error, _request, response, _next) => response.status(400).json({ ok: false }));
const server = app.listen(43177, '127.0.0.1', error => {
  if (error) { console.error('Test listener failed'); process.exitCode = 1; }
  else console.log('Berlin test receiver ready on loopback port 43177; no live events accepted');
});
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  try {
    for (const table of ownTables)
      await db.query(`DROP TABLE IF EXISTS \`${table}\``);
  } finally { await db.end(); }
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  close().catch(() => { console.error('Test cleanup needs review'); process.exitCode = 1; });
});
