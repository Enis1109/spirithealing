const extraVideos = [
    ["familienaufstellung-2026-10-27", "familienaufstellung", "1239995801"],
    ["bindungsmuster-2026-11-03", "bindungsmuster", "1243361262"],
    ["bei-mir-bleiben-vortrag-2026-11-17", "beziehung", "1247779335"],
    ["meditation-bei-mir-bleiben-2026-11-17", "uebung"],
];

export const protectedVimeoEmbed = (value, expectedId) => {
    const match = typeof value === "string" && /^https:\/\/(?:www\.)?vimeo\.com\/(\d{1,15})\/([\da-f]{8,32})\/?$/iu.exec(value.trim());
    if (!match || (expectedId && match[1] !== expectedId)) return "";
    return `https://player.vimeo.com/video/${match[1]}?h=${match[2]}&dnt=1`;
};

export const readExtraMemberMedia = (input) => {
    if (!input) return {};
    let config;
    try {
        config = JSON.parse(input);
    } catch {
        return {};
    }
    if (!config || typeof config !== "object" || Array.isArray(config)) return {};
    return Object.fromEntries(extraVideos.flatMap(([key, name, id]) => {
        const url = protectedVimeoEmbed(config[name], id);
        return url ? [[key, url]] : [];
    }));
};
