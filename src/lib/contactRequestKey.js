// Operational retry keys only. No cookies, analytics or persisted form fields.
// Tab-scoped sessionStorage permits a retry after reload without a second INSERT.
const attempts = new Map();
const storageKey = "spirit-contact-retry";
export async function contactRequestKey(payload) {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
    const hash = Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
    const now = Date.now();
    try {
        const stored = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
        if (Array.isArray(stored)) for (const entry of stored.slice(-10)) {
            if (/^[a-f0-9]{64}$/.test(entry.hash) && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(entry.key) && Number.isFinite(entry.at)
                && entry.at <= now && now - entry.at < 30 * 60 * 1000) attempts.set(entry.hash, { key: entry.key, at: entry.at });
        }
    } catch { /* Storage can be unavailable; in-memory retries still work. */ }
    for (const [key, entry] of attempts) if (now - entry.at > 30 * 60 * 1000) attempts.delete(key);
    if (!attempts.has(hash)) attempts.set(hash, { key: crypto.randomUUID(), at: now });
    while (attempts.size > 10) attempts.delete(attempts.keys().next().value);
    try {
        sessionStorage.setItem(storageKey, JSON.stringify(Array.from(attempts, ([hash, entry]) => ({ hash, ...entry })).slice(-10)));
    } catch { /* Never prevent an inquiry because browser storage is unavailable. */ }
    return attempts.get(hash).key;
}
