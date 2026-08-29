import { assistantAdminCatalog } from "@/components/assistantKnowledge";
import { aboutContent } from "@/sections/About";
import { contactContent } from "@/sections/Contact";
import { faqContent } from "@/sections/FAQ";
import { homeHeroContent } from "@/sections/Herotest";
import { berlinLiveContentFields } from "@/content/berlinLiveContent";

const pageEntry = ({ key, section, group = section, label, de, tr, compact = false, languages = ["de", "tr"] }) => ({
    key,
    section,
    group,
    label,
    compact,
    languages,
    defaults: { de, tr },
});

const pageEntries = [
    pageEntry({ key: "home.hero.heading-main", section: "Startseite", label: "Hauptüberschrift – erster Teil", de: homeHeroContent.de.headingMain, tr: homeHeroContent.tr.headingMain, compact: true }),
    pageEntry({ key: "home.hero.heading-accent", section: "Startseite", label: "Hauptüberschrift – hervorgehobener Teil", de: homeHeroContent.de.headingAccent, tr: homeHeroContent.tr.headingAccent, compact: true }),
    pageEntry({ key: "home.hero.subtitle", section: "Startseite", label: "Unterzeile im Hauptbereich", de: homeHeroContent.de.subtitle, tr: homeHeroContent.tr.subtitle }),
    pageEntry({ key: "home.hero.intro", section: "Startseite", label: "Einleitung im Hauptbereich", de: homeHeroContent.de.intro, tr: homeHeroContent.tr.intro }),
    pageEntry({ key: "home.hero.cta", section: "Startseite", label: "Beschriftung der Kontakt-Schaltfläche", de: homeHeroContent.de.cta, tr: homeHeroContent.tr.cta, compact: true }),

    pageEntry({ key: "about.eyebrow", section: "Über uns", label: "Kleine Überschrift", de: aboutContent.de.eyebrow, tr: aboutContent.tr.eyebrow, compact: true }),
    pageEntry({ key: "about.title-start", section: "Über uns", label: "Hauptüberschrift – erster Teil", de: aboutContent.de.titleStart, tr: aboutContent.tr.titleStart }),
    pageEntry({ key: "about.title-accent", section: "Über uns", label: "Hauptüberschrift – hervorgehobener Teil", de: aboutContent.de.titleAccent, tr: aboutContent.tr.titleAccent }),
    pageEntry({ key: "about.intro", section: "Über uns", label: "Einleitung", de: aboutContent.de.intro, tr: aboutContent.tr.intro }),
    pageEntry({ key: "about.intro-strong", section: "Über uns", label: "Hervorgehobener Einleitungssatz", de: aboutContent.de.introStrong, tr: aboutContent.tr.introStrong }),

    pageEntry({ key: "contact.eyebrow", section: "Kontakt", label: "Kleine Überschrift", de: contactContent.de.eyebrow, tr: contactContent.tr.eyebrow, compact: true }),
    pageEntry({ key: "contact.title", section: "Kontakt", label: "Hauptüberschrift", de: contactContent.de.title, tr: contactContent.tr.title }),
    pageEntry({ key: "contact.intro", section: "Kontakt", label: "Einleitung", de: contactContent.de.intro, tr: contactContent.tr.intro }),
    pageEntry({ key: "contact.direct-text", section: "Kontakt", label: "Text beim direkten Kontakt", de: contactContent.de.directText, tr: contactContent.tr.directText }),
    pageEntry({ key: "contact.form-card-title", section: "Kontakt", label: "Überschrift der Kontaktkarte", de: contactContent.de.formCardTitle, tr: contactContent.tr.formCardTitle }),
    pageEntry({ key: "contact.form-card-text", section: "Kontakt", label: "Text der Kontaktkarte", de: contactContent.de.formCardText, tr: contactContent.tr.formCardText }),

    pageEntry({ key: "faq.eyebrow", section: "FAQ", label: "Kleine Überschrift", de: faqContent.de.eyebrow, tr: faqContent.tr.eyebrow, compact: true }),
    pageEntry({ key: "faq.title", section: "FAQ", label: "Hauptüberschrift", de: faqContent.de.title, tr: faqContent.tr.title }),
    pageEntry({ key: "faq.intro", section: "FAQ", label: "Einleitung", de: faqContent.de.intro, tr: faqContent.tr.intro }),
    pageEntry({ key: "faq.still-eyebrow", section: "FAQ", label: "Abschluss – kleine Überschrift", de: faqContent.de.stillEyebrow, tr: faqContent.tr.stillEyebrow, compact: true }),
    pageEntry({ key: "faq.still-question", section: "FAQ", label: "Abschluss – Überschrift", de: faqContent.de.stillQuestion, tr: faqContent.tr.stillQuestion }),
    pageEntry({ key: "faq.still-text", section: "FAQ", label: "Abschluss – Text", de: faqContent.de.stillText, tr: faqContent.tr.stillText }),
];

berlinLiveContentFields.forEach((item) => {
    pageEntries.push(pageEntry({
        key: item.key,
        section: "Berlin Live",
        group: item.group,
        label: item.label,
        de: item.value,
        tr: item.value,
        compact: item.compact,
        languages: ["de"],
    }));
});

faqContent.de.groups.forEach((group, groupIndex) => {
    pageEntries.push(pageEntry({
        key: `faq.group-${groupIndex}.label`,
        section: "FAQ",
        label: `Bereich: ${group.label}`,
        de: group.label,
        tr: faqContent.tr.groups[groupIndex].label,
        compact: true,
    }));

    group.items.forEach((item, itemIndex) => {
        const turkishItem = faqContent.tr.groups[groupIndex].items[itemIndex];
        pageEntries.push(pageEntry({
            key: `faq.group-${groupIndex}.item-${itemIndex}.question`,
            section: "FAQ",
            label: `Frage: ${item.question}`,
            de: item.question,
            tr: turkishItem.question,
        }));
        pageEntries.push(pageEntry({
            key: `faq.group-${groupIndex}.item-${itemIndex}.answer`,
            section: "FAQ",
            label: `Antwort: ${item.question}`,
            de: item.answer.join("\n\n"),
            tr: turkishItem.answer.join("\n\n"),
        }));
    });
});

export const pageContentCatalog = Object.freeze(pageEntries);

export const assistantContentCatalog = Object.freeze(assistantAdminCatalog.map((topic) => ({
    ...topic,
    answerKey: `assistant.${topic.id}.answer`,
    termsKey: `assistant.${topic.id}.terms`,
})));

export const adminCatalogStats = Object.freeze({
    pageFields: pageContentCatalog.length,
    assistantTopics: assistantContentCatalog.length,
});
