import { klarnaPaymentCopy } from "./klarnaPayments.js";

// New campaign fields keep earlier published editorial copy intact.
const entries = [
  ["eyebrow", "Spirit Healing live in Berlin · 9.–10. Oktober 2026", "Spirit Healing Berlin’de · 9–10 Ekim 2026"],
  ["title", "Zweitägiges Intensivseminar für Familienaufstellung in Berlin", "Berlin’de İki Günlük Yoğun Aile Dizimi Semineri"],
  ["lead", "Wir verbinden familiensystemische Aufstellungsarbeit mit Anteilearbeit und Energiearbeit. Sabine und Selcan begleiten jede Aufstellung gemeinsam, in einer Gruppe von höchstens 20 Menschen.", "Aile dizimini içsel parçalar çalışması ve enerji çalışmasıyla birleştiriyoruz. Sabine ve Selcan, en fazla 20 kişilik bir grupta her aile dizimine birlikte rehberlik ediyor."],
  ["location", "Manoah-Zentrum · Berlin-Kreuzberg", "Manoah-Zentrum · Berlin-Kreuzberg"],
  ["address", "Urbanstraße 118, 10967 Berlin", "Urbanstraße 118, 10967 Berlin"],
  ["cta", "Teilnahme auswählen", "Katılım seçeneğinizi seçin"],
  ["price", "Zwei Tage ab 333 €", "İki gün için 333 €’dan başlayan ücretlerle"],
  ["overview-title", "Deine Teilnahme am Intensivseminar", "Yoğun seminere katılımınız"],
  ["overview-intro", "Beide Teilnahmeformen umfassen die zwei vollständigen Seminartage mit Einführung, Übungen, Aufstellungen und gemeinsamer Einordnung.", "Her iki katılım seçeneği de giriş, farkındalık çalışmaları, aile dizimleri ve ortak değerlendirmelerle iki tam seminer gününü kapsar."],
  ["intensive-label", "Intensivteilnahme ohne eigene Aufstellung", "Kendi diziminizi açtırmadan yoğun katılım"],
  ["intensive-summary", "Du nimmst am gesamten Seminar teil und kannst als Stellvertretung mitwirken. Eine eigene Aufstellung ist nicht enthalten.", "Seminerin tamamına katılır, dilerseniz temsilci olarak çalışmalarda yer alırsınız. Kendi aile diziminizin açılması bu seçeneğe dâhil değildir."],
  ["own-label", "Teilnahme mit eigener Aufstellung", "Kendi diziminizle katılım"],
  ["own-summary", "Der gesamte Seminarrahmen und ein reservierter Aufstellungsprozess für dein persönliches Anliegen. Von insgesamt sechs Aufstellungsplätzen sind noch vier buchbar.", "Seminerin tamamına katılım ve kişisel konunuz için ayrılmış bir aile dizimi süreci. Kendi dizimini açtırmak isteyenler için toplam altı yerden dördü hâlâ kayıt için açık."],
  ["details-cta", "Teilnahme und Zahlung ansehen", "Katılım ve ödeme bilgilerini inceleyin"],
  ["weekend-title", "Deine zwei Seminartage", "İki günlük seminer programınız"],
  ["practical-title", "Ort und praktische Fragen", "Yer ve pratik bilgiler"],
  ["food-question", "Ist Verpflegung enthalten?", "Yemek ve içecekler ücrete dâhil mi?"],
  ["food-answer", "Verpflegung ist nicht im Preis enthalten. Mittagessen, Getränke und Snacks organisierst du selbst. An beiden Tagen ist eine Mittagspause vorgesehen.", "Yemek ve içecekler ücrete dâhil değildir. Öğle yemeğinizi, içeceklerinizi ve atıştırmalıklarınızı kendiniz organize edersiniz. Her iki gün de öğle arası vardır."],
  ["role-question", "Muss ich eine Stellvertretung übernehmen?", "Temsilci olmak zorunda mıyım?"],
  ["role-answer", "Du entscheidest über jede Stellvertretung selbst. Du kannst sie annehmen, ablehnen oder im Verlauf wieder abgeben. Nach jeder Aufstellung wird die Rolle bewusst verlassen. Persönliche Inhalte bleiben vertraulich.", "Her temsilcilik için kendiniz karar verirsiniz. Kabul edebilir, reddedebilir veya çalışma sırasında bırakabilirsiniz. Her dizimden sonra temsil edilen rol bilinçli biçimde bırakılır. Paylaşılan kişisel bilgiler gizli tutulur."],
  ["installment-question", "Wie funktioniert die Ratenzahlung?", "Taksitli ödeme nasıl yapılır?"],
  ["installment-answer", klarnaPaymentCopy.de.details, klarnaPaymentCopy.tr.details],
  ["own-rates", klarnaPaymentCopy.de.title, klarnaPaymentCopy.tr.title],
  ["intensive-rates", klarnaPaymentCopy.de.title, klarnaPaymentCopy.tr.title],
  ["installment-cta", klarnaPaymentCopy.de.cta, klarnaPaymentCopy.tr.cta],
  ["installment-note", klarnaPaymentCopy.de.note, klarnaPaymentCopy.tr.note],
  ["contact", "Fragen zur Teilnahme: info@spirit-healing.tr", "Katılımla ilgili sorularınız için: info@spirit-healing.tr"],
  ["language-question", "In welcher Sprache findet das Seminar statt?", "Seminer hangi dilde yapılacak?"],
  ["language-answer", "Das Seminar findet auf Deutsch statt.", "Seminer Almanca yapılacaktır."],
  ["language-short", "Seminarsprache: Deutsch", "Seminer dili: Almanca"],
];

export const berlinSeminarFields = entries.map(([id, de]) => ({
  id: `seminar.${id}`, key: `berlin.seminar.${id}`, group: "Intensivseminar", label: id, value: de, compact: false,
}));
export const berlinSeminarTurkishDefaults = Object.fromEntries(entries.map(([id, , tr]) => [`seminar.${id}`, tr]));
export const berlinSeminarTitles = { de: entries[1][1], tr: entries[1][2] };
