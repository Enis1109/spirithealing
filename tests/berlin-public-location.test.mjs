import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { constellationPlace } from '../src/content/constellationDays.js';
import { metadataForPath, structuredDataForPath } from '../src/seo/pageMeta.js';

test('Berlin public location contains district only in German and Turkish', () => {
  assert.ok(constellationPlace === null || constellationPlace === 'Berlin-Kreuzberg');
  for (const language of ['de', 'tr']) {
    const meta = metadataForPath('/berlin-live', language);
    const data = structuredDataForPath('/berlin-live', language);
    assert.doesNotMatch(JSON.stringify({meta,data}), /manoa|urbanstra|10967/i);
    const events = data[0]['@graph'].filter(x => x['@type'] === 'Event');
    assert.equal(events.length, 4);
    for (const event of events) {
      assert.equal(event.location?.name, constellationPlace || undefined);
      assert.equal(event.location?.address.streetAddress, undefined);
      assert.equal(event.location?.address.postalCode, undefined);
    }
  }
  const component = readFileSync(new URL('../src/sections/BerlinLive.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(component, /Manoa|Urbanstraße|10967/u);
});
