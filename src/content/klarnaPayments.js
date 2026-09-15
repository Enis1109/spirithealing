// Verified full-price Payment Links. Klarna handles the customer's installments;
// existing merchant installment links remain available for earlier agreements.
export const fullPriceCheckoutLinks = Object.freeze({
  berlinOwn: "https://book.stripe.com/00w4gB5NE7ClaFldfV83C07",
  berlinIntensive: "https://book.stripe.com/fZu8wReka2i19Bhgs783C08",
  gemeinsam: "https://book.stripe.com/5kQbJ3b7Yf4NeVB4Jp83C0J",
  vertieft: "https://book.stripe.com/14A28t3Fwe0JeVB8ZF83C0K",
  persoenlich: "https://book.stripe.com/9B614pcc2e0J9Bhgs783C0W",
});

export const fullPriceCheckoutUrl = (offer, override) => {
  const verified = fullPriceCheckoutLinks[offer];
  if (!verified) throw new Error(`Unknown payment offer: ${offer}`);
  if (!override) return verified;
  try {
    const url = new URL(override);
    // A stale environment variable must not route a full-price purchase to an
    // old first-installment link or another offer. New links need verification.
    if (url.protocol === "https:" && ["book.stripe.com", "buy.stripe.com"].includes(url.hostname)
      && !url.username && !url.password && !url.port
      && url.pathname === new URL(verified).pathname) return url.href;
  } catch { /* Use the verified full-price link. */ }
  return verified;
};

export const klarnaPaymentCopy = Object.freeze({
  de: Object.freeze({
    title: "Ratenzahlung über Klarna",
    cta: "Zahlungsoptionen ansehen",
    short: "Klarna-Ratenzahlung nach Verfügbarkeit",
    note: "Wähle beim Bezahlen Klarna, sofern es dir angeboten wird. Die Freigabe erfolgt durch Klarna.",
    details: "Du buchst zum angegebenen Gesamtpreis. Wähle auf der Bezahlseite Klarna, sofern es dir angeboten wird. Klarna prüft deine Anfrage und zeigt dir die verfügbaren Raten, Laufzeiten und gegebenenfalls Zinsen vor dem Abschluss. Die Raten zahlst du an Klarna. Wir erheben keinen Klarna-Aufschlag. Eine bestimmte Ratenzahl oder eine Zusage können wir nicht garantieren.",
  }),
  tr: Object.freeze({
    title: "Klarna ile taksitli ödeme",
    cta: "Ödeme seçeneklerini inceleyin",
    short: "Uygunluk durumuna göre Klarna ile taksitli ödeme",
    note: "Ödeme sırasında size sunulursa Klarna’yı seçin. Onay Klarna tarafından verilir.",
    details: "Kaydınız belirtilen toplam ücret üzerinden yapılır. Ödeme sayfasında size sunulursa Klarna’yı seçin. Klarna başvurunuzu değerlendirir; mevcut taksitleri, vadeleri ve varsa faizleri işlemi tamamlamadan önce gösterir. Taksitlerinizi Klarna’ya ödersiniz. Klarna için ek ücret almıyoruz. Belirli bir taksit sayısını veya onayı garanti edemiyoruz.",
  }),
});
