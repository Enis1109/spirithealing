import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { BERLIN_PAYMENT_LINKS, BERLIN_CAMPAIGNS, campaignCodeFromSearch, buildBerlinCheckoutUrl } from "../src/content/berlinCampaignReference.js";

const queryFor = (code, additions = {}) => {
  const entry = BERLIN_CAMPAIGNS[code];
  return new URLSearchParams({ utm_source: entry.source, utm_medium: entry.medium,
    utm_campaign: entry.campaign, utm_content: entry.content, ...additions }).toString();
};

test("recognizes exactly the three authored campaign combinations", () => {
  assert.deepEqual(Object.keys(BERLIN_CAMPAIGNS), ["zwei_tage_de", "intensivteilnahme_de", "story_de"]);
  for (const code of Object.keys(BERLIN_CAMPAIGNS)) assert.equal(campaignCodeFromSearch(`?${queryFor(code)}`), code);
});

test("keeps both allowlisted full-price destinations and adds only the constant reference", () => {
  for (const [offer, base] of Object.entries(BERLIN_PAYMENT_LINKS)) {
    for (const [code, entry] of Object.entries(BERLIN_CAMPAIGNS)) {
      const result = new URL(buildBerlinCheckoutUrl({ offer, campaignCode: code, checkoutUrl: base }));
      assert.equal(`${result.origin}${result.pathname}`, base);
      assert.deepEqual([...result.searchParams], [["client_reference_id", entry.reference]]);
      assert.match(entry.reference, /^[A-Za-z0-9_-]{1,200}$/u);
    }
  }
});

test("unknown, missing and prototype campaign keys retain the safe unmodified checkout", () => {
  for (const campaignCode of [undefined, null, "", "unknown", "constructor", "__proto__", "test@example.com", { toString: () => "story_de" }]) {
    assert.equal(buildBerlinCheckoutUrl({ offer: "berlinOwn", campaignCode }), BERLIN_PAYMENT_LINKS.berlinOwn);
  }
});

test("ignores personal and arbitrary landing-page parameters", () => {
  const search = queryFor("zwei_tage_de", { email: "test@example.com", name: "Test Name",
    phone: "+491234567", topic: "private content", utm_term: "private search", fbclid: "click-secret",
    client_reference_id: "personal-reference", redirect: "https://invalid.example" });
  const result = buildBerlinCheckoutUrl({ offer: "berlinOwn", campaignCode: campaignCodeFromSearch(search) });
  assert.equal(result, `${BERLIN_PAYMENT_LINKS.berlinOwn}?client_reference_id=bl26_meta_zwei_tage_de`);
});

test("rejects personal values masquerading as known campaign fields", () => {
  for (const field of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    assert.equal(campaignCodeFromSearch(queryFor("zwei_tage_de", { [field]: "test@example.com" })), null);
  }
});

test("requires the full authored tuple and does not infer from content alone", () => {
  assert.equal(campaignCodeFromSearch("utm_content=story_de"), null);
  assert.equal(campaignCodeFromSearch(queryFor("story_de", { utm_source: "meta" })), null);
  assert.equal(campaignCodeFromSearch(queryFor("story_de", { utm_campaign: "another_event" })), null);
});

test("duplicate attribution keys are ambiguous even when the values match", () => {
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const query = new URLSearchParams(queryFor("story_de"));
    query.append(key, query.get(key));
    assert.equal(campaignCodeFromSearch(query.toString()), null);
  }
});

