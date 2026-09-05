import {
  canonicalUrlForLanguage,
  metadataForPath,
  normalizePathname,
  siteUrl,
  socialImageFor,
  structuredDataForPath,
} from "../src/seo/pageMeta.js"

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")

export const injectSeoIntoDocument = (frontendDocument, requestPath) => {
  const requestUrl = new URL(String(requestPath || "/"), siteUrl)
  const pathname = normalizePathname(requestUrl.pathname)
  const language = pathname === "/berlin-live" && requestUrl.searchParams.get("lang") === "tr" ? "tr" : "de"
  const meta = metadataForPath(pathname, language)
  const canonical = canonicalUrlForLanguage(meta.pathname, language)
  const image = socialImageFor(meta)
  const imageAlt = meta.imageAlt || "Spirit Healing"
  const robots = meta.noindex
    ? "noindex, follow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  const contentLanguage = meta.contentLanguage || language
  const structuredData = JSON.stringify(structuredDataForPath(meta.pathname, contentLanguage, meta)).replaceAll("<", "\\u003c")
  const berlinLanguageLinks = pathname === "/berlin-live"
    ? [
      `<link rel="alternate" hreflang="de" href="${escapeHtml(canonicalUrlForLanguage(pathname, "de"))}" data-spirit-healing-hreflang="true" />`,
      `<link rel="alternate" hreflang="tr" href="${escapeHtml(canonicalUrlForLanguage(pathname, "tr"))}" data-spirit-healing-hreflang="true" />`,
      `<link rel="alternate" hreflang="x-default" href="${escapeHtml(canonicalUrlForLanguage(pathname, "de"))}" data-spirit-healing-hreflang="true" />`,
    ]
    : []
  const additionalHead = [
    `<meta name="googlebot" content="${robots}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:width" content="${escapeHtml(meta.imageWidth || "1254")}" />`,
    `<meta property="og:image:height" content="${escapeHtml(meta.imageHeight || "1254")}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
    `<meta property="og:locale" content="${contentLanguage === "tr" ? "tr_TR" : "de_DE"}" />`,
    `<meta property="og:locale:alternate" content="${contentLanguage === "tr" ? "de_DE" : "tr_TR"}" />`,
    ...berlinLanguageLinks,
    ...(structuredData === "[]" ? [] : [`<script type="application/ld+json" data-spirit-healing-seo="true">${structuredData}</script>`]),
  ].join("\n    ")

  return frontendDocument
    .replace(/<html lang="[^"]*">/u, `<html lang="${escapeHtml(contentLanguage)}">`)
    .replace(/<title>[^<]*<\/title>/u, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/u, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<meta name="robots"[^>]*>/u, `<meta name="robots" content="${robots}" />`)
    .replace(/<link rel="canonical"[^>]*>/u, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
    .replace(/<meta property="og:title"[^>]*>/u, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/u, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/u, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
    .replace(/<meta property="og:image"[^>]*>/u, `<meta property="og:image" content="${escapeHtml(image)}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/u, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/u, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<meta name="twitter:image"[^>]*>/u, `<meta name="twitter:image" content="${escapeHtml(image)}" />`)
    .replace(/<meta name="twitter:image:alt"[^>]*>/u, `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`)
    .replace("</head>", `    ${additionalHead}\n  </head>`)
}
