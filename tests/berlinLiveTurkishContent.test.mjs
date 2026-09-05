import assert from "node:assert/strict"
import test from "node:test"
import { berlinLiveContentFields } from "../src/content/berlinLiveContent.js"
import {
  berlinLiveStaticTurkishTranslations,
  berlinLiveTurkishDefaults,
} from "../src/content/berlinLiveTurkishContent.js"

test("covers every editable Berlin Live field with an isolated Turkish default", () => {
  const fieldIds = berlinLiveContentFields.map((field) => field.id)
  assert.equal(fieldIds.length, 84)
  assert.deepEqual(Object.keys(berlinLiveTurkishDefaults), fieldIds)
  assert.equal(Object.values(berlinLiveTurkishDefaults).every((value) => value.trim().length > 0), true)
})

test("keeps the reviewed Turkish copy and all fixed page labels", () => {
  assert.equal(berlinLiveTurkishDefaults["hero.title"], "Berlin’de Travma Duyarlı Aile ve Sistem Dizimi")
  assert.equal(berlinLiveTurkishDefaults["tickets.own-label"], "Kendi dizimiyle katılım")
  assert.equal(berlinLiveTurkishDefaults["tickets.intensive-label"], "Grup ve temsilci katılımı")
  assert.equal(berlinLiveTurkishDefaults["tickets.installment-note"], "İki taksitle ödeme mümkündür.")
  assert.equal(Object.keys(berlinLiveStaticTurkishTranslations).length, 11)
})

test("uses the formal Turkish address consistently", () => {
  const copy = Object.values(berlinLiveTurkishDefaults).join("\n").toLocaleLowerCase("tr-TR")
  assert.doesNotMatch(copy, /\b(?:sen|sana|seni|senin|seninle)\b/u)
  assert.doesNotMatch(copy, /sevdiklerini(?:\s|[.,!?]|$)/u)
})
