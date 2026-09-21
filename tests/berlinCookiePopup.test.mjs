import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

test('cookie preferences stay in the footer, with no popup or automatic opening', async () => {
  const server = await createServer({ configFile: false, plugins: [react()],
    define: { 'import.meta.env.VITE_BERLIN_MEASUREMENT_ENABLED': JSON.stringify('true') },
    optimizeDeps: { noDiscovery: true, include: [], entries: [] },
    server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { BerlinMeasurementSettings, useBerlinMeasurement } = await server.ssrLoadModule('/src/components/BerlinMeasurement.jsx');
    let initialState;
    const Probe = () => {
      initialState = useBerlinMeasurement('');
      return createElement(BerlinMeasurementSettings, { state: initialState });
    };
    const initialHtml = renderToStaticMarkup(createElement(Probe));
    assert.equal(initialState.enabled, true);
    assert.equal(initialState.open, false);
    assert.equal(initialState.consent, null);
    assert.ok(initialHtml.includes('aria-expanded="false"'));
    assert.equal(initialHtml.includes('<section'), false);
    assert.equal(initialHtml.includes('<dialog'), false);
    let choices = 0;
    const state = { enabled: true, open: true, consent: null, metaAvailable: true,
      choose: () => { choices++; }, setOpen: () => {} };
    const html = renderToStaticMarkup(createElement(BerlinMeasurementSettings, { state }));
    for (const label of ['Cookies &amp; Datenschutz', 'Alle akzeptieren', 'Nur notwendige', 'Einstellungen', 'Cookie-Einstellungen'])
      assert.ok(html.includes(label));
    assert.equal(html.includes('<dialog'), false);
    assert.ok(html.includes('<section id="berlin-cookie-settings"'));
    assert.ok(html.includes('aria-expanded="true"'));
    assert.ok(html.includes('aria-labelledby="berlin-cookie-title"'));
    assert.ok(html.includes('Conversions API'));
    assert.ok(html.includes('USA'));
    assert.equal(html.includes('checked=""'), false);
    assert.equal(choices, 0);
    const disabled = renderToStaticMarkup(createElement(BerlinMeasurementSettings, { state: { ...state, enabled: false } }));
    assert.equal(disabled, '');
  } finally { await server.close(); }
});
