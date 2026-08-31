import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import {
  canonicalUrlFor,
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
  const expected = indexablePaths.map((pathname) => canonicalUrlFor(pathname === "/" ? "/" : pathname).replace(/^https:\/\/spirit-healing\.tr$/u, "https://spirit-healing.tr/"))
  assert.deepEqual(locations, expected)
  assert.equal(sitemap.includes("/mitglieder"), false)
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
  assert.match(rauhnaechte, /"555"/u)

  assert.deepEqual(structuredDataForPath("/admin", "de"), [])
})

test("places route-specific SEO in the initial HTML response", () => {
  const shell = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8")
  const rauhnaechte = injectSeoIntoDocument(shell, "/rauhnaechte")
  assert.match(rauhnaechte, /<title>Rauhnächte 2026\/2027: Begleitung &amp; Rituale \| Spirit Healing<\/title>/u)
  assert.match(rauhnaechte, /rel="canonical" href="https:\/\/spirit-healing\.tr\/rauhnaechte"/u)
  assert.match(rauhnaechte, /property="og:image" content="https:\/\/spirit-healing\.tr\/rauhnaechte-spirit-healing\.png"/u)
  assert.match(rauhnaechte, /data-spirit-healing-seo="true"/u)

  const privatePage = injectSeoIntoDocument(shell, "/mitglieder/programme/zepter")
  assert.match(privatePage, /name="robots" content="noindex, follow"/u)
  assert.doesNotMatch(privatePage, /data-spirit-healing-seo="true"/u)

  const missing = injectSeoIntoDocument(shell, "/gibt-es-nicht")
  assert.match(missing, /<title>Seite nicht gefunden \| Spirit Healing<\/title>/u)
  assert.match(missing, /name="googlebot" content="noindex, follow"/u)
})
