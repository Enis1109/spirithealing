import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Berlin hero decorations cannot intercept clicks on the language controls', () => {
  const source = readFileSync(new URL('../src/sections/BerlinLive.jsx', import.meta.url), 'utf8');
  const decorations = source.match(/<div className="[^"]*blur-3xl" aria-hidden="true" \/>/g);
  assert.equal(decorations.length, 2);
  for (const decoration of decorations) assert.ok(decoration.includes('pointer-events-none'));
  assert.ok(source.includes('relative z-10 flex items-center justify-between'));
});
