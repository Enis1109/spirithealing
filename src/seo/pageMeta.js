import { constellationCapacity, constellationDays, constellationPlace, constellationTime, constellationTicketPrices, constellationDate, constellationDayPath, isConstellationPath } from "../content/constellationDays.js"

export const siteUrl = "https://spirit-healing.tr"
export const organizationId = `${siteUrl}/#organization`
export const websiteId = `${siteUrl}/#website`
export const defaultSocialImage = `${siteUrl}/Logo-tuerkis.jpeg?v=20260730`

const sharedTurkishDescription = "Bütüncül terapi, travma bilgili danışmanlık ve koçluk; güvenli, özenli ve kendi hızınızda."

const berlinImage = {
  image: "/familie/berlin.jpeg",
  imageWidth: "1536",
  imageHeight: "1024",
  imageAlt: "Familienaufstellung live in Berlin mit Spirit Healing",
}

const zepterImage = {
  image: "/zepter-spirit-healing.png",
  imageWidth: "1024",
  imageHeight: "1536",
  imageAlt: "Goldenes Spirit-Healing-Zepter mit Kolibri und Puma",
}

const rauhnaechteImage = {
  image: "/rauhnaechte-spirit-healing.png",
  imageWidth: "1122",
  imageHeight: "1402",
  imageAlt: "Sabine und Selcan bei einem winterlichen Rauhnachtsritual",
}

