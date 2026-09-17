// Fixed campaign references only. No browser storage, network calls or payment writes.
export const BERLIN_PAYMENT_LINKS = Object.freeze({
  berlinOwn: "https://book.stripe.com/00w4gB5NE7ClaFldfV83C07",
  berlinIntensive: "https://book.stripe.com/fZu8wReka2i19Bhgs783C08",
});

export const BERLIN_CAMPAIGNS = Object.freeze({
  zwei_tage_de: Object.freeze({
    source: "meta", medium: "paid_social", campaign: "berlin_intensivseminar_2026",
    content: "zwei_tage_de", reference: "bl26_meta_zwei_tage_de",
  }),
  intensivteilnahme_de: Object.freeze({
    source: "meta", medium: "paid_social", campaign: "berlin_intensivseminar_2026",
    content: "intensivteilnahme_de", reference: "bl26_meta_intensivteilnahme_de",
  }),
  story_de: Object.freeze({
    source: "instagram", medium: "organic_social", campaign: "berlin_intensivseminar_2026",
    content: "story_de", reference: "bl26_instagram_story_de",
  }),
});

const attributionKeys = Object.freeze([
  ["utm_source", "source"], ["utm_medium", "medium"],
  ["utm_campaign", "campaign"], ["utm_content", "content"],
]);

// Return only a predefined code. Never return or forward arbitrary query values.
export function campaignCodeFromSearch(search = "") {
  if (typeof search !== "string" || search.length > 4096) return null;
  const params = new URLSearchParams(search);
  if (attributionKeys.some(([key]) => params.getAll(key).length !== 1)) return null;
  for (const [code, campaign] of Object.entries(BERLIN_CAMPAIGNS)) {
    if (attributionKeys.every(([key, field]) => params.get(key) === campaign[field])) return code;
  }
  return null;
}

function safePaymentLink(offer, candidate) {
  if (typeof offer !== "string" || !Object.hasOwn(BERLIN_PAYMENT_LINKS, offer)) {
    // A missing internal ticket mapping must never silently charge the other ticket.
    throw new TypeError("Unknown Berlin ticket offer");
  }
  const canonical = BERLIN_PAYMENT_LINKS[offer];
  if (typeof candidate !== "string") return canonical;
  try {
    const parsed = new URL(candidate);
    const expected = new URL(canonical);
    if (parsed.origin !== expected.origin || parsed.pathname !== expected.pathname
      || parsed.username || parsed.password || parsed.port) return canonical;
    // Even an approved destination may have a stale reference or personal query data.
    // All existing query parameters and fragments are discarded intentionally.
    return expected.href;
  } catch {
    return canonical;
  }
}

export function buildBerlinCheckoutUrl({ offer, campaignCode = null, checkoutUrl } = {}) {
  const safeBase = safePaymentLink(offer, checkoutUrl);
  if (typeof campaignCode !== "string" || !Object.hasOwn(BERLIN_CAMPAIGNS, campaignCode)) return safeBase;
  const reference = BERLIN_CAMPAIGNS[campaignCode].reference;
  // Stripe's documented syntax. Values are constants, not customer identifiers.
  if (!/^[A-Za-z0-9_-]{1,200}$/u.test(reference)) return safeBase;
  const result = new URL(safeBase);
  result.searchParams.set("client_reference_id", reference);
  return result.href;
}
