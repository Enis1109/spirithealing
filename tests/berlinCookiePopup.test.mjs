import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

test('cookie popup presents accept, reject and settings without preselected optional tracking', async () => {
  const server = await createServer({ configFile: false, plugins: [react()],
    optimizeDeps: { noDiscovery: true, include: [], entries: [] },
    server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { BerlinMeasurementSettings } = await server.ssrLoadModule('/src/components/BerlinMeasurement.jsx');
    let choices = 0;
    const state = { enabled: true, open: true, consent: null, metaAvailable: true,
      choose: () => { choices++; }, setOpen: () => {} };
    const html = renderToStaticMarkup(createElement(BerlinMeasurementSettings, { state }));
    for (const label of ['Cookies &amp; Datenschutz', 'Alle akzeptieren', 'Nur notwendige', 'Einstellungen', 'Cookie-Einstellungen'])
      assert.ok(html.includes(label));
    assert.ok(html.includes('<dialog'));
    assert.ok(html.includes('aria-labelledby="berlin-cookie-title"'));
    assert.ok(html.includes('Conversions API'));
    assert.ok(html.includes('USA'));
    assert.equal(html.includes('checked=""'), false);
    assert.equal(choices, 0);
    const disabled = renderToStaticMarkup(createElement(BerlinMeasurementSettings, { state: { ...state, enabled: false } }));
    assert.equal(disabled, '');
  } finally { await server.close(); }
});
