export const closingVersion = 'zepter-abschluss-2026-10-15-v2';
export const closingConsentVersion = 'zepter-abschluss-2026-10-15';
export const closingScaleKeys = ['h01', 'h02', 'h03', 'h04', 'h05', 'b01', 'b02', 'b03'];
const options = (...values) => values.map(([value, label]) => ({ value, label }));

export const closingSections = [
  { key: 'start', title: 'Dein Anfang und dein heutiger Stand', intro: 'Erinnere dich an dein Anliegen und dein Ziel zu Beginn. Deine heutigen Antworten dürfen anders ausfallen, als du es dir erhofft hast.' },
  { key: 'comparison', title: 'Wie du dich heute erlebst', intro: 'Beziehe dich auf die vergangenen 14 Tage. Diese acht Aussagen und ihre Skalen entsprechen genau dem Startfragebogen.' },
  { key: 'development', title: 'Was sich in deinem Alltag verändert hat', intro: 'Beschreibe deine eigene Erfahrung. Auch Unklarheit, unveränderte Muster und schwierige Entwicklungen haben hier Platz.' },
  { key: 'integration', title: 'Was dich trägt und was du noch brauchst', intro: 'Wie geht es dir mit dem, was sich bewegt hat? Was gelingt bereits, und wobei brauchst du Unterstützung?' },
  { key: 'feedback', title: 'Deine Erfahrung mit der Begleitung', intro: 'Deine Rückmeldung hilft uns, deinen Weg einzuordnen und unsere Begleitung weiterzuentwickeln.' },
  { key: 'continuation', title: 'Wie dein Weg weitergehen darf', intro: 'Welche Begleitung würde zu deinem nächsten Schritt passen? Deine Angaben helfen uns bei der Planung. Sie sind keine Buchung.' },
];
export const closingQuestions = [
  { key: 'startingPoint', section: 'start', type: 'text', required: true, label: 'Mit welchem Anliegen und welchem Ziel bist du in die acht Wochen gegangen?', hint: 'Du kannst in deinem Startfragebogen oder deinen Notizen zum Matrixgespräch nachsehen. Wenn sich dein Ziel verändert hat, beschreibe das kurz mit.' },
  { key: 'today', section: 'start', type: 'text', required: true, label: 'Wo stehst du heute mit diesem Anliegen und deinem damaligen Ziel?', hint: 'Was ist bereits anders? Was ist gleich geblieben oder noch offen?' },
  { key: 'h01', section: 'comparison', type: 'scale', required: true, label: 'Ich konnte bewusst entscheiden, statt nur automatisch zu reagieren.' },
  { key: 'h02', section: 'comparison', type: 'scale', required: true, label: 'Ich konnte meine eigenen Bedürfnisse und Grenzen wahrnehmen.' },
  { key: 'h03', section: 'comparison', type: 'scale', required: true, label: 'Ich konnte auch in schwierigen Situationen bei mir bleiben.' },
  { key: 'h04', section: 'comparison', type: 'scale', required: true, label: 'Ich habe mich selbst als handlungsfähig erlebt.' },
  { key: 'h05', section: 'comparison', type: 'scale', required: true, label: 'Ich konnte Schritte gehen, die wirklich zu mir passen.' },
  { key: 'b01', section: 'comparison', type: 'scale', required: true, burden: true, label: 'Mein beschriebenes Muster hat mich im Alltag belastet.' },
  { key: 'b02', section: 'comparison', type: 'scale', required: true, burden: true, label: 'Das Muster hat meine Beziehungen oder Entscheidungen eingeschränkt.' },
  { key: 'b03', section: 'comparison', type: 'scale', required: true, burden: true, label: 'Nach schwierigen Situationen brauchte ich lange, um wieder in meine Kraft zu kommen.' },
  { key: 'scene', section: 'development', type: 'text', required: true, label: 'Beschreibe eine konkrete Situation aus den letzten 14 Tagen, an der du deinen heutigen Stand erkennst.', hint: 'Was geschah? Was hast du gedacht, gefühlt und im Körper wahrgenommen? Wie hast du gehandelt, und was war die Wirkung? Was wäre früher anders gewesen? Wenn du noch keinen Unterschied bemerkst, beschreibe die Situation so, wie sie war.', maxLength: 3000 },
  { key: 'parts', section: 'development', type: 'text', label: 'Wie erlebst du heute deinen Manager, deinen Firefighter und den Anteil, der im Exil war?', hint: 'Erkennst du, wer gerade spricht oder handelt? Wie sind diese Anteile miteinander verbunden? Was gelingt dir dabei, die Führung zu behalten oder wieder zu übernehmen?' },
  { key: 'essence', section: 'development', type: 'text', required: true, label: 'Welche Essenz und welche Ressourcen erkennst du heute in dir?', hint: 'Nenne deine eigenen Worte, Bilder oder Fähigkeiten und beschreibe, wo sie schon in deinem Leben Ausdruck finden. Wenn die Benennung noch offen ist, schreib das dazu.' },
  { key: 'roles', section: 'development', type: 'text', label: 'Was verändert sich in deinen Beziehungen und Rollen, wenn du mehr aus deinem eigenen Sein handelst?', hint: 'Zum Beispiel in deiner Familie, Partnerschaft, Arbeit oder in familiären, kulturellen und Geschlechterrollen. Wie reagiert dein Umfeld? Wo fällt es dir noch schwer, deinen Raum, deine Grenzen oder deinen eigenen Platz zu halten?' },
  { key: 'dailyState', section: 'integration', type: 'text', required: true, label: 'Wie geht es dir gegenwärtig im Alltag?', hint: 'Wie erlebst du Ruhe, Vertrauen, Verbundenheit, Freude und deine verfügbare Kraft? Kannst du das Erreichte auch empfangen und genießen? Gibt es Müdigkeit, Anspannung oder Belastungen, die gerade Begleitung brauchen?' },
  { key: 'selfSupport', section: 'integration', type: 'text', label: 'Was hilft dir heute, nach einer schwierigen Situation wieder bei dir anzukommen?', hint: 'Was kannst du selbst anwenden, und wann brauchst du jemanden an deiner Seite? Wenn du magst, beziehe auch deinen Körper, die Erdung, die Quelle und unsere Spirale ein.' },
  { key: 'supportNow', section: 'integration', type: 'text', required: true, label: 'Was ist gerade deine größte offene Herausforderung, und was brauchst du dafür konkret?', hint: 'Was könntest du mit Rückmeldung oder gemeinsamer Begleitung leichter angehen? Du kannst auch schreiben, dass du im Moment nichts brauchst oder es noch nicht benennen kannst.' },
  { key: 'otherInfluences', section: 'integration', type: 'text', label: 'Gab es während der acht Wochen andere Ereignisse oder Begleitungen, die deinen heutigen Stand mit beeinflusst haben?', hint: 'Zum Beispiel eine Veränderung in Familie oder Beruf, ein anderes Seminar oder eine weitere Begleitung. Eine kurze Einordnung genügt; persönliche Einzelheiten sind freiwillig.' },
  { key: 'elements', section: 'feedback', type: 'matrix', label: 'Welche Teile der Begleitung hast du genutzt, und wie hilfreich waren sie für dich?', rows: options(['matrix', 'Matrixgespräch zum Einstieg'], ['live', 'Gemeinsame Live-Abende'], ['meditation', 'Meditationen'], ['impulses', 'Tagesimpulse'], ['workbook', 'Workbooks'], ['community', 'Austausch und Verbundenheit in der Gruppe']), options: options(['not_used', 'Nicht genutzt'], ['little', 'Wenig hilfreich'], ['partly', 'Teilweise hilfreich'], ['helpful', 'Hilfreich'], ['very_helpful', 'Sehr hilfreich']) },
  { key: 'feedback', section: 'feedback', type: 'text', label: 'Was hat dir besonders geholfen, und was hat dir gefehlt oder nicht gutgetan?', hint: 'Was wünschst du dir künftig anders, etwa beim Tempo, beim Umfang, beim persönlichen Austausch oder beim Zugang zu den Materialien?' },
  { key: 'directions', section: 'continuation', type: 'multi', required: true, label: 'Wobei möchtest du auf deinem weiteren Weg begleitet werden?', hint: 'Mehrere Antworten sind möglich.', options: options(['integration', 'Meine jetzigen Schritte festigen und Rückmeldung zu Erfahrungen im Alltag bekommen'], ['project', 'Ein eigenes Vorhaben oder Projekt aus meiner Essenz heraus in die Welt bringen'], ['other', 'Eine andere Form der Begleitung'], ['undecided', 'Ich möchte das erst noch herausfinden'], ['none', 'Im Moment brauche ich keine weitere Begleitung']), exclusive: ['undecided', 'none'] },
  { key: 'continuationWish', section: 'continuation', type: 'text', when: 'interested', label: 'Wie stellst du dir diese Begleitung vor, und was sollte dadurch für dich möglich werden?', hint: 'Beschreibe, was du von uns brauchst: zum Beispiel gemeinsame Rückschau, Feedback, Supervision, Arbeit mit Anteilen oder Begleitung bei neuen Rollen und Sichtbarkeit.' },
  { key: 'project', section: 'continuation', type: 'text', when: 'project', label: 'Was möchtest du in die Welt bringen, und wo stehst du damit gerade?', hint: 'Was soll konkret entstehen? Was wäre ein erster Schritt, und welche Unterstützung fehlt dir dafür? Das kann auch ein persönliches, familiäres oder kreatives Vorhaben sein.' },
  { key: 'duration', section: 'continuation', type: 'single', when: 'interested', label: 'Welchen Zeitraum kannst du dir für eine Fortsetzung vorstellen?', options: options(['1', 'Einen Monat'], ['2', 'Zwei Monate'], ['3', 'Drei Monate'], ['other', 'Einen anderen Zeitraum'], ['undecided', 'Das weiß ich noch nicht']) },
  { key: 'durationOther', section: 'continuation', type: 'text', when: 'durationOther', label: 'Welcher andere Zeitraum würde zu dir passen?', maxLength: 400 },
  { key: 'formats', section: 'continuation', type: 'multi', when: 'interested', label: 'Welche Form würde dich unterstützen?', options: options(['group', 'Gemeinsame Online-Gruppe'], ['individual', 'Einzelgespräche'], ['mix', 'Gruppe mit ergänzenden Einzelgesprächen'], ['in_person', 'Persönliche Treffen oder ein gemeinsames Wochenende'], ['other', 'Eine andere Form, die ich oben beschreibe'], ['undecided', 'Noch offen']), exclusive: ['undecided'] },
  { key: 'rhythm', section: 'continuation', type: 'single', when: 'interested', label: 'Wie häufig wären feste Termine für dich passend?', options: options(['weekly', 'Wöchentlich'], ['fortnightly', 'Alle zwei Wochen'], ['monthly', 'Monatlich'], ['flexible', 'Nach Bedarf oder flexibel'], ['other', 'Anders, wie oben beschrieben'], ['undecided', 'Noch offen']) },
  { key: 'budgetState', section: 'continuation', type: 'single', when: 'interested', label: 'Welchen finanziellen Rahmen kannst du dir für deine beschriebene Begleitung vorstellen?', hint: 'Freiwillig. Es geht um die Begleitung, die du dir oben wünschst. Deine Angabe ist keine Zahlungszusage.', options: options(['amount', 'Ich möchte einen Betrag nennen'], ['undecided', 'Das hängt für mich noch vom konkreten Angebot ab'], ['private', 'Dazu möchte ich keine Angabe machen']) },
  { key: 'budgetAmount', section: 'continuation', type: 'money', required: true, when: 'budget', label: 'Welchen Betrag wärst du dafür bereit auszugeben?', hint: 'Bitte in Euro angeben. Auch 0 € ist eine mögliche Angabe.' },
  { key: 'budgetBasis', section: 'continuation', type: 'single', required: true, when: 'budget', label: 'Worauf bezieht sich dieser Betrag?', options: options(['monthly', 'Pro Monat'], ['total', 'Für den gesamten von mir genannten Zeitraum']) },
  { key: 'budgetNote', section: 'continuation', type: 'text', when: 'budget', label: 'Möchtest du zu diesem finanziellen Rahmen noch etwas ergänzen?', hint: 'Zum Beispiel, welche Form von Begleitung du damit verbindest oder ob die Zahlungsweise für dich eine Rolle spielt.', maxLength: 1000 },
];

