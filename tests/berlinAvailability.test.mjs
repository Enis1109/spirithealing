import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { constellationCapacity, constellationDays, constellationTicketPrices } from "../src/content/constellationDays.js";

test("four individual days have the correct language and ticket prices", () => {
  assert.deepEqual(constellationDays.map(({ date, language }) => [date, language]), [
    ["2026-12-12", "tr"], ["2026-12-13", "de"],
    ["2027-01-30", "tr"], ["2027-01-31", "de"],
  ]);
  assert.deepEqual(constellationTicketPrices, { returning: 22, new: 44, own: 160 });
  assert.deepEqual(constellationCapacity, { total: 20, representative: 15, own: 5 });
  assert.equal(new Set(constellationDays.map(day => day.id)).size, 4);
  for (const day of constellationDays) {
    assert.equal(new URL(day.links.returning).origin, 'https://book.stripe.com');
    assert.equal(new URL(day.links.new).origin, 'https://book.stripe.com');
    assert.equal(new URL(day.links.own).origin, 'https://book.stripe.com');
    assert.equal(new URL(day.links.returning).pathname, new URL(day.links.new).pathname);
    assert.equal(new URL(day.links.returning).searchParams.get('prefilled_promo_code'), 'VERBUNDEN22');
    assert.notEqual(new URL(day.links.own).pathname, new URL(day.links.new).pathname);
  }
});

test("the new page does not reuse October prices or unsupported capacity claims", () => {
  const page = readFileSync(new URL("../src/sections/BerlinLive.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(page, /333 €|444 €|Noch [0-9]+ Plätze|October|Oktober|Ekim/u);
  assert.match(page, /day\.links\[type\]/u);
});
