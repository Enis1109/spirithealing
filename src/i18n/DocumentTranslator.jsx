import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { turkishTranslations, turkishTranslationsByPath } from "@/i18n/translations";
import {
    canonicalUrlForLanguage,
    metadataForPath,
    socialImageFor,
    structuredDataForPath,
} from "@/seo/pageMeta";

const translatedAttributes = ["aria-label", "alt", "placeholder", "title"];

const upsertMeta = (selector, attributes) => {
    let element = document.head.querySelector(selector);
    if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
};

const upsertLink = (rel, href) => {
    let element = document.head.querySelector(`link[rel="${rel}"]`);
    if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
    }
    element.setAttribute("href", href);
};

const syncBerlinLanguageLinks = (pathname) => {
    const selector = 'link[data-spirit-healing-hreflang="true"]';
    const existing = [...document.head.querySelectorAll(selector)];
    if (pathname !== "/berlin-live") {
        existing.forEach((element) => element.remove());
        return;
    }

    const languages = [
        ["de", canonicalUrlForLanguage(pathname, "de")],
        ["tr", canonicalUrlForLanguage(pathname, "tr")],
        ["x-default", canonicalUrlForLanguage(pathname, "de")],
    ];
    languages.forEach(([hrefLang, href]) => {
        let element = document.head.querySelector(`${selector}[hreflang="${hrefLang}"]`);
        if (!element) {
            element = document.createElement("link");
            element.rel = "alternate";
            element.dataset.spiritHealingHreflang = "true";
            document.head.appendChild(element);
        }
        element.hreflang = hrefLang;
        element.href = href;
    });
};

const normalize = (value = "") => value.replace(/\s+/g, " ").trim();

const replacePreservingWhitespace = (value, replacement) => {
    const leadingWhitespace = value.match(/^\s*/)?.[0] ?? "";
    const trailingWhitespace = value.match(/\s*$/)?.[0] ?? "";
    return `${leadingWhitespace}${replacement}${trailingWhitespace}`;
};

const isExcluded = (node) => {
    const parent = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return Boolean(parent?.closest("script, style, noscript, [data-no-translate]"));
};

export const DocumentTranslator = () => {
    const { language } = useLanguage();
    const { pathname, search } = useLocation();
    const pageLanguage = pathname === "/berlin-live" && new URLSearchParams(search).get("lang") === "tr"
        ? "tr"
        : language;
    const originalText = useRef(new WeakMap());
    const originalAttributes = useRef(new WeakMap());

    useLayoutEffect(() => {
        const translateTextNode = (node) => {
            if (isExcluded(node)) return;

            if (pageLanguage === "de") {
                const original = originalText.current.get(node);
                if (original !== undefined && node.nodeValue !== original) {
                    node.nodeValue = original;
                }
                return;
            }

            const normalizedText = normalize(node.nodeValue);
            const translation = turkishTranslationsByPath[pathname]?.[normalizedText]
                ?? turkishTranslations[normalizedText];

            if (!translation) return;

            if (!originalText.current.has(node)) {
                originalText.current.set(node, node.nodeValue);
            }

            const translatedText = replacePreservingWhitespace(node.nodeValue, translation);
            if (node.nodeValue !== translatedText) {
                node.nodeValue = translatedText;
            }
        };

        const translateElementAttributes = (element) => {
            if (isExcluded(element)) return;

            if (element.tagName === "IMG" && !element.hasAttribute("alt")) {
                element.setAttribute("alt", "");
            }

            for (const attribute of translatedAttributes) {
                const currentValue = element.getAttribute?.(attribute);
                if (!currentValue) continue;

                let originals = originalAttributes.current.get(element);

                if (pageLanguage === "de") {
                    const original = originals?.get(attribute);
                    if (original !== undefined && currentValue !== original) {
                        element.setAttribute(attribute, original);
                    }
                    continue;
                }

                const normalizedValue = normalize(currentValue);
                const translation = turkishTranslationsByPath[pathname]?.[normalizedValue]
                    ?? turkishTranslations[normalizedValue];
                if (!translation) continue;

                if (!originals) {
                    originals = new Map();
                    originalAttributes.current.set(element, originals);
                }
                if (!originals.has(attribute)) originals.set(attribute, currentValue);
                if (currentValue !== translation) element.setAttribute(attribute, translation);
            }
        };

        const translateTree = (root) => {
            if (!root || isExcluded(root)) return;

            if (root.nodeType === Node.TEXT_NODE) {
                translateTextNode(root);
                return;
            }

            if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
                return;
            }

            if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root);

            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
            );

            let currentNode = walker.nextNode();
            while (currentNode) {
                if (currentNode.nodeType === Node.TEXT_NODE) translateTextNode(currentNode);
                if (currentNode.nodeType === Node.ELEMENT_NODE) translateElementAttributes(currentNode);
                currentNode = walker.nextNode();
            }
        };

        translateTree(document.body);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "characterData") translateTextNode(mutation.target);
                if (mutation.type === "attributes") translateElementAttributes(mutation.target);
                for (const node of mutation.addedNodes) translateTree(node);
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: translatedAttributes,
        });

        const routeMeta = metadataForPath(pathname, pageLanguage);
        if (routeMeta) {
            document.title = routeMeta.title;
            const canonicalUrl = canonicalUrlForLanguage(pathname, pageLanguage);
            const socialImage = socialImageFor(routeMeta);
            const socialImageAlt = routeMeta.imageAlt || "Spirit Healing";
            const contentLanguage = routeMeta.contentLanguage || pageLanguage;
            document.documentElement.lang = contentLanguage;
            upsertMeta('meta[name="description"]', { name: "description", content: routeMeta.description });
            upsertMeta('meta[name="robots"]', { name: "robots", content: routeMeta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large" });
            upsertMeta('meta[name="googlebot"]', { name: "googlebot", content: routeMeta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" });
            upsertMeta('meta[property="og:title"]', { property: "og:title", content: routeMeta.title });
            upsertMeta('meta[property="og:description"]', { property: "og:description", content: routeMeta.description });
            upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
            upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
            upsertMeta('meta[property="og:image"]', { property: "og:image", content: socialImage });
            upsertMeta('meta[property="og:image:secure_url"]', { property: "og:image:secure_url", content: socialImage });
            upsertMeta('meta[property="og:image:width"]', { property: "og:image:width", content: routeMeta.imageWidth || "1254" });
            upsertMeta('meta[property="og:image:height"]', { property: "og:image:height", content: routeMeta.imageHeight || "1254" });
            upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: socialImageAlt });
            upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: contentLanguage === "tr" ? "tr_TR" : "de_DE" });
            upsertMeta('meta[property="og:locale:alternate"]', { property: "og:locale:alternate", content: contentLanguage === "tr" ? "de_DE" : "tr_TR" });
            upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
            upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: routeMeta.title });
            upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: routeMeta.description });
            upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: socialImage });
            upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt", content: socialImageAlt });
            upsertLink("canonical", canonicalUrl);
            syncBerlinLanguageLinks(pathname);

            let structuredData = document.head.querySelector('script[data-spirit-healing-seo="true"]');
            if (!structuredData) {
                structuredData = document.createElement("script");
                structuredData.type = "application/ld+json";
                structuredData.dataset.spiritHealingSeo = "true";
                document.head.appendChild(structuredData);
            }
            structuredData.textContent = JSON.stringify(structuredDataForPath(pathname, contentLanguage, routeMeta)).replaceAll("<", "\\u003c");
        }

        return () => observer.disconnect();
    }, [pageLanguage, pathname, search]);

    return null;
};
