import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import {
  canonicalUrlFor,
  canonicalUrlForLanguage,
  indexablePaths,
  metadataForPath,
  structuredDataForPath,
} from "../src/seo/pageMeta.js"
import { injectSeoIntoDocument } from "../server/frontendSeo.js"

test("gives every public page unique indexable metadata", () => {
  const titles = new Set()
  const descriptions = new Set()

  for (const pathname of indexablePaths) {
    const meta = metadataForPath(pathname, "de")
    assert.equal(meta.noindex, undefined, `${pathname} must be indexable`)
    assert.equal(meta.notFound, false, `${pathname} must be a known route`)
    assert.ok(meta.title.length >= 20 && meta.title.length <= 70, `${pathname} title length`)
    assert.ok(meta.description.length >= 70 && meta.description.length <= 180, `${pathname} description length`)
    assert.equal(titles.has(meta.title), false, `${pathname} title must be unique`)
    assert.equal(descriptions.has(meta.description), false, `${pathname} description must be unique`)
    titles.add(meta.title)
    descriptions.add(meta.description)
    assert.equal(canonicalUrlFor(pathname).startsWith("https://spirit-healing.tr"), true)
  }
})

test("keeps private and unknown routes out of the index", () => {
  for (const pathname of ["/mitglieder", "/mitglieder/programme/zepter", "/admin", "/startfragebogen", "/terminumfrage", "/newsletter/status"]) {
    const meta = metadataForPath(pathname, "de")
    assert.equal(meta.noindex, true, pathname)
    assert.equal(meta.notFound, false, pathname)
  }

  const missing = metadataForPath("/gibt-es-nicht", "de")
  assert.equal(missing.noindex, true)
  assert.equal(missing.notFound, true)
})

test("keeps the XML sitemap aligned with public pages", () => {
  const sitemap = fs.readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8")
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1])
  const expected = indexablePaths.flatMap((pathname) => {
    const canonical = canonicalUrlFor(pathname === "/" ? "/" : pathname).replace(/^https:\/\/spirit-healing\.tr$/u, "https://spirit-healing.tr/")
    return pathname === "/berlin-live"
      ? [canonical, canonicalUrlForLanguage(pathname, "tr")]
      : [canonical]
  })
  assert.deepEqual(locations, expected)
  assert.equal(sitemap.includes("/mitglieder"), false)
})

test("keeps the reviewed Berlin Live language versions separate", () => {
  const german = metadataForPath("/berlin-live", "de")
  const turkish = metadataForPath("/berlin-live", "tr")

  assert.equal(canonicalUrlForLanguage("/berlin-live", "de"), "https://spirit-healing.tr/berlin-live")
  assert.equal(canonicalUrlForLanguage("/berlin-live", "tr"), "https://spirit-healing.tr/berlin-live?lang=tr")
  assert.match(german.title, /Familienaufstellung Berlin/u)
  assert.match(turkish.title, /Travma Duyarlı Aile ve Sistem Dizimi/u)

  const structuredData = JSON.stringify(structuredDataForPath("/berlin-live", "tr"))
  assert.match(structuredData, /Berlin’de Travma Duyarlı Aile ve Sistem Dizimi/u)
  assert.match(structuredData, /Kendi dizimiyle katılım/u)
  assert.match(structuredData, /berlin-live\?lang=tr#event/u)
})

test("adds truthful structured data for the main offers", () => {
  const home = JSON.stringify(structuredDataForPath("/", "de"))
  assert.match(home, /"Organization"/u)
  assert.match(home, /"WebSite"/u)

  const berlin = JSON.stringify(structuredDataForPath("/berlin-live", "de"))
  assert.match(berlin, /"Event"/u)
  assert.match(berlin, /2026-10-09/u)

  const rauhnaechte = JSON.stringify(structuredDataForPath("/rauhnaechte", "de"))
  assert.match(rauhnaechte, /"Course"/u)
  assert.match(rauhnaechte, /"222"/u)
  assert.match(rauhnaechte, /"444"/u)

  const zepter = JSON.stringify(structuredDataForPath("/13-wochen-programm", "de"))
  assert.match(zepter, /"1555"/u)
  assert.match(zepter, /"2777"/u)
  assert.match(zepter, /"4777"/u)

  assert.deepEqual(structuredDataForPath("/admin", "de"), [])
})

test("places route-specific SEO in the initial HTML response", () => {
  const shell = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8")
  const rauhnaechte = injectSeoIntoDocument(shell, "/rauhnaechte")
  assert.match(rauhnaechte, /<title>Rauhnächte 2026\/2027: Begleitung &amp; Rituale \| Spirit Healing<\/title>/u)
  assert.match(rauhnaechte, /rel="canonical" href="https:\/\/spirit-healing\.tr\/rauhnaechte"/u)
  assert.match(rauhnaechte, /property="og:image" content="https:\/\/spirit-healing\.tr\/rauhnaechte-spirit-healing\.png"/u)
  assert.match(rauhnaechte, /data-spirit-healing-seo="true"/u)

  const berlinTurkish = injectSeoIntoDocument(shell, "/berlin-live?lang=tr")
  assert.match(berlinTurkish, /<html lang="tr">/u)
  assert.match(berlinTurkish, /Berlin’de Travma Duyarlı Aile ve Sistem Dizimi/u)
  assert.match(berlinTurkish, /rel="canonical" href="https:\/\/spirit-healing\.tr\/berlin-live\?lang=tr"/u)
  assert.match(berlinTurkish, /hreflang="de" href="https:\/\/spirit-healing\.tr\/berlin-live"/u)
  assert.match(berlinTurkish, /hreflang="tr" href="https:\/\/spirit-healing\.tr\/berlin-live\?lang=tr"/u)
  assert.match(berlinTurkish, /property="og:locale" content="tr_TR"/u)

  const privatePage = injectSeoIntoDocument(shell, "/mitglieder/programme/zepter")
  assert.match(privatePage, /name="robots" content="noindex, follow"/u)
  assert.doesNotMatch(privatePage, /data-spirit-healing-seo="true"/u)

  const missing = injectSeoIntoDocument(shell, "/gibt-es-nicht")
  assert.match(missing, /<title>Seite nicht gefunden \| Spirit Healing<\/title>/u)
  assert.match(missing, /name="googlebot" content="noindex, follow"/u)
})
