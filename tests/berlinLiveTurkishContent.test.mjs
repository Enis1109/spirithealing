import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { berlinLiveContentFields } from "../src/content/berlinLiveContent.js"
import {
  berlinLiveStaticTurkishTranslations,
  berlinLiveTurkishDefaults,
} from "../src/content/berlinLiveTurkishContent.js"

test("covers every editable Berlin Live field with an isolated Turkish default", () => {
  const fieldIds = berlinLiveContentFields.map((field) => field.id)
  assert.ok(fieldIds.length >= 84)
  assert.deepEqual(Object.keys(berlinLiveTurkishDefaults), fieldIds)
  assert.equal(Object.entries(berlinLiveTurkishDefaults).every(([id, value]) => id === "seminar.address" ? value === "" : value.trim().length > 0), true)
})

test("new page has separate German and Turkish booking copy", () => {
  const source = readFileSync(new URL("../src/sections/BerlinLive.jsx", import.meta.url), "utf8")
  assert.match(source, /Berlin’de canlı dizim/u)
  assert.match(source, /Live-Aufstellung in Berlin/u)
  assert.match(source, /Temsilci olarak · yeni katılanlar/u)
  assert.match(source, /Stellvertretung · neu dabei/u)
  assert.match(source, /ConstellationLayout language=\{language\}/u)
  assert.ok(Object.keys(berlinLiveStaticTurkishTranslations).length > 0)
})

test("uses the formal Turkish address consistently", () => {
  const copy = Object.values(berlinLiveTurkishDefaults).join("\n").toLocaleLowerCase("tr-TR")
  assert.doesNotMatch(copy, /\b(?:sen|sana|seni|senin|seninle)\b/u)
  assert.doesNotMatch(copy, /sevdiklerini(?:\s|[.,!?]|$)/u)
  const current = readFileSync(new URL("../src/sections/BerlinLive.jsx", import.meta.url), "utf8")
  assert.doesNotMatch(current, /\b(?:sen|sana|seni|senin|seninle|katılabilirsin)\b/u)
})
