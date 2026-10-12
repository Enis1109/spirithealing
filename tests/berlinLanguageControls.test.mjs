import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Berlin hero decorations cannot intercept clicks on the language controls', () => {
  const source = readFileSync(new URL('../src/sections/BerlinLive.jsx', import.meta.url), 'utf8');
  assert.match(source, /href="\/berlin-live" aria-current=\{language === "de"/u);
  assert.match(source, /href="\/berlin-live\?lang=tr" aria-current=\{language === "tr"/u);
  assert.doesNotMatch(source, /blur-3xl/u);
});
