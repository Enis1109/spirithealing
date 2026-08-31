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
    "/berlin-live": {
      title: "Familienaufstellung Berlin 2026 | Spirit Healing",
      description: "Familienaufstellung in Berlin am 9. und 10. Oktober 2026 mit Sabine und Selcan. Mit eigener Aufstellung oder als intensive Teilnahme buchbar.",
      ...berlinImage,
    },
    "/13-wochen-programm": {
      title: "13-Wochen-Programm: Das Zepter übernehmen | Spirit Healing",
      description: "Erkenne die unbewusste Matrix hinter wiederkehrenden Rollen, Schutzmustern und Entscheidungen. 13 Wochen mit Matrix-Gespräch, Live-Begleitung und Rauhnächten.",
      ...zepterImage,
      contentLanguage: "de",
    },
    "/rauhnaechte": {
      title: "Rauhnächte 2026/2027: Begleitung & Rituale | Spirit Healing",
      description: "Zwölf geführte Rauhnächte mit Meditationen, Ritualen, Journal, täglichen Impulsen und Live-Begleitung von Sabine und Selcan. Jetzt online buchen.",
      ...rauhnaechteImage,
      contentLanguage: "de",
    },
    "/gratis-meditationen": {
      title: "Kostenlose Meditationen & Vortrag | Spirit Healing",
      description: "Drei geführte Meditationen, einen Spirit-Healing-Vortrag und das begleitende Workbook kostenlos im geschützten Bereich nutzen.",
      image: "/images/meditations/loslassen-reinigen.png",
      imageWidth: "1254",
      imageHeight: "1254",
      imageAlt: "Kostenlose geführte Meditation von Spirit Healing",
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
    "/berlin-live": {
      title: "Berlin Aile Dizimi 2026 | Spirit Healing",
      description: "9 ve 10 Ekim 2026 tarihlerinde Sabine ve Selcan ile Berlin'de iki günlük aile dizimi çalışması.",
      ...berlinImage,
      imageAlt: "Spirit Healing ile Berlin'de aile dizimi",
    },
    "/13-wochen-programm": {
      title: "13-Wochen-Programm: Das Zepter übernehmen | Spirit Healing",
      description: "Erkenne die unbewusste Matrix hinter wiederkehrenden Rollen, Schutzmustern und Entscheidungen. Mit Matrix-Gespräch, Live-Begleitung und Rauhnächten.",
      ...zepterImage,
      contentLanguage: "de",
    },
    "/rauhnaechte": {
      title: "Rauhnächte 2026/2027: Begleitung & Rituale | Spirit Healing",
      description: "Zwölf geführte Rauhnächte mit Meditationen, Ritualen, Journal, täglichen Impulsen und Live-Begleitung von Sabine und Selcan.",
      ...rauhnaechteImage,
      contentLanguage: "de",
    },
    "/gratis-meditationen": {
      title: "Ücretsiz Meditasyonlar ve Seminer | Spirit Healing",
      description: "Üç rehberli meditasyonu dinleyin, Spirit Healing seminerini izleyin ve çalışma kitabını ücretsiz kullanın.",
      image: "/images/meditations/loslassen-reinigen.png",
      imageWidth: "1254",
      imageHeight: "1254",
      imageAlt: "Spirit Healing ücretsiz rehberli meditasyonu",
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
  "/berlin-live",
  "/13-wochen-programm",
  "/rauhnaechte",
  "/gratis-meditationen",
  "/kontakt",
  "/impressum",
  "/datenschutz",
])

const noindexPrefixes = ["/mitglieder", "/admin", "/startfragebogen", "/terminumfrage", "/newsletter/status"]

export const normalizePathname = (pathname = "/") => {
  const clean = String(pathname || "/").split("?")[0].split("#")[0]
  if (clean === "/") return clean
  return clean.replace(/\/+$/u, "") || "/"
}

export const metadataForPath = (pathname, language = "de") => {
  const normalizedPath = normalizePathname(pathname)
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

export const socialImageFor = (meta) => meta.image ? new URL(meta.image, siteUrl).href : defaultSocialImage

const breadcrumbParents = {
  "/berlin-live": "/vortraege-seminare",
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
    "/berlin-live": "Familienaufstellung Berlin",
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
    "/berlin-live": "Berlin Aile Dizimi",
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
  const parent = breadcrumbParents[pathname]
  const paths = parent ? ["/", parent, pathname] : ["/", pathname]
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrlFor(pathname)}#breadcrumb`,
    itemListElement: paths.map((path, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumbLabels[language]?.[path] || breadcrumbLabels.de[path] || "Spirit Healing",
      item: canonicalUrlFor(path),
    })),
  }
}

export const structuredDataForPath = (pathname, language = "de", providedMeta) => {
  const meta = providedMeta || metadataForPath(pathname, language)
  const normalizedPath = meta.pathname || normalizePathname(pathname)
  if (meta.noindex || meta.notFound) return []

  const url = canonicalUrlFor(normalizedPath)
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

  if (normalizedPath === "/berlin-live") {
    graph.push({
      "@type": "Event",
      "@id": `${url}#event`,
      name: "Familienaufstellung live in Berlin",
      description: meta.description,
      startDate: "2026-10-09T10:00:00+02:00",
      endDate: "2026-10-10T19:00:00+02:00",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      image: [socialImageFor(meta)],
      location: {
        "@type": "Place",
        name: "Berlin",
        address: { "@type": "PostalAddress", addressLocality: "Berlin", addressCountry: "DE" },
      },
      organizer: { "@id": organizationId },
      offers: [
        { "@type": "Offer", name: "Intensivteilnahme", price: "333", priceCurrency: "EUR", availability: "https://schema.org/LimitedAvailability", url: `${url}#tickets` },
        { "@type": "Offer", name: "Platz mit eigener Aufstellung", price: "444", priceCurrency: "EUR", availability: "https://schema.org/LimitedAvailability", url: `${url}#tickets` },
      ],
    })
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
        startDate: "2026-10-21",
        endDate: "2027-01-13",
        inLanguage: "de",
      },
      offers: [
        { "@type": "Offer", name: "Gemeinsamer Weg", price: "1555", priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${url}#teilnahme` },
        { "@type": "Offer", name: "Vertiefter Weg", price: "2777", priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${url}#teilnahme` },
        { "@type": "Offer", name: "Persönlicher Weg", price: "4444", priceCurrency: "EUR", availability: "https://schema.org/LimitedAvailability", url: `${url}#teilnahme` },
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
