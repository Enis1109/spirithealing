export const submitForm = async (endpoint, payload) => {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    let result;
    try {
        result = await response.json();
    } catch {
        result = { ok: false, error: "server" };
    }

    if (!response.ok || !result.ok) {
        const error = new Error(result.error || "server");
        error.code = result.error || "server";
        error.field = result.field;
        throw error;
    }

    return result;
};
