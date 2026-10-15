import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the actual two mail functions with a simulated transport: no SMTP,
// production credentials, stored answers or external recipients are involved.
function mailHarness(result) {
  const source = fs.readFileSync(new URL('../server/mailer.js', import.meta.url), 'utf8');
  const start = source.indexOf('export const sendClosingNotification =');
  const end = source.indexOf('// Group reminders', start);
  assert.ok(start >= 0 && end > start);
  const messages = [];
  const context = vm.createContext({
    URL,
    process: { env: { SMTP_FROM: 'website@example.invalid', PUBLIC_BASE_URL: 'https://example.invalid' } },
    notificationRecipient: 'team@example.invalid',
    closingTransporter: { async sendMail(message) {
      messages.push(message);
      return result || { accepted: [message.to], rejected: [] };
    } },
  });
  vm.runInContext(source.slice(start, end).replaceAll('export const ', 'globalThis.'), context);
  return { messages, ...context };
}

test('participant confirmation thanks the sender and promises the personal follow-up, with no admin text', async () => {
  const h = mailHarness();
  await h.sendClosingConfirmation({ name: 'Funktionstest', email: 'participant@example.invalid', reference: 'PRIVATE-REFERENCE' });
  assert.equal(h.messages.length, 1);
  const message = h.messages[0];
  assert.equal(message.to, 'participant@example.invalid');
  assert.equal(message.replyTo, 'team@example.invalid');
  assert.equal(message.subject, 'Dein Abschlussfragebogen ist bei uns angekommen');
  assert.equal(message.text, 'Hallo Funktionstest,\n\nvielen lieben Dank, dass du dir Zeit für deinen Abschlussfragebogen genommen und deine Erfahrungen mit uns geteilt hast. Dein Fragebogen ist bei uns eingegangen.\n\nWir lesen deine Antworten in Ruhe und schauen gemeinsam auf deinen persönlichen Weg durch diese acht Wochen. Innerhalb von drei Tagen schicken wir dir deine ausführliche persönliche Auswertung mit einer Empfehlung für deine nächsten Schritte.\n\nDanke für dein Vertrauen und für die gemeinsame Zeit mit dir.\n\nVon Herzen\nSelcan und Sabine');
  assert.doesNotMatch(message.text, /admin|gespeichert|referenz|PRIVATE-REFERENCE|Buchung|Zahlungszusage/iu);
  assert.equal(message.cc, undefined);
  assert.equal(message.bcc, undefined);
});

test('internal notification goes only to the team, not to the participant', async () => {
  const h = mailHarness();
  await h.sendClosingNotification({ name: 'Funktionstest', email: 'participant@example.invalid', reference: 'TEST-REFERENCE' });
  const message = h.messages[0];
  assert.equal(message.to, 'team@example.invalid');
  assert.match(message.text, /geschützten Admin-Bereich/u);
  assert.match(message.text, /https:\/\/example\.invalid\/admin/u);
  assert.doesNotMatch(message.text, /participant@example\.invalid/u);
  assert.equal(message.cc, undefined);
  assert.equal(message.bcc, undefined);
});

test('a rejected participant recipient is not reported as a successful confirmation', async () => {
  const h = mailHarness({ accepted: ['someone-else@example.invalid'], rejected: [] });
  await assert.rejects(h.sendClosingConfirmation({ name: 'Funktionstest', email: 'participant@example.invalid' }), /closing_confirmation_not_accepted/u);
});
