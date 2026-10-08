import assert from 'node:assert/strict';
import test from 'node:test';
import { experienceDescriptionParts, hasExperienceHandoutPreRelease, readExperienceDescription, writeExperienceDescription } from '../src/lib/experienceDescription.js';

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

test('named HTTPS book links become clickable parts without changing surrounding text or query parameters', () => {
    const url = 'https://www.dropbox.com/scl/fi/synthetic/book.pdf?rlkey=synthetic&dl=0';
    const text = `Ein Abend.\n\n[Buch herunterladen (Dropbox)](${url})\nDie Bücherliste bleibt.`;
    assert.deepEqual(experienceDescriptionParts(text), [{ text: 'Ein Abend.\n\n' },
        { text: 'Buch herunterladen (Dropbox)', href: url }, { text: '\nDie Bücherliste bleibt.' }]);
    const saved = writeExperienceDescription('Testthema', text, true);
    assert.equal(readExperienceDescription(saved).description, text);
    assert.equal(hasExperienceHandoutPreRelease(saved), true);
});

test('plain descriptions and unsupported or unsafe markup stay text, never executable HTML', () => {
    for (const text of ['', 'Plain text', '<script>alert(1)</script>', '[Bad](javascript:alert(1))',
        '[Bad](data:text/html,example)', '[Bad](file:///private/book.pdf)', '[Bad](http://example.test)',
        '[Bad](https://user:secret@example.test/book.pdf)', '[Bad](https://)', '[Incomplete](https://example.test']) {
        assert.deepEqual(experienceDescriptionParts(text), [{ text }]);
    }
    assert.deepEqual(experienceDescriptionParts(null), [{ text: '' }]);
    assert.deepEqual(experienceDescriptionParts('[<img src=x onerror=alert()>](https://example.test/book.pdf)'),
        [{ text: '<img src=x onerror=alert()>', href: 'https://example.test/book.pdf' }]);
});

test('multiple HTTPS links preserve order and invalid entries between links remain visible text', () => {
    assert.deepEqual(experienceDescriptionParts('[First](https://example.test/1) [Invalid](http://example.test) [Second](https://example.test/2)'),
        [{ text: 'First', href: 'https://example.test/1' }, { text: ' [Invalid](http://example.test) ' },
            { text: 'Second', href: 'https://example.test/2' }]);
});