export const pageMeta = {
  de: {
    "/live-vortrag/3-november/zugang": { title: "Dein dritter Live-Abend | Spirit Healing", description: "Persönlicher Zugang zum dritten Vortrag.", noindex: true },
    "/live-vortrag/3-november": {
      title: "Dritter Live-Vortrag am 3. November | Spirit Healing",
      description: "Innere Anteile und vertraute Rollen verstehen: kostenloser Live-Abend zum 13-Wochen-Programm mit Sabine und Selcan am 3. November um 20 Uhr.",
    },
    "/": {
      title: "Traumasensible Online-Begleitung | Spirit Healing",
      description: "Traumasensible Prozessbegleitung und integrative Therapie online mit Sabine und Selcan. Schutzmuster verstehen und wieder mehr innere Sicherheit entwickeln.",
    },
    "/coaching": {
      title: "Traumasensible Prozessbegleitung online | Spirit Healing",
      description: "Schutzmuster, innere Anteile und Reaktionen des Nervensystems verstehen. Traumasensible Online-Begleitung mit Sabine und Selcan kennenlernen.",
    },
    "/therapie": {
      title: "Integrative Therapie & Energiearbeit online | Spirit Healing",
      description: "Integrative Online-Therapie mit Anteilearbeit, Körperwahrnehmung, Energiearbeit und einem traumasensiblen Blick auf dein Nervensystem.",
    },
    "/about": {
      title: "Sabine & Selcan | Über Spirit Healing",
      description: "Lerne Sabine Schmidt und Selcan Yilmaz, ihre Haltung und ihre gemeinsame traumasensible, systemische und energetische Arbeit kennen.",
    },
    "/prices": {
      title: "Preise & Termine für Online-Begleitung | Spirit Healing",
      description: "Preise für Einzelsitzungen, gemeinsame Begleitung, Intensivtermine und Sitzungspakete bei Spirit Healing. Kennenlerngespräch kostenfrei buchen.",
    },
    "/termin-buchen": {
      title: "Termin online buchen | Spirit Healing",
      description: "Kostenfreies Kennenlerngespräch, Einzelsitzung oder gemeinsame Begleitung mit Sabine und Selcan auswählen und direkt online buchen.",
    },
    "/faq": {
      title: "Fragen zur traumasensiblen Begleitung | Spirit Healing",
      description: "Antworten zu Ablauf, Methoden, Terminen, Kosten und zur traumasensiblen Online-Begleitung bei Spirit Healing.",
    },
    "/vortraege-seminare": {
      title: "Seminare, Vorträge & Programme | Spirit Healing",
      description: "Aktuelle Spirit-Healing-Seminare, Vorträge und Begleitprogramme zu inneren Anteilen, Nervensystem, Beziehungsmustern und Energiearbeit.",
    },
    "/aufstellungsarbeit": {
      title: "Aufstellungsarbeit mit Sabine und Selcan | Spirit Healing",
      description: "Unsere Aufstellungsarbeit: familiensystemische Dynamiken, innere Anteile und Energiearbeit mit Sabine und Selcan. Erfahre mehr und finde die Live-Termine in Berlin-Kreuzberg.",
      image: "/ueberuns.jpeg", imageAlt: "Sabine Schmidt und Selcan Yilmaz", imageWidth: "1280", imageHeight: "853",
    },
    "/berlin-live": {
      title: "Live-Aufstellung in Berlin: Termine & Plätze | Spirit Healing",
      description: "Aufstellungsarbeit in Berlin-Kreuzberg mit Sabine und Selcan: 12./13. Dezember 2026 und 30./31. Januar 2027, 10–19 Uhr. Türkisch oder Deutsch. Tickets: 22 €, 44 € oder 160 €.",
      ...berlinImage,
    },
    "/13-wochen-programm": {
      title: "13-Wochen-Programm: Das Zepter übernehmen | Spirit Healing",
      description: "Erkenne die unbewusste Matrix hinter wiederkehrenden Rollen, Schutzmustern und Entscheidungen. 13 Wochen mit Matrix-Gespräch, Online-Begleitung und Rauhnächten.",
      ...zepterImage,
      contentLanguage: "de",
    },
    "/vortrag-13-wochen-programm": {
      title: "Wer schreibt dein inneres Drehbuch? | Spirit Healing",
      description: "Kostenloser aufgezeichneter Vortrag über deine persönliche Matrix, Rollen und Muster. Nach der Anmeldung sofort starten und sieben Tage lang ansehen.",
      ...zepterImage,
      contentLanguage: "de",
    },
    "/live-vortrag": {
      title: "Aufzeichnung & Workbook: Dein inneres Drehbuch | Spirit Healing",
      description: "Der Live-Abend mit Sabine und Selcan vom 6. Oktober: Aufzeichnungsbereich, Workbook und unser nächster gemeinsamer Termin.",
      ...zepterImage,
      contentLanguage: "de",
    },
    "/live-vortrag/zugang": { title: "Dein Live-Vortrag | Spirit Healing", description: "Persönlicher Zugang zum Live-Vortrag.", noindex: true },
    "/live-vortrag/aufzeichnung": {
      title: "Dein inneres Drehbuch: Aufzeichnung & Workbook | Spirit Healing",
      description: "Entdecke die Anteile in deinem Alltag. Unser Live-Vortrag mit Sabine und Selcan, die Beobachtungsaufgabe und ein kostenloses Workbook.",
      image: "/images/live-drehbuch-2026-10-06.jpg", imageWidth: "1280", imageHeight: "720", imageAlt: "Sabine und Selcan im Live-Vortrag", contentLanguage: "de",
    },
    "/live-vortrag/20-oktober": {
      title: "Zweites Live am 20. Oktober um 20 Uhr | Spirit Healing",
      description: "Mit deinen Erfahrungen eine Stufe tiefer: kostenloser zweiter Live-Abend mit Sabine und Selcan am 20. Oktober 2026 um 20 Uhr deutscher Zeit.",
      image: "/images/live-drehbuch-2026-10-06.jpg", imageWidth: "1280", imageHeight: "720", imageAlt: "Sabine und Selcan", contentLanguage: "de",
    },
    "/live-vortrag/20-oktober/zugang": { title: "Dein zweites Live | Spirit Healing", description: "Persönlicher Zugang zum zweiten Live-Abend.", noindex: true },
    "/live-vortrag/familienaufstellung": {
      title: "Familienaufstellung: Vortrag am 27. Oktober | Spirit Healing",
      description: "Familienaufstellung kennenlernen: kostenloser Online-Vortrag mit Sabine und Selcan am 27. Oktober 2026 um 20 Uhr deutscher Zeit. Jetzt für Zoom anmelden.",
      image: "/ueberuns.jpeg", imageAlt: "Sabine Schmidt und Selcan Yilmaz", contentLanguage: "de",
    },
    "/live-vortrag/familienaufstellung/zugang": { title: "Dein Familienaufstellungsvortrag | Spirit Healing", description: "Persönlicher Zugang zum Vortrag am 27. Oktober.", noindex: true },
    "/admin/live-vortrag": { title: "Vortragsverwaltung | Spirit Healing", description: "Geschützte Verwaltung des Live-Vortrags.", noindex: true },
    "/vortrag-13-wochen-programm/ansehen": {
      title: "Dein Online-Vortrag | Spirit Healing",
      description: "Persönlicher Zugang zum Spirit-Healing-Online-Vortrag.",
      noindex: true,
    },
    "/rauhnaechte": {
      title: "Rauhnächte 2026/2027: Begleitung & Rituale | Spirit Healing",
      description: "Zwölf geführte Rauhnächte mit Meditationen, Ritualen, Journal, täglichen Impulsen und Live-Begleitung von Sabine und Selcan. Jetzt online buchen.",
      ...rauhnaechteImage,
      contentLanguage: "de",
    },
    "/gratis-meditationen": {
      title: "Zwei kostenlose Vorträge, Workbook & Meditation | Spirit Healing",
      description: "Nach kostenloser Registrierung beide Oktober-Vorträge, das Workbook „Eine neue Perspektive“ und die Meditation „Das Geschenk deines Anteils“ öffnen.",
      image: "/images/meditations/das-geschenk-deines-anteils.jpg",
      imageWidth: "1080",
      imageHeight: "1080",
      imageAlt: "Das Geschenk deines Anteils – Meditation von Spirit Healing",
    },
    "/kontakt": {
      title: "Kontakt & Kennenlerngespräch | Spirit Healing",
      description: "Nimm Kontakt mit Sabine und Selcan von Spirit Healing auf oder vereinbare ein kostenfreies, unverbindliches Kennenlerngespräch.",
    },
    "/impressum": {
      title: "Impressum | Spirit Healing",
      description: "Impressum und Anbieterinformationen der Website Spirit Healing von Sabine Schmidt und Selcan Yilmaz.",
    },
    "/datenschutz": {
      title: "Datenschutz | Spirit Healing",
      description: "Datenschutzhinweise zur Website, Kontaktaufnahme, Terminbuchung und zu den Online-Angeboten von Spirit Healing.",
    },
    "/mitglieder": {
      title: "Mitgliederbereich | Spirit Healing",
      description: "Geschützter Mitgliederbereich von Spirit Healing.",
      noindex: true,
    },
    "/newsletter/status": {
      title: "Newsletter-Status | Spirit Healing",
      description: "Status deiner Newsletter-Anmeldung bei Spirit Healing.",
      noindex: true,
    },
    "/admin": { title: "Admin-Bereich | Spirit Healing", description: "Geschützter Administrationsbereich.", noindex: true },
    "/startfragebogen": { title: "Startfragebogen | Spirit Healing", description: "Persönlicher Startfragebogen für Teilnehmende.", noindex: true },
    "/terminumfrage": { title: "Terminabfrage | Spirit Healing", description: "Interne Terminabfrage für Teilnehmende.", noindex: true },
  },
  tr: {
    "/": { title: "Spirit Healing | Çevrim İçi Travma Bilgili Danışmanlık", description: sharedTurkishDescription },
    "/coaching": { title: "Travma Bilgili Danışmanlık | Spirit Healing", description: "Sinir sistemi tepkilerini, korunma örüntülerini ve içsel parçaları Sabine ve Selcan ile çevrim içi çalışmada daha iyi anlayın." },
    "/therapie": { title: "Bütüncül Çevrim İçi Terapi | Spirit Healing", description: "İçsel parçalar, beden farkındalığı, enerji çalışması ve travma bilgili yaklaşımı birleştiren bütüncül çevrim içi terapi." },
    "/about": { title: "Sabine & Selcan | Spirit Healing Hakkında", description: "Sabine Schmidt ve Selcan Yilmaz'ı, yaklaşımlarını ve birlikte yürüttükleri travma bilgili, sistemik ve enerjetik çalışmayı tanıyın." },
    "/prices": { title: "Ücretler ve Randevular | Spirit Healing", description: "Bireysel seans, ortak çalışma, yoğun seans ve seans paketlerinin güncel ücretlerini inceleyin." },
    "/termin-buchen": { title: "Çevrim İçi Randevu Al | Spirit Healing", description: "Ücretsiz tanışma görüşmesi, bireysel seans veya Sabine ve Selcan ile ortak çalışma için çevrim içi randevu alın." },
    "/faq": { title: "Sıkça Sorulan Sorular | Spirit Healing", description: "Spirit Healing'in çalışma biçimi, yöntemleri, seansları, ücretleri ve travma bilgili yaklaşımı hakkında yanıtlar." },
    "/vortraege-seminare": { title: "Seminerler, Eğitimler ve Programlar | Spirit Healing", description: "İçsel parçalar, sinir sistemi, ilişki örüntüleri ve enerji çalışması üzerine güncel Spirit Healing seminerleri ve programları." },
    "/aufstellungsarbeit": {
      title: "Sabine ve Selcan ile dizim çalışması | Spirit Healing",
      description: "Sabine ve Selcan ile aile sistemi, içsel parçalar ve enerji çalışması. Çalışma biçimimizi tanıyın ve Berlin-Kreuzberg’deki canlı dizim tarihlerini inceleyin.",
      image: "/ueberuns.jpeg", imageAlt: "Sabine Schmidt ve Selcan Yilmaz", imageWidth: "1280", imageHeight: "853",
    },
    "/berlin-live": {
      title: "Berlin’de canlı dizim: tarihler ve kontenjan | Spirit Healing",
      description: "Berlin-Kreuzberg’de Sabine ve Selcan ile dizim çalışması: 12/13 Aralık 2026 ve 30/31 Ocak 2027, 10:00–19:00. Türkçe veya Almanca. Günlük ücret: 22 €, 44 € ya da 160 €.",
      ...berlinImage,
      imageAlt: "Spirit Healing ile Berlin’de aile ve sistem dizimi",
    },
    "/13-wochen-programm": {
      title: "13-Wochen-Programm: Das Zepter übernehmen | Spirit Healing",
      description: "Erkenne die unbewusste Matrix hinter wiederkehrenden Rollen, Schutzmustern und Entscheidungen. Mit Matrix-Gespräch, Online-Begleitung und Rauhnächten.",
      ...zepterImage,
      contentLanguage: "de",
    },
    "/vortrag-13-wochen-programm": {
      title: "Wer schreibt dein inneres Drehbuch? | Spirit Healing",
      description: "Kostenloser aufgezeichneter Vortrag über deine persönliche Matrix, Rollen und Muster. Nach der Anmeldung sofort starten und sieben Tage lang ansehen.",
      ...zepterImage,
      contentLanguage: "de",
    },
    "/vortrag-13-wochen-programm/ansehen": {
      title: "Dein Online-Vortrag | Spirit Healing",
      description: "Persönlicher Zugang zum Spirit-Healing-Online-Vortrag.",
      noindex: true,
    },
    "/rauhnaechte": {
      title: "Rauhnächte 2026/2027: Begleitung & Rituale | Spirit Healing",
      description: "Zwölf geführte Rauhnächte mit Meditationen, Ritualen, Journal, täglichen Impulsen und Live-Begleitung von Sabine und Selcan.",
      ...rauhnaechteImage,
      contentLanguage: "de",
    },
    "/gratis-meditationen": {
      title: "İki ücretsiz seminer, çalışma kitabı ve meditasyon | Spirit Healing",
      description: "Ücretsiz kayıttan sonra iki Ekim seminerini, “Yeni bir bakış açısı” çalışma kitabını ve “İçsel parçanın armağanı” meditasyonunu açın.",
      image: "/images/meditations/das-geschenk-deines-anteils.jpg",
      imageWidth: "1080",
      imageHeight: "1080",
      imageAlt: "İçsel parçanın armağanı – Spirit Healing meditasyonu",
    },
    "/kontakt": { title: "İletişim ve Tanışma Görüşmesi | Spirit Healing", description: "Sabine ve Selcan ile iletişime geçin veya ücretsiz, bağlayıcı olmayan bir tanışma görüşmesi planlayın." },
    "/impressum": { title: "Künye | Spirit Healing", description: sharedTurkishDescription },
    "/datenschutz": { title: "Gizlilik | Spirit Healing", description: sharedTurkishDescription },
    "/mitglieder": { title: "Üye Alanı | Spirit Healing", description: "Spirit Healing korumalı üye alanı.", noindex: true },
    "/newsletter/status": { title: "Bülten Durumu | Spirit Healing", description: "Spirit Healing bülten kaydınızın durumu.", noindex: true },
    "/admin": { title: "Yönetim Alanı | Spirit Healing", description: "Korumalı yönetim alanı.", noindex: true },
    "/startfragebogen": { title: "Başlangıç Formu | Spirit Healing", description: "Katılımcılar için kişisel başlangıç formu.", noindex: true },
    "/terminumfrage": { title: "Randevu Anketi | Spirit Healing", description: "Katılımcılar için dahili randevu anketi.", noindex: true },
  },
}

