import express from 'express';
import { BERLIN_LINK_IDS, recordStripeEvent, verifyStripeEvent } from './berlinMeasurement.js';

const testOffers = Object.freeze({
  own_full: { ticket: 'own', booking: true, installment: 0 },
  intensive_full: { ticket: 'intensive', booking: true, installment: 0 },
  own_first: { ticket: 'own', booking: true, installment: 1 },
  intensive_first: { ticket: 'intensive', booking: true, installment: 1 },
  own_followup: { ticket: 'own', booking: false, installment: 2 },
  intensive_followup: { ticket: 'intensive', booking: false, installment: 2 },
});

// Fail closed; never silently treat a misspelled mode as test mode.
// Error messages do not interpolate secret or configuration values.
export function berlinWebhookConfig(env) {
  if (env.BERLIN_MEASUREMENT_ENABLED !== 'true') return { enabled: false };
  if (!['live', 'test'].includes(env.BERLIN_STRIPE_MODE)) throw new Error('Berlin Stripe mode must be live or test');
  if (!/^whsec_[A-Za-z0-9_]+$/.test(env.BERLIN_STRIPE_WEBHOOK_SECRET || '')) throw new Error('Berlin webhook signing secret missing or invalid');
  const expectedLive = env.BERLIN_STRIPE_MODE === 'live';
  let linkMap = BERLIN_LINK_IDS;
  if (!expectedLive) {
    let input;
    try { input = JSON.parse(env.BERLIN_STRIPE_TEST_LINKS || ''); } catch { throw new Error('Berlin test Payment Links missing or invalid'); }
    if (!input || typeof input !== 'object' || Array.isArray(input)
      || !Object.hasOwn(input, 'own_full') || !Object.hasOwn(input, 'intensive_full')) throw new Error('Both Berlin test ticket links are required');
    const entries = Object.entries(input);
    const ids = new Set();
    linkMap = Object.create(null);
    for (const [offer, id] of entries) {
      if (!Object.hasOwn(testOffers, offer) || typeof id !== 'string' || !/^plink_[A-Za-z0-9]+$/.test(id)
        || Object.hasOwn(BERLIN_LINK_IDS, id) || ids.has(id)) throw new Error('Berlin test Payment Links invalid, duplicated or live');
      ids.add(id); linkMap[id] = testOffers[offer];
    }
    Object.freeze(linkMap);
  }
  return { enabled: true, expectedLive, linkMap, secret: env.BERLIN_STRIPE_WEBHOOK_SECRET };
}

// Register before the site's express.json middleware. Tests exercise this exact route.
export function registerBerlinWebhook(app, { db, config, ready = async () => true }) {
  app.post('/api/berlin/stripe-webhook',
    express.raw({ type: 'application/json', limit: '256kb' }), async (request, response) => {
      response.set('Cache-Control', 'no-store');
      if (!config.enabled) return response.status(503).json({ ok: false });
      let event;
      try { event = verifyStripeEvent(request.body, request.get('stripe-signature'), config.secret); }
      catch { return response.status(400).json({ ok: false }); }
      try {
        if (!await ready()) return response.status(503).json({ ok: false });
        const result = await recordStripeEvent(db, event, config.expectedLive, config.linkMap);
        return response.json({ ok: true, result });
      } catch { return response.status(503).json({ ok: false }); }
    });
}
