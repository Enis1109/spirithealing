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

// Only named HTTPS links are supported. Everything else remains escaped text in React.
export function experienceDescriptionParts(value = '') {
    const description = String(value ?? '');
    const parts = [];
    let position = 0;
    for (const match of description.matchAll(/\[([^\]\r\n]{1,180})\]\((https:\/\/[^\s)]+)\)/g)) {
        let url;
        try { url = new URL(match[2]); } catch { continue; }
        if (url.protocol !== 'https:' || url.username || url.password) continue;
        if (match.index > position) parts.push({ text: description.slice(position, match.index) });
        parts.push({ text: match[1], href: url.href });
        position = match.index + match[0].length;
    }
    if (position < description.length || !parts.length) parts.push({ text: description.slice(position) });
    return parts;
}
