import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { pageMeta, turkishTranslations, turkishTranslationsByPath } from "@/i18n/translations";

const translatedAttributes = ["aria-label", "alt", "placeholder", "title"];

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
    const { pathname } = useLocation();
    const originalText = useRef(new WeakMap());
    const originalAttributes = useRef(new WeakMap());

    useLayoutEffect(() => {
        const translateTextNode = (node) => {
            if (isExcluded(node)) return;

            if (language === "de") {
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

            for (const attribute of translatedAttributes) {
                const currentValue = element.getAttribute?.(attribute);
                if (!currentValue) continue;

                let originals = originalAttributes.current.get(element);

                if (language === "de") {
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

        const routeMeta = pageMeta[language]?.[pathname] ?? pageMeta[language]?.["/"];
        if (routeMeta) {
            document.title = routeMeta.title;
            let description = document.querySelector('meta[name="description"]');
            if (!description) {
                description = document.createElement("meta");
                description.setAttribute("name", "description");
                document.head.appendChild(description);
            }
            description.setAttribute("content", routeMeta.description);
        }

        return () => observer.disconnect();
    }, [language, pathname]);

    return null;
};