export class ClosingValidationError extends Error {
  constructor(field) { super('validation'); this.field = field; }
}
export const interestedInContinuation = answers => Array.isArray(answers?.directions) && answers.directions.some(v => ['integration', 'project', 'other'].includes(v));
export function questionVisible(question, answers = {}) {
  switch (question.when) {
    case 'interested': return interestedInContinuation(answers);
    case 'project': return interestedInContinuation(answers) && answers.directions?.includes('project');
    case 'durationOther': return interestedInContinuation(answers) && answers.duration === 'other';
    case 'budget': return interestedInContinuation(answers) && answers.budgetState === 'amount';
    default: return true;
  }
}
export function normalizeAnswer(q, value) {
  const fail = () => { throw new ClosingValidationError(q.key); };
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length)) {
    if (q.required) fail();
    return null;
  }
  if (q.type === 'scale') {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 10) fail();
    return value;
  }
  if (q.type === 'money') {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1000000 || Math.abs(Math.round(value * 100) - value * 100) > 0.00001) fail();
    return value;
  }
  if (q.type === 'text') {
    if (typeof value !== 'string' || value.trim().length > (q.maxLength || 2000) || /\u0000/u.test(value)) fail();
    if (!value.trim()) { if (q.required) fail(); return null; }
    return value.trim();
  }
  const allowed = q.options.map(o => o.value);
  if (q.type === 'single') { if (!allowed.includes(value)) fail(); return value; }
  if (q.type === 'multi') {
    if (!Array.isArray(value) || value.length > allowed.length || new Set(value).size !== value.length || value.some(v => !allowed.includes(v)) || (value.length > 1 && value.some(v => q.exclusive?.includes(v)))) fail();
    return [...value];
  }
  if (q.type === 'matrix') {
    if (typeof value !== 'object' || Array.isArray(value)) fail();
    const result = {};
    for (const row of q.rows) {
      if (value[row.value] === undefined || value[row.value] === '') continue;
      if (!allowed.includes(value[row.value])) fail();
      result[row.value] = value[row.value];
    }
    return Object.keys(result).length ? result : null;
  }
  fail();
}
export function normalizeClosingSubmission(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new ClosingValidationError('form');
  if (input.privacyConsent !== true) throw new ClosingValidationError('privacyConsent');
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (!name || name.length > 100 || /[\r\n\u0000]/u.test(name)) throw new ClosingValidationError('name');
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email) || /[\r\n]/u.test(email)) throw new ClosingValidationError('email');
  if (typeof input.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(input.requestId)) throw new ClosingValidationError('requestId');
  const answers = {};
  for (const q of closingQuestions) {
    // Hidden answers are discarded, including a budget entered before changing direction.
    if (questionVisible(q, answers)) answers[q.key] = normalizeAnswer(q, input.answers?.[q.key]);
  }
  return { name, email, requestId: input.requestId.toLowerCase(), answers, contactRequested: input.contactRequested === true, consentVersion: closingConsentVersion };
}
export function compareClosingScores(answers, baseline) {
  return closingQuestions.filter(q => q.type === 'scale').map(q => {
    const before = baseline?.[q.key];
    const valid = typeof before === 'number' && Number.isInteger(before) && before >= 0 && before <= 10;
    const now = Number.isInteger(answers?.[q.key]) ? answers[q.key] : null;
    return { key: q.key, label: q.label, before: valid ? before : null, now, difference: valid && now !== null ? now - before : null, lowerIsLessBurden: !!q.burden };
  });
}
export function displayAnswer(q, value) {
  if (value === null || value === undefined || value === '') return 'Keine Angabe';
  const label = v => q.options?.find(o => o.value === v)?.label || String(v);
  if (q.type === 'single') return label(value);
  if (q.type === 'multi') return value.map(label).join('; ');
  if (q.type === 'money') return `${value.toLocaleString('de-DE')} €`;
  if (q.type === 'matrix') return q.rows.map(row => `${row.label}: ${value[row.value] ? label(value[row.value]) : 'Keine Angabe'}`).join('\n');
  return String(value);
}
