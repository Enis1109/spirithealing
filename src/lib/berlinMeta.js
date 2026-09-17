// Deliberately separate from analytics/Stripe consent. Old grants never enable Meta.
export const META_CONSENT_VERSION = 'berlin-meta-pageview-2026-09-17';
export const META_MAX_AGE = 90 * 86400000;
export const metaTokenValid = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
export const metaEventValid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(value);
export function validMetaConsent(value, now = Date.now()) {
  return Boolean(value?.meta === true && value.metaVersion === META_CONSENT_VERSION
    && metaTokenValid(value.metaReceipt) && Number.isFinite(value.at)
    && value.at <= now && now - value.at < META_MAX_AGE);
}
export function metaPageAllowed({ pathname, search = '', hash = '' }, referrer = '') {
  if (referrer) {
    try {
      const source = new URL(referrer);
      const own = ['https://spirit-healing.tr', 'https://www.spirit-healing.tr'].includes(source.origin);
      const meta = /^https:\/\/([a-z]+\.)?(facebook|instagram)\.com$/.test(source.origin);
      if (!(own && metaPageAllowed(source)) && !(meta && source.pathname === '/' && !source.search && !source.hash)) return false;
    } catch { return false; }
  }
  if (pathname !== '/berlin-live' || hash || search.length > 4096) return false;
  const p = new URLSearchParams(search);
  const patterns = {
    utm_source: /^(meta|facebook|instagram)$/, utm_medium: /^(paid_social|organic_social)$/,
    utm_campaign: /^bl26$/, utm_content: /^(a01|a02|o01|o02)$/,
    ad_id: /^[0-9]{5,30}$/, adset_id: /^[0-9]{5,30}$/, campaign_id: /^[0-9]{5,30}$/,
    lang: /^(de|tr)$/, fbclid: /^[A-Za-z0-9_-]{10,1024}$/,
  };
  return [...p.keys()].every(k => Object.hasOwn(patterns, k) && p.getAll(k).length === 1 && patterns[k].test(p.get(k)));
}
export function startRestrictedPixel({ win, doc, pixelId, eventId }) {
  if (!/^[0-9]{5,30}$/.test(pixelId) || !metaEventValid(eventId)) return false;
  if (win.fbq && win.__shBerlinPixelId !== pixelId) return false;
  if (!win.fbq) {
    const fbq = function (...args) { fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args); };
    fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
    win.fbq = fbq; win._fbq = fbq; win.__shBerlinPixelId = pixelId;
    fbq('consent', 'revoke'); fbq('set', 'autoConfig', false, pixelId); fbq('init', pixelId);
    const script = doc.createElement('script');
    script.id = 'sh-berlin-meta-pixel'; script.async = true; script.referrerPolicy = 'no-referrer';
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    doc.head.appendChild(script);
  }
  win.fbq('consent', 'grant');
  win.__shBerlinMetaSent ||= new Set();
  if (!win.__shBerlinMetaSent.has(eventId)) {
    win.__shBerlinMetaSent.add(eventId);
    win.fbq('trackSingle', pixelId, 'PageView', {}, { eventID: eventId });
  }
  return true;
}
