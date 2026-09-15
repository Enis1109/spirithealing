import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fullPriceCheckoutLinks, fullPriceCheckoutUrl, klarnaPaymentCopy } from "../src/content/klarnaPayments.js";
import { berlinLiveDefaults } from "../src/content/berlinLiveContent.js";
import { berlinLiveTurkishDefaults } from "../src/content/berlinLiveTurkishContent.js";

test("all five new-booking offers use their verified full-price checkout", () => {
  assert.equal(Object.keys(fullPriceCheckoutLinks).length, 5);
  assert.equal(new Set(Object.values(fullPriceCheckoutLinks)).size, 5);
  for (const [offer, url] of Object.entries(fullPriceCheckoutLinks)) {
    assert.equal(fullPriceCheckoutUrl(offer), url);
    assert.equal(fullPriceCheckoutUrl(offer, `${url}?locale=de`), `${url}?locale=de`);
    for (const unsafe of ["javascript:alert(1)", "https://example.com/pay", url.replace("https:", "http:"), url.replace("https://", "https://user:pass@"), "https://book.stripe.com/dRmaEZcc2bSB4gXa3J83C0G", "https://book.stripe.com/14AcN71xo1dX3cT8ZF83C09"]) {
      assert.equal(fullPriceCheckoutUrl(offer, unsafe), url);
    }
    for (const other of Object.values(fullPriceCheckoutLinks).filter(value => value !== url)) {
      assert.equal(fullPriceCheckoutUrl(offer, other), url);
    }
  }
  assert.throws(() => fullPriceCheckoutUrl("missing"), /Unknown payment offer/);
});

test("German and Turkish payment copy disclose Klarna approval and possible interest", () => {
  for (const [language, defaults] of [["de", berlinLiveDefaults], ["tr", berlinLiveTurkishDefaults]]) {
    assert.equal(defaults["seminar.installment-answer"], klarnaPaymentCopy[language].details);
    assert.match(klarnaPaymentCopy[language].details, /Klarna/);
    assert.doesNotMatch(Object.values(klarnaPaymentCopy[language]).join(" "), /343|454|114,3|151,3|zinsfrei|6 Raten|3 Monatsraten/);
  }
  assert.match(klarnaPaymentCopy.de.details, /Zinsen/);
  assert.match(klarnaPaymentCopy.de.details, /keinen Klarna-Aufschlag/);
  assert.match(klarnaPaymentCopy.tr.details, /faizleri/);
  assert.equal(berlinLiveDefaults["seminar.language-short"], "Seminarsprache: Deutsch");
  assert.equal(berlinLiveTurkishDefaults["seminar.language-short"], "Seminer dili: Almanca");
});

test("landing pages no longer advertise merchant installments or separate installment links", () => {
  for (const file of ["BerlinLive", "Zepter13"]) {
    const source = readFileSync(new URL(`../src/sections/${file}.jsx`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /THREE_INSTALLMENTS|ZWEI_RATEN|DREI_RATEN|threeInstallments|twoInstallments|Raten-Gesamtpreis|bis zu drei Raten|InstallmentCheckoutUrl/);
    assert.match(source, /fullPriceCheckoutUrl/);
    assert.match(source, /klarnaPaymentCopy/);
  }
});
