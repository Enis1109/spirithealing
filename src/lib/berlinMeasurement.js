import { BERLIN_PAYMENT_LINKS } from '../content/berlinCampaignReference.js';

export const CONSENT_VERSION = 'berlin-consent-only-2026-09-17';
export const validReceipt = token => typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);
export const parseConsentReference = value => typeof value === 'string' && /^bl26c_[a-f0-9]{64}$/.test(value) ? value.slice(6) : null;
export const CONSENT_KEY = 'sh-berlin-measurement-consent';
export const CONSENT_DAYS = 90;
const codes = new Set(['a01', 'a02', 'o01', 'o02']);
const numericId = (value) => typeof value === 'string' && /^[0-9]{5,30}$/.test(value) ? value : null;

// Only neutral campaign identifiers. Never retain fbclid, free text or referrer URLs.
export function readBerlinAttribution(search = '') {
  if (typeof search !== 'string' || search.length > 4096) return null;
  const p = new URLSearchParams(search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  if (keys.some(key => p.getAll(key).length !== 1)) return null;
  const code = p.get('utm_content');
  if (!codes.has(code) || p.get('utm_campaign') !== 'bl26') return null;
  const paid = code.startsWith('a');
  if (paid && (p.get('utm_source') !== 'meta' || p.get('utm_medium') !== 'paid_social')) return null;
  if (!paid && (!['instagram', 'facebook'].includes(p.get('utm_source')) || p.get('utm_medium') !== 'organic_social')) return null;
  const id = key => p.getAll(key).length === 1 ? numericId(p.get(key)) : null;
  return { code, source: p.get('utm_source'), adId: paid ? id('ad_id') : null,
    adsetId: paid ? id('adset_id') : null, campaignId: paid ? id('campaign_id') : null };
}

export function validConsent(value, now = Date.now()) {
  return Boolean(value && value.version === CONSENT_VERSION && Number.isFinite(value.at)
    && value.at <= now && now - value.at < CONSENT_DAYS * 86400000
    && typeof value.analytics === 'boolean' && typeof value.meta === 'boolean');
}

export function loadConsent(storage, now = Date.now()) {
  try { const value = JSON.parse(storage.getItem(CONSENT_KEY)); return validConsent(value, now) ? value : null; }
  catch { return null; }
}

export function checkoutReference(attribution) {
  if (!attribution || !codes.has(attribution.code)) return null;
  const adId = numericId(attribution.adId);
  return `bl26_${attribution.code}${adId ? `_${adId}` : ''}`;
}

export function parseCheckoutReference(value) {
  if (typeof value !== 'string') return null;
  const match = /^bl26_(a01|a02|o01|o02)(?:_([0-9]{5,30}))?$/.exec(value);
  if (!match || (match[1].startsWith('o') && match[2])) return null;
  return { code: match[1], adId: match[2] || null };
}

export function measuredCheckoutUrl(offer, attribution, consent, now = Date.now()) {
  if (!Object.hasOwn(BERLIN_PAYMENT_LINKS, offer)) throw new TypeError('Unknown Berlin offer');
  const url = new URL(BERLIN_PAYMENT_LINKS[offer]);
  if (validConsent(consent, now) && consent.analytics && validReceipt(consent.receipt)) {
    url.searchParams.set('client_reference_id', `bl26c_${consent.receipt}`);
  }
  return url.href;
}

// Meta remains separately gated pending account-category AND privacy approval.
// This module never sends Purchase, contact details, subjects, product names or values.
export function pixelPermitted({ enabled, policyApproved, pixelId, consent, pathname, search = '', hash = '', now = Date.now() }) {
  if (!enabled || !policyApproved || !/^[0-9]{5,30}$/.test(pixelId || '')
    || !validConsent(consent, now) || !consent.meta || pathname !== '/berlin-live' || hash) return false;
  const p = new URLSearchParams(search);
  const allowed = new Set(['utm_source','utm_medium','utm_campaign','utm_content','ad_id','adset_id','campaign_id','lang']);
  if ([...p.keys()].some(key => !allowed.has(key) || p.getAll(key).length !== 1)) return false;
  if (p.has('lang') && !['de','tr'].includes(p.get('lang'))) return false;
  const hasCampaign = [...p.keys()].some(key => key !== 'lang');
  if (hasCampaign && !readBerlinAttribution(search)) return false;
  return ['ad_id','adset_id','campaign_id'].every(key => !p.has(key) || numericId(p.get(key)));
}

export function startMetaPageView({ win, doc, pixelId }) {
  // Do not interfere with another installation or inherit its automatic matching.
  if (win.fbq) {
    if (win.__shBerlinPixelId !== pixelId) return false;
    win.fbq('consent', 'grant');
    return true;
  }
  const fbq = function (...args) { fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args); };
  fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
  win.fbq = fbq; win._fbq = fbq;
  win.__shBerlinPixelId = pixelId;
  fbq('consent', 'revoke');
  fbq('set', 'autoConfig', false, pixelId);
  fbq('init', pixelId);
  fbq('consent', 'grant');
  fbq('trackSingle', pixelId, 'PageView');
  const script = doc.createElement('script');
  script.id = 'sh-berlin-meta-pixel'; script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  doc.head.appendChild(script);
  return true;
}

export function revokeMeta(win) { if (typeof win.fbq === 'function') win.fbq('consent', 'revoke'); }

export function clearMetaCookies(doc, hostname) {
  const domains = hostname.endsWith('.spirit-healing.tr') || hostname === 'spirit-healing.tr'
    ? [hostname, '.spirit-healing.tr'] : [hostname];
  for (const name of ['_fbp', '_fbc']) {
    doc.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    for (const domain of domains) doc.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
  }
}