export const indexablePaths = Object.freeze([
  "/",
  "/coaching",
  "/therapie",
  "/about",
  "/prices",
  "/termin-buchen",
  "/faq",
  "/vortraege-seminare",
  "/aufstellungsarbeit",
  "/berlin-live",
  ...constellationDays.map(day => `/berlin-live/${day.id}`),
  "/13-wochen-programm",
  "/vortrag-13-wochen-programm",
  "/live-vortrag",
  "/live-vortrag/aufzeichnung",
  "/live-vortrag/20-oktober",
  "/live-vortrag/3-november",
  "/live-vortrag/familienaufstellung",
  "/rauhnaechte",
  "/gratis-meditationen",
  "/kontakt",
  "/impressum",
  "/datenschutz",
])

const noindexPrefixes = ["/mitglieder", "/admin", "/startfragebogen", "/abschlussfragebogen", "/terminumfrage", "/newsletter/status"]

export const normalizePathname = (pathname = "/") => {
  const clean = String(pathname || "/").split("?")[0].split("#")[0]
  if (clean === "/") return clean
  return clean.replace(/\/+$/u, "") || "/"
}

export const metadataForPath = (pathname, language = "de") => {
  const normalizedPath = normalizePathname(pathname)
  if (normalizedPath === '/abschlussfragebogen') return { title: 'Abschlussfragebogen | Spirit Healing', description: 'Dein heutiger Stand und dein weiterer Weg nach acht Wochen.', pathname: normalizedPath, noindex: true, notFound: false, contentLanguage: 'de' }
  const day = constellationDays.find(item => normalizedPath === `/berlin-live/${item.id}`)
  if (day) {
    const date = constellationDate(day.date, language).replace(/^[^,]+, /u, "")
    return { ...berlinImage, pathname: normalizedPath, notFound: false,
      title: language === "tr" ? `${date} · Berlin dizim günü | Spirit Healing` : `${date} · Aufstellung in Berlin | Spirit Healing`,
      description: language === "tr"
        ? `${date}: Sabine ve Selcan ile ${day.language === "tr" ? "Türkçe" : "Almanca"} dizim çalışması. Berlin-Kreuzberg, 10:00–19:00. Temsilci 22 € veya 44 €, kendi dizimi 160 €.`
        : `${date}: Aufstellungstag mit Sabine und Selcan auf ${day.language === "tr" ? "Türkisch" : "Deutsch"}. Berlin-Kreuzberg, 10–19 Uhr. Stellvertretung 22 € oder 44 €, eigene Aufstellung 160 €.`,
    }
  }
  const exact = pageMeta[language]?.[normalizedPath] || pageMeta.de[normalizedPath]
  if (exact) return { ...exact, pathname: normalizedPath, notFound: false }

  const protectedPrefix = noindexPrefixes.find((prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`))
  if (protectedPrefix) {
    const protectedMeta = pageMeta[language]?.[protectedPrefix] || pageMeta.de[protectedPrefix]
    return { ...protectedMeta, pathname: normalizedPath, noindex: true, notFound: false }
  }

  return {
    title: language === "tr" ? "Sayfa bulunamadı | Spirit Healing" : "Seite nicht gefunden | Spirit Healing",
    description: language === "tr" ? "Aradığınız sayfa bulunamadı." : "Die gesuchte Seite wurde nicht gefunden.",
    pathname: normalizedPath,
    noindex: true,
    notFound: true,
  }
}

export const canonicalUrlFor = (pathname) => {
  const normalizedPath = normalizePathname(pathname)
  return `${siteUrl}${normalizedPath === "/" ? "" : normalizedPath}`
}

export const canonicalUrlForLanguage = (pathname, language = "de") => {
  const canonical = canonicalUrlFor(pathname)
  return isConstellationPath(normalizePathname(pathname)) && language === "tr"
    ? `${canonical}?lang=tr`
    : canonical
}

export const socialImageFor = (meta) => meta.image ? new URL(meta.image, siteUrl).href : defaultSocialImage

const breadcrumbParents = {
  "/aufstellungsarbeit": "/",
  "/berlin-live": "/aufstellungsarbeit",
  ...Object.fromEntries(constellationDays.map(day => [`/berlin-live/${day.id}`, "/berlin-live"])),
  "/13-wochen-programm": "/vortraege-seminare",
  "/rauhnaechte": "/vortraege-seminare",
  "/termin-buchen": "/prices",
}

const breadcrumbLabels = {
  de: {
    "/": "Spirit Healing",
    "/coaching": "Prozessbegleitung",
    "/therapie": "Integrative Therapie",
    "/about": "Über uns",
    "/prices": "Preise & Termine",
    "/termin-buchen": "Termin buchen",
    "/faq": "Häufige Fragen",
    "/vortraege-seminare": "Vorträge & Seminare",
    "/aufstellungsarbeit": "Aufstellungsarbeit",
    "/berlin-live": "Live-Aufstellung in Berlin",
    ...Object.fromEntries(constellationDays.map(day => [`/berlin-live/${day.id}`, constellationDate(day.date, "de")])),
    "/13-wochen-programm": "13-Wochen-Programm",
    "/rauhnaechte": "Rauhnächte 2026/2027",
    "/gratis-meditationen": "Kostenlose Meditationen",
    "/kontakt": "Kontakt",
    "/impressum": "Impressum",
    "/datenschutz": "Datenschutz",
  },
  tr: {
    "/": "Spirit Healing",
    "/coaching": "Süreç Danışmanlığı",
    "/therapie": "Bütüncül Terapi",
    "/about": "Hakkımızda",
    "/prices": "Ücretler ve Randevular",
    "/termin-buchen": "Randevu Al",
    "/faq": "Sıkça Sorulan Sorular",
    "/vortraege-seminare": "Seminerler ve Eğitimler",
    "/aufstellungsarbeit": "Dizim çalışması",
    "/berlin-live": "Berlin’de canlı dizim",
    ...Object.fromEntries(constellationDays.map(day => [`/berlin-live/${day.id}`, constellationDate(day.date, "tr")])),
    "/13-wochen-programm": "13-Wochen-Programm",
    "/rauhnaechte": "Rauhnächte 2026/2027",
    "/gratis-meditationen": "Ücretsiz Meditasyonlar",
    "/kontakt": "İletişim",
    "/impressum": "Künye",
    "/datenschutz": "Gizlilik",
  },
}

const organization = {
  "@type": "Organization",
  "@id": organizationId,
  name: "Spirit Healing",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: defaultSocialImage,
    width: 1254,
    height: 1254,
  },
  email: "info@spirit-healing.tr",
  telephone: "+49 177 5022131",
  founder: [
    { "@type": "Person", name: "Sabine Schmidt" },
    { "@type": "Person", name: "Selcan Yilmaz" },
  ],
  sameAs: [
    "https://www.instagram.com/spirit4healing/",
    "https://www.facebook.com/profile.php?id=61588723230682",
  ],
}

const website = {
  "@type": "WebSite",
  "@id": websiteId,
  url: siteUrl,
  name: "Spirit Healing",
  alternateName: "Spirit Healing – Sabine & Selcan",
  publisher: { "@id": organizationId },
}

const breadcrumbFor = (pathname, language) => {
  if (pathname === "/") return null
  const paths = [pathname]
  let parent = breadcrumbParents[pathname]
  while (parent && parent !== "/") { paths.unshift(parent); parent = breadcrumbParents[parent] }
  paths.unshift("/")
  const breadcrumbUrl = canonicalUrlForLanguage(pathname, language)
  return {
    "@type": "BreadcrumbList",
    "@id": `${breadcrumbUrl}#breadcrumb`,
    itemListElement: paths.map((path, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumbLabels[language]?.[path] || breadcrumbLabels.de[path] || "Spirit Healing",
      item: path === pathname ? breadcrumbUrl : canonicalUrlForLanguage(path, language),
    })),
  }
}

