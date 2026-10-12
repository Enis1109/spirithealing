import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Berlin hero decorations cannot intercept clicks on the language controls', () => {
  const source = readFileSync(new URL('../src/components/ConstellationLayout.jsx', import.meta.url), 'utf8');
  assert.match(source, /to=\{pathname\} aria-current=\{!tr/u);
  assert.match(source, /to=\{`\$\{pathname\}\?lang=tr`\} aria-current=\{tr/u);
  assert.doesNotMatch(source, /blur-3xl/u);
});
