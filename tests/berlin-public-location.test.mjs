import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { berlinSeminarFields, berlinSeminarTurkishDefaults } from '../src/content/berlinSeminarContent.js';
import { metadataForPath, structuredDataForPath } from '../src/seo/pageMeta.js';

test('Berlin public location contains district only in German and Turkish', () => {
  assert.equal(berlinSeminarFields.find(x => x.id === 'seminar.location').value, 'Berlin-Kreuzberg');
  assert.equal(berlinSeminarTurkishDefaults['seminar.location'], 'Berlin-Kreuzberg');
  assert.equal(berlinSeminarFields.find(x => x.id === 'seminar.address').value, '');
  assert.equal(berlinSeminarTurkishDefaults['seminar.address'], '');
  for (const language of ['de', 'tr']) {
    const meta = metadataForPath('/berlin-live', language);
    const data = structuredDataForPath('/berlin-live', language);
    assert.doesNotMatch(JSON.stringify({meta,data}), /manoa|urbanstra|10967/i);
    const event = data[0]['@graph'].find(x => x['@type'] === 'Event');
    assert.equal(event.location.name, 'Berlin-Kreuzberg');
    assert.equal(event.location.address.streetAddress, undefined);
    assert.equal(event.location.address.postalCode, undefined);
  }
  const component = readFileSync(new URL('../src/sections/BerlinLive.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(component, /text\("seminar\.address"\)/);
});
