import test from "node:test";
import assert from "node:assert/strict";
import { createContactListLoader } from "../src/lib/latestContactList.js";

const deferred = () => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
};
function fixture() {
    const generation = { current: 0 }, pending = [], paths = [];
    const state = { busy: true, rows: [], next: null, error: false };
    const load = createContactListLoader({
        generation,
        request: path => { paths.push(path); const d = deferred(); pending.push(d); return d.promise; },
        begin: () => { state.busy = true; state.error = false; },
        success: result => { state.rows = result.requests; state.next = result.next; },
        failure: () => { state.rows = []; state.next = null; state.error = true; },
        finish: () => { state.busy = false; },
    });
    return { generation, pending, paths, state, load };
}
test("initial, refresh and paging share a generation: reverse completions cannot restore stale rows or cursor", async () => {
    const f = fixture();
    const initial = f.load(), refresh = f.load(), paging = f.load("51");
    assert.equal(f.state.busy, true);
    f.pending[2].resolve({ requests: ["current"], next: "1" }); await paging;
    f.pending[1].resolve({ requests: ["stale refresh"], next: "99" }); await refresh;
    f.pending[0].resolve({ requests: ["stale initial"], next: "500" }); await initial;
    assert.deepEqual(f.state, { busy: false, error: false, rows: ["current"], next: "1" });
    assert.deepEqual(f.paths, ["", "", "?before=51"]);
});
test("stale rejection and finally cannot clear busy or report an error for the newer request", async () => {
    const f = fixture();
    const old = f.load(), current = f.load("9");
    f.pending[0].reject(new Error("old")); await old;
    assert.deepEqual(f.state, { busy: true, error: false, rows: [], next: null });
    f.pending[1].resolve({ requests: [8], next: null }); await current;
    assert.deepEqual(f.state, { busy: false, error: false, rows: [8], next: null });
});
test("old success cannot erase latest error; unmount invalidates success, failure and finally", async () => {
    const f = fixture();
    const old = f.load(), current = f.load();
    f.pending[1].reject(new Error("latest")); await current;
    f.pending[0].resolve({ requests: ["old"], next: "3" }); await old;
    assert.equal(f.state.error, true); assert.deepEqual(f.state.rows, []);
    for (const outcome of ["resolve", "reject"]) {
        const g = fixture(); const work = g.load();
        g.generation.current++; // effect cleanup on unmount
        const snapshot = structuredClone(g.state);
        g.pending[0][outcome](outcome === "resolve" ? { requests: ["late"], next: null } : new Error("late"));
        await work;
        assert.deepEqual(g.state, snapshot);
    }
});