export const structuredDataForPath = (pathname, language = "de", providedMeta) => {
  const meta = providedMeta || metadataForPath(pathname, language)
  const normalizedPath = meta.pathname || normalizePathname(pathname)
  if (meta.noindex || meta.notFound) return []

  const url = canonicalUrlForLanguage(normalizedPath, language)
  const breadcrumb = breadcrumbFor(normalizedPath, language)
  const pageType = normalizedPath === "/about"
    ? "AboutPage"
    : normalizedPath === "/kontakt"
      ? "ContactPage"
      : ["/prices", "/termin-buchen", "/vortraege-seminare", "/gratis-meditationen"].includes(normalizedPath)
        ? "CollectionPage"
        : "WebPage"
  const page = {
    "@type": pageType,
    "@id": `${url || siteUrl}#webpage`,
    url: url || siteUrl,
    name: meta.title,
    description: meta.description,
    inLanguage: language,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    ...(breadcrumb ? { breadcrumb: { "@id": breadcrumb["@id"] } } : {}),
    ...(meta.image ? {
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: socialImageFor(meta),
        width: Number(meta.imageWidth),
        height: Number(meta.imageHeight),
      },
    } : {}),
  }

  const graph = [website, organization, page]
  if (breadcrumb) graph.push(breadcrumb)

  if (["/coaching", "/therapie"].includes(normalizedPath)) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: meta.title.split("|")[0].trim(),
      description: meta.description,
      url,
      provider: { "@id": organizationId },
      areaServed: ["DE", "AT", "CH", "TR"],
      availableChannel: { "@type": "ServiceChannel", serviceUrl: `${siteUrl}/termin-buchen` },
    })
  }

  if (normalizedPath === "/berlin-live" || normalizedPath.startsWith("/berlin-live/")) {
    const isTurkish = language === "tr"
    const location = constellationPlace ? {
      "@type": "Place",
      name: constellationPlace,
      address: { "@type": "PostalAddress", addressLocality: constellationPlace, addressCountry: "DE" },
    } : undefined
    const eventDays = normalizedPath === "/berlin-live" ? constellationDays : constellationDays.filter(day => normalizedPath === `/berlin-live/${day.id}`)
    graph.push(...eventDays.map((day) => ({
      "@type": "Event",
      "@id": `${siteUrl}${constellationDayPath(day, language)}#event`,
      url: `${siteUrl}${constellationDayPath(day, language)}`,
      name: isTurkish ? `Dizim çalışması · ${day.id} · ${day.language === "tr" ? "Türkçe" : "Almanca"}` : `Aufstellungsarbeit · ${day.id} · ${day.language === "tr" ? "Türkisch" : "Deutsch"}`,
      description: meta.description,
      startDate: constellationTime ? `${day.date}T10:00:00+01:00` : day.date,
      endDate: constellationTime ? `${day.date}T19:00:00+01:00` : day.date,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      image: [socialImageFor(meta)],
      maximumAttendeeCapacity: constellationCapacity.total,
      ...(location ? { location } : {}),
      organizer: { "@id": organizationId },
      offers: ["returning", "new", "own"].map((type) => ({
        "@type": "Offer",
        name: isTurkish
          ? ({ returning: "Temsilci · önceki katılımcı veya Spirit Healing üyesi", new: "Temsilci · yeni katılımcı", own: "Kendi dizimi" })[type]
          : ({ returning: "Stellvertretung · früher dabei oder Spirit Healing zugehörig", new: "Stellvertretung · neu dabei", own: "Eigene Aufstellung" })[type],
        price: String(constellationTicketPrices[type]),
        priceCurrency: "EUR",
        url: day.links[type] || `${siteUrl}${constellationDayPath(day, language)}`,
      })),
    })))
  }

  if (normalizedPath === "/13-wochen-programm") {
    graph.push({
      "@type": "Course",
      "@id": `${url}#course`,
      name: "Das Zepter wieder übernehmen – 13-Wochen-Programm",
      description: meta.description,
      url,
      provider: { "@id": organizationId },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        startDate: "2026-11-11",
        endDate: "2027-02-03",
        inLanguage: "de",
      },
      offers: [
        { "@type": "Offer", name: "Gemeinsamer Weg", price: "1555", priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${url}#teilnahme` },
        { "@type": "Offer", name: "Vertiefter Weg", price: "2777", priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${url}#teilnahme` },
        { "@type": "Offer", name: "Persönlicher Weg", price: "4777", priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${url}#teilnahme` },
      ],
    })
  }

  if (normalizedPath === "/rauhnaechte") {
    graph.push({
      "@type": "Course",
      "@id": `${url}#course`,
      name: "Die Rauhnächte mit Spirit Healing 2026/2027",
      description: meta.description,
      url,
      provider: { "@id": organizationId },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        startDate: "2026-12-23",
        endDate: "2027-01-06",
        inLanguage: "de",
      },
      offers: [
        { "@type": "Offer", name: "Rauhnächte-Begleitung", price: "222", priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${url}#rauhnaechte-buchen` },
        { "@type": "Offer", name: "Rauhnächte persönlich", price: "444", priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${url}#rauhnaechte-buchen` },
      ],
    })
  }

  return [{ "@context": "https://schema.org", "@graph": graph }]
}
