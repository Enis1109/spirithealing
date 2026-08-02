export const getPublishedValue = (content, key, language, fallback) => {
    const value = content?.[key]?.[language];
    return typeof value === "string" ? value : fallback;
};
