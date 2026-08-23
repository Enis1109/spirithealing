import test from "node:test";
import assert from "node:assert/strict";
import { resolveMemberAccessRedirect } from "../server/memberAccessPaths.js";

test("allows the direct Zepter destination", () => {
    assert.equal(
        resolveMemberAccessRedirect("/mitglieder/programme/zepter"),
        "/mitglieder/programme/zepter",
    );
});

test("rejects external and unknown redirect destinations", () => {
    assert.equal(resolveMemberAccessRedirect("https://example.com"), "/mitglieder?state=verified");
    assert.equal(resolveMemberAccessRedirect("//example.com"), "/mitglieder?state=verified");
    assert.equal(resolveMemberAccessRedirect("/admin"), "/mitglieder?state=verified");
});
