import assert from "node:assert/strict";
import test from "node:test";
import {
    normalizeProgramEnrollment,
    normalizeProgramSettings,
    normalizeProgramSlug,
    normalizeProgramTaskUpdate,
    normalizeProgramWeek,
    ProgramValidationError,
} from "../server/programValidation.js";

const validWeek = {
    title: "Wahrnehmen",
    focus: "Den eigenen Ausgangspunkt erkennen.",
    intro: "Der gemeinsame Wochenimpuls.",
    releaseOn: "2026-08-16",
    liveAt: "2026-08-16T19:00",
    zoomUrl: "https://zoom.us/j/123",
    meditationTitle: "Meditation für Woche 1",
    meditationUrl: "/programme/zepter/meditation-1.mp3",
    workbookLabel: "Workbook – Woche 1",
    workbookUrl: "https://example.com/workbook.pdf",
    recordingUrl: "",
    tasks: [
        { key: "meditation", label: "Meditation anhören" },
        { key: "workbook", label: "Workbook bearbeiten" },
    ],
};

test("normalizes program settings and keeps payment-independent access data", () => {
    assert.deepEqual(normalizeProgramSettings({
        title: " Das Zepter ",
        subtitle: " Acht Wochen Begleitung ",
        startDate: "2026-08-16",
        whatsappUrl: "https://chat.whatsapp.com/example",
        status: "active",
    }), {
        title: "Das Zepter",
        subtitle: "Acht Wochen Begleitung",
        startDate: "2026-08-16",
        whatsappUrl: "https://chat.whatsapp.com/example",
        status: "active",
    });
    assert.throws(() => normalizeProgramSettings({
        title: "Das Zepter",
        subtitle: "Acht Wochen Begleitung",
        startDate: "2026-08-16",
        whatsappUrl: "",
        status: "versehentlich-live",
    }), ProgramValidationError);
});

test("accepts a complete week with secure or same-origin asset links", () => {
    assert.deepEqual(normalizeProgramWeek(validWeek, "1"), {
        weekNumber: 1,
        ...validWeek,
    });
});

test("rejects unsafe links and duplicate task keys", () => {
    assert.throws(
        () => normalizeProgramWeek({ ...validWeek, zoomUrl: "http://example.com" }, 1),
        ProgramValidationError,
    );
    assert.throws(
        () => normalizeProgramWeek({
            ...validWeek,
            tasks: [
                { key: "schritt", label: "Erster Schritt" },
                { key: "schritt", label: "Zweiter Schritt" },
            ],
        }, 1),
        ProgramValidationError,
    );
    assert.throws(
        () => normalizeProgramWeek({ ...validWeek, releaseOn: "2026-02-31" }, 1),
        ProgramValidationError,
    );
});

test("validates program slugs, enrollments and task updates", () => {
    assert.equal(normalizeProgramSlug(" ZEPTER-ACHT-WOCHEN "), "zepter-acht-wochen");
    assert.deepEqual(normalizeProgramEnrollment({ email: " TEILNEHMERIN@example.com ", active: false }), {
        email: "teilnehmerin@example.com",
        active: false,
    });
    assert.deepEqual(normalizeProgramTaskUpdate({ weekNumber: "3", taskKey: "WORKBOOK", completed: true }), {
        weekNumber: 3,
        taskKey: "workbook",
        completed: true,
    });
    assert.throws(() => normalizeProgramEnrollment({ email: "keine-mail" }), ProgramValidationError);
    assert.throws(() => normalizeProgramEnrollment({ email: "person@example.com", active: "yes" }), ProgramValidationError);
    assert.throws(() => normalizeProgramTaskUpdate({ weekNumber: 1, taskKey: "x", completed: "yes" }), ProgramValidationError);
});
