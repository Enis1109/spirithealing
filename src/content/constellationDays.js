export const constellationDays = [
  { id: "2026-12-12", language: "tr", date: "2026-12-12", links: { returning: "https://book.stripe.com/7sY4gB4JA9KtcNt3Fl83C12?prefilled_promo_code=VERBUNDEN22&locale=tr", new: "https://book.stripe.com/7sY4gB4JA9KtcNt3Fl83C12?locale=tr", own: "https://book.stripe.com/fZudRbekabSB14L7VB83C13?locale=tr" } },
  { id: "2026-12-13", language: "de", date: "2026-12-13", links: { returning: "https://book.stripe.com/7sY9AV4JAe0J6p5dfV83C14?prefilled_promo_code=VERBUNDEN22&locale=de", new: "https://book.stripe.com/7sY9AV4JAe0J6p5dfV83C14?locale=de", own: "https://book.stripe.com/7sY9AV0tkbSBaFl1xd83C15?locale=de" } },
  { id: "2027-01-30", language: "tr", date: "2027-01-30", links: { returning: "https://book.stripe.com/aFa6oJgsi1dX3cT1xd83C16?prefilled_promo_code=VERBUNDEN22&locale=tr", new: "https://book.stripe.com/aFa6oJgsi1dX3cT1xd83C16?locale=tr", own: "https://book.stripe.com/7sY3cx1xo6yhaFlb7N83C17?locale=tr" } },
  { id: "2027-01-31", language: "de", date: "2027-01-31", links: { returning: "https://book.stripe.com/eVqbJ3b7Yg8R7t9fo383C18?prefilled_promo_code=VERBUNDEN22&locale=de", new: "https://book.stripe.com/eVqbJ3b7Yg8R7t9fo383C18?locale=de", own: "https://book.stripe.com/cNi3cx6RI7Cl3cTa3J83C19?locale=de" } },
]

export const constellationTicketPrices = {
  returning: 22,
  new: 44,
  own: 160,
}

export const constellationPlace = "Berlin-Kreuzberg"
export const constellationTime = "10:00–19:00"
export const constellationCapacity = { total: 20, representative: 15, own: 5 }

export const constellationDayPath = (day, language = day.language) =>
  `/berlin-live/${day.id}${language === "tr" ? "?lang=tr" : ""}`

export const isConstellationPath = (pathname) => pathname === "/aufstellungsarbeit"
  || pathname === "/berlin-live" || pathname.startsWith("/berlin-live/")

export const constellationDate = (date, language = "de") => new Intl.DateTimeFormat(
  language === "tr" ? "tr-TR" : "de-DE",
  { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin" },
).format(new Date(`${date}T12:00:00Z`))