test("unsupported targets cannot redirect payment or switch ticket type", () => {
  const path = new URL(BERLIN_PAYMENT_LINKS.berlinOwn).pathname;
  const candidates = ["https://invalid.example/pay", `http://book.stripe.com${path}`,
    `https://book.stripe.com.evil.example${path}`, `https://login:secret@book.stripe.com${path}`,
    `https://book.stripe.com:444${path}`, `https://buy.stripe.com${path}`, `${BERLIN_PAYMENT_LINKS.berlinOwn}/extra`,
    "javascript:alert(1)", "//book.stripe.com" + path, "not a URL", BERLIN_PAYMENT_LINKS.berlinIntensive,
    "https://book.stripe.com/14AcN71xo1dX3cT8ZF83C09"];
  for (const checkoutUrl of candidates) {
    assert.equal(buildBerlinCheckoutUrl({ offer: "berlinOwn", checkoutUrl }), BERLIN_PAYMENT_LINKS.berlinOwn);
    assert.equal(buildBerlinCheckoutUrl({ offer: "berlinOwn", checkoutUrl, campaignCode: "story_de" }),
      `${BERLIN_PAYMENT_LINKS.berlinOwn}?client_reference_id=bl26_instagram_story_de`);
  }
});

test("discards existing checkout parameters and fragments, including stale references", () => {
  const checkoutUrl = `${BERLIN_PAYMENT_LINKS.berlinIntensive}?client_reference_id=old&client_reference_id=another&prefilled_email=test%40example.com&locale=tr&utm_source=unknown#private`;
  const url = buildBerlinCheckoutUrl({ offer: "berlinIntensive", checkoutUrl, campaignCode: "intensivteilnahme_de" });
  assert.equal(url, `${BERLIN_PAYMENT_LINKS.berlinIntensive}?client_reference_id=bl26_meta_intensivteilnahme_de`);
  assert.equal(buildBerlinCheckoutUrl({ offer: "berlinIntensive", checkoutUrl, campaignCode: "unknown" }), BERLIN_PAYMENT_LINKS.berlinIntensive);
});

test("DE or TR page language does not invent a Turkish campaign or forward locale", () => {
  for (const lang of ["de", "tr"]) {
    const code = campaignCodeFromSearch(queryFor("zwei_tage_de", { lang }));
    assert.equal(code, "zwei_tage_de");
    assert.equal(buildBerlinCheckoutUrl({ offer: "berlinOwn", campaignCode: code }),
      `${BERLIN_PAYMENT_LINKS.berlinOwn}?client_reference_id=bl26_meta_zwei_tage_de`);
    assert.equal(campaignCodeFromSearch(`lang=${lang}`), null);
  }
  assert.equal(campaignCodeFromSearch(queryFor("zwei_tage_de", { utm_content: "zwei_tage_tr" })), null);
});

test("malformed or oversized inputs cannot add arbitrary references", () => {
  for (const search of [null, undefined, {}, new URLSearchParams(), "?%ZZ", "x".repeat(4097)]) {
    assert.equal(campaignCodeFromSearch(search), null);
  }
});

test("an unknown internal ticket mapping throws rather than charging a different offer", () => {
  for (const offer of [undefined, null, "constructor", "unknown", "gemeinsam"]) {
    assert.throws(() => buildBerlinCheckoutUrl({ offer, campaignCode: "story_de" }), /Unknown Berlin ticket offer/);
  }
});

test("allowlists match existing production full-price links without modifying production", async () => {
  const { fullPriceCheckoutLinks } = await import("../src/content/klarnaPayments.js");
  for (const [offer, value] of Object.entries(BERLIN_PAYMENT_LINKS)) assert.equal(value, fullPriceCheckoutLinks[offer]);
});

test("the helper contains no browser state, network or payment API side effects", () => {
  const source = readFileSync(new URL("../src/content/berlinCampaignReference.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage)\b|document\.cookie|checkout\.sessions\.create/u);
});

test("page has no consent-free campaign reference fallback", () => {
  const source = readFileSync(new URL("../src/sections/BerlinLive.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /campaignReferencesEnabled|buildBerlinCheckoutUrl/);
  assert.match(source, /measurement.enabled \? measurement.checkout\('berlinOwn'\) : ownBaseCheckoutUrl/);
  assert.match(source, /measurement.enabled \? measurement.checkout\('berlinIntensive'\) : intensiveBaseCheckoutUrl/);
  for (const variable of ["ownConstellationCheckoutUrl", "intensiveParticipationCheckoutUrl"]) {
    assert.equal(source.split(`href={${variable}}`).length - 1, 2);
  }
});
