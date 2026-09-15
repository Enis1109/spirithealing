import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { berlinLiveDefaults } from "../src/content/berlinLiveContent.js";
import { berlinLiveTurkishDefaults, berlinLiveStaticTurkishTranslations } from "../src/content/berlinLiveTurkishContent.js";

test("Berlin distinguishes six total constellation places from four still bookable", () => {
  assert.equal(berlinLiveDefaults["hero.capacity"], "20 Plätze insgesamt\ndavon 6 mit eigener Aufstellung – noch 4 buchbar");
  assert.match(berlinLiveDefaults["seminar.own-summary"], /insgesamt sechs Aufstellungsplätzen sind noch vier buchbar/);
  assert.match(berlinLiveDefaults["weekend.intro"], /fünf weitere Aufstellungen/);
  const page=readFileSync(new URL("../src/sections/BerlinLive.jsx",import.meta.url),"utf8");
  assert.ok(page.includes('staticText("Noch 4 Plätze")'));
  assert.ok(!page.includes('staticText("6 Plätze")'));
});

test("Turkish availability states the same remaining places", () => {
  assert.match(berlinLiveTurkishDefaults["hero.capacity"], /toplam 6 yer, 4 yer/);
  assert.match(berlinLiveTurkishDefaults["seminar.own-summary"], /toplam altı yerden dördü/);
  assert.equal(berlinLiveStaticTurkishTranslations["Noch 4 Plätze"], "Son 4 yer");
});
