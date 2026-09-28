import assert from 'node:assert/strict';
import test from 'node:test';
import { readExperienceDescription, writeExperienceDescription } from '../src/lib/experienceDescription.js';

test('legacy descriptions are preserved, including embedded topic mentions', () => {
    for (const description of ['', 'Ein Abend zum Austausch.', 'Text\nMonatsthema: bleibt im Text']) {
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
