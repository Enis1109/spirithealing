import test from 'node:test';
import assert from 'node:assert/strict';
import { blackFridayIsActive, blackFridaySessions } from '../src/content/blackFriday.js';
import { publicEvents } from '../src/content/replayFunnel.js';
import { additionalTalks, octoberLibrary } from '../src/content/memberLibrary.js';
import { metadataForPath } from '../src/seo/pageMeta.js';
test('Black Friday ends after 27 November 23:59 in Berlin, independent of local timezone', () => {
    assert.equal(blackFridayIsActive(Date.parse('2026-11-27T23:59:59+01:00')), true);
    assert.equal(blackFridayIsActive(Date.parse('2026-11-27T23:00:00Z')), false);
    assert.equal(blackFridayIsActive(Date.parse('2026-11-28T02:00:00+03:00')), false);
});
test('discounts match 30 percent and exclude therapy appointments', () => {
    assert.equal(new Set(blackFridaySessions.map(x => x.code)).size, 6);
    for (const item of blackFridaySessions) {
        const money = v => Number(v.replace(' €', '').replace(',', '.'));
        assert.equal(Math.round(money(item.regular)*70), Math.round(money(item.price)*100));
        assert.doesNotMatch(item.href, /gesprach|verhalten/);
    }
});
test('past lecture links target existing library items rather than registrations', () => {
    const keys = new Set(['vortrag-wer-entscheidet-dein-leben', ...additionalTalks.map(i => i.key), ...Object.values(octoberLibrary).map(i => i.key)]);
    const lectures = publicEvents.filter(e => e.replay);
    assert.equal(lectures.length, 6);
    for (const lecture of lectures) {
        const url = new URL(lecture.href, 'https://spirit-healing.tr');
        assert.equal(url.pathname, '/mitglieder');
        assert.equal(url.searchParams.get('tab'), 'library');
        assert.ok(keys.has(url.searchParams.get('media')));
    }
    assert.equal(metadataForPath('/gespraechstherapie').notFound, false);
});
