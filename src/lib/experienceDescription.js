// Keep editorial metadata in the protected session description, not a public
// catalogue. Older descriptions without this optional heading stay unchanged.
export function readExperienceDescription(value = '') {
    const original = String(value ?? '');
    const match = /^Monatsthema: ([^\r\n]+)(?:\r?\n|$)/.exec(original);
    return match
        ? { monthTopic: match[1].trim(), description: original.slice(match[0].length).trim() }
        : { monthTopic: '', description: original };
}

export function writeExperienceDescription(monthTopic, description) {
    const topic = String(monthTopic ?? '').replace(/[\r\n]+/g, ' ').trim();
    const body = String(description ?? '').trim();
    return topic ? `Monatsthema: ${topic}\n\n${body}`.trim() : body;
}
