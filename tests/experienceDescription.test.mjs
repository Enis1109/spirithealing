import assert from 'node:assert/strict';
import test from 'node:test';
import { hasExperienceHandoutPreRelease, readExperienceDescription, writeExperienceDescription } from '../src/lib/experienceDescription.js';

test('legacy descriptions are preserved, including embedded topic mentions', () => {
    for (const description of ['', 'Ein Abend zum Austausch.', 'Text\nMonatsthema: bleibt im Text', '  Unveränderter Text']) {
        assert.deepEqual(readExperienceDescription(description), { monthTopic: '', description });
    }
    assert.deepEqual(readExperienceDescription(null), { monthTopic: '', description: '' });
});
test('topic and concise description round-trip without duplicate headings', () => {
    const saved = writeExperienceDescription('Testthema', 'Kurze Beschreibung.');
    const parsed = readExperienceDescription(saved);
    assert.deepEqual(parsed, { monthTopic: 'Testthema', description: 'Kurze Beschreibung.' });
    assert.equal(writeExperienceDescription(parsed.monthTopic, parsed.description), saved);
    assert.equal(readExperienceDescription('Monatsthema: Testthema\r\n\r\nText').description, 'Text');
});
test('optional topic handles empty body and removes multiline input', () => {
    assert.equal(writeExperienceDescription('', ' Text '), 'Text');
    assert.equal(writeExperienceDescription('Ein\nThema', ''), 'Monatsthema: Ein Thema');
    assert.deepEqual(readExperienceDescription('Monatsthema: Testthema'), { monthTopic: 'Testthema', description: '' });
});

test('explicit handout preview round-trips without showing administrative metadata', () => {
    const summary = writeExperienceDescription('Testthema', 'Kurze Beschreibung.', true);
    assert.equal(hasExperienceHandoutPreRelease(summary), true);
    const parsed = readExperienceDescription(summary);
    assert.deepEqual(parsed, { monthTopic: 'Testthema', description: 'Kurze Beschreibung.' });
    assert.equal(writeExperienceDescription(parsed.monthTopic, parsed.description, true), summary);
    assert.equal(hasExperienceHandoutPreRelease(writeExperienceDescription(parsed.monthTopic, parsed.description)), false);
    assert.equal(hasExperienceHandoutPreRelease(summary.replaceAll('\n', '\r\n')), true);
    assert.equal(readExperienceDescription(summary.replaceAll('\n', '\r\n')).description, parsed.description);
});

test('preview is opt-in and an embedded or altered heading is not a release', () => {
    for (const value of [null, '', 'Text\nVorabfreigabe: Thema und Handouts',
        'Vorabfreigabe: Thema und Handouts extra', ' Vorabfreigabe: Thema und Handouts\nText']) {
        assert.equal(hasExperienceHandoutPreRelease(value), false);
    }
    assert.equal(hasExperienceHandoutPreRelease(writeExperienceDescription('', 'Text', 'true')), false);
    assert.deepEqual(readExperienceDescription(writeExperienceDescription('', '', true)), { monthTopic: '', description: '' });
});
