// Keep editorial metadata in the protected session description, not a public
// catalogue. Older descriptions without this optional heading stay unchanged.
const handoutPreReleaseHeading = 'Vorabfreigabe: Thema und Handouts';
const handoutPreReleasePattern = /^Vorabfreigabe: Thema und Handouts(?:\r?\n|$)/;

export function hasExperienceHandoutPreRelease(value = '') {
    return handoutPreReleasePattern.test(String(value ?? ''));
}

export function readExperienceDescription(value = '') {
    const original = String(value ?? '').replace(handoutPreReleasePattern, '');
    const match = /^Monatsthema: ([^\r\n]+)(?:\r?\n|$)/.exec(original);
    return match
        ? { monthTopic: match[1].trim(), description: original.slice(match[0].length).trim() }
        : { monthTopic: '', description: original };
}

export function writeExperienceDescription(monthTopic, description, handoutPreRelease = false) {
    const topic = String(monthTopic ?? '').replace(/[\r\n]+/g, ' ').trim();
    const body = String(description ?? '').trim();
    const editorial = topic ? `Monatsthema: ${topic}\n\n${body}`.trim() : body;
    return handoutPreRelease === true ? `${handoutPreReleaseHeading}\n${editorial}`.trim() : editorial;
}
