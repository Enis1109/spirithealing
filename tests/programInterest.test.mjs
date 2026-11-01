import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { programIntroCallUrl } from "../src/content/programInterest.js";
import { publicEvents, programLiveEvents } from "../src/content/replayFunnel.js";
import { memberEvents } from "../src/content/memberEvents.js";

test("all current programme promotions omit superseded cohort dates", () => {
  for (const name of ["Zepter13", "Events", "Rauhnaechte", "LiveTalk"]) {
    const source = readFileSync(new URL(`../src/sections/${name}.jsx`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /2026-11-11|2027-02-03|11\. November|3\. Februar|11 Kasım|3 Şubat|Onboarding ab 21/u, name);
  }
  assert.equal(programLiveEvents.length, 0);
  assert.equal(memberEvents.some(event => event.id.startsWith("program-live-")), false);
});

test("free introductory call is separate from the programme matrix conversation", () => {
  const source = readFileSync(new URL("../src/sections/Zepter13.jsx", import.meta.url), "utf8");
  assert.match(source, /Seit dem 21\. Oktober führen wir persönliche Gespräche/u);
  assert.match(source, /Kostenfrei · unverbindlich · 30 Minuten/u);
  assert.match(source, /Dieses Gespräch ist noch kein Matrix-Gespräch/u);
  assert.match(source, /Matrix-Gespräch ist Teil deiner gebuchten Programmbegleitung/u);
  assert.match(source, /Programmstart wird bekannt gegeben/u);
  assert.match(source, /vollständige Spirit-Healing-Rauhnachtsprogramm/u);
  assert.equal((source.match(/href=\{introCallUrl\}/gu) || []).length, 5);
  assert.equal(programIntroCallUrl, "https://calendly.com/d/dt8n-hrk-ftm/gemeinsames-erstgesprach-zum-13-wochen-programm");
});

test("public calendar provides undated conversation access and preserves Rauhnächte dates", () => {
  const source = readFileSync(new URL("../src/components/EventCalendar.jsx", import.meta.url), "utf8");
  assert.match(source, /Offene Gesprächsphase zum 13-Wochen-Programm/u);
  assert.match(source, /href=\{programIntroCallUrl\}/u);
  const rauhnaechte = publicEvents.find(event => event.id === "rauhnaechte");
  assert.equal(rauhnaechte.date, "2026-12-23");
  assert.equal(rauhnaechte.lastDate, "2027-01-06");
});
