// One generation spans list, detail and status requests. Stale completions cannot
// overwrite newer results, errors or busy state; unmount invalidates the generation.
export function createContactListLoader({ generation, request, begin, success, failure, finish }) {
    return async (cursor = "") => {
        const version = ++generation.current;
        begin();
        try {
            const result = await request(cursor ? "?before=" + cursor : "");
            if (version === generation.current) success(result);
        } catch {
            if (version === generation.current) failure();
        } finally {
            if (version === generation.current) finish();
        }
    };
}
