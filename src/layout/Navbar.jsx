import { Button } from "@/components/Button"
import { LockKeyhole, Menu, X } from "lucide-react";
import {useEffect, useState} from "react"
import { Link } from "react-router-dom";
import { LANGUAGE_SWITCHER_ENABLED, useLanguage } from "@/i18n/LanguageContext";

const navLinks = {
    de: [
        { href: "/coaching", label: "Prozessbegleitung" },
        { href: "/therapie", label: "Integrative Therapie" },
        { href: "/about", label: "Über uns" },
        { href: "/vortraege-seminare", label: "Vorträge & Seminare" },
        { href: "/mitglieder", label: "Mitgliederbereich", member: true },
        { href: "/prices", label: "Preise & Termine" },
        { href: "/faq", label: "FAQ" },
    ],
    tr: [
        { href: "/coaching", label: "Süreç Danışmanlığı" },
        { href: "/therapie", label: "Bütüncül Terapi" },
        { href: "/about", label: "Hakkımızda" },
        { href: "/vortraege-seminare", label: "Seminerler & Eğitimler" },
        { href: "/mitglieder", label: "Üye alanı", member: true },
        { href: "/prices", label: "Ücretler & Randevular" },
        { href: "/faq", label: "SSS" },
    ],
};

const LanguageSwitcher = ({ language, setLanguage, mobile = false }) => (
    <div
        className={mobile ? "flex items-center gap-1 self-start rounded-full bg-surface/70 p-1" : "flex items-center gap-1 rounded-full bg-surface/70 p-1"}
        aria-label={language === "tr" ? "Dil seçin" : "Sprache auswählen"}
    >
        <button
            type="button"
            onClick={() => setLanguage("de")}
            aria-pressed={language === "de"}
            className={language === "de" ? "rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground" : "rounded-full px-3 py-1 text-sm text-muted-foreground hover:text-primary"}
        >
            DE
        </button>
        <button
            type="button"
            onClick={() => setLanguage("tr")}
            aria-pressed={language === "tr"}
            className={language === "tr" ? "rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground" : "rounded-full px-3 py-1 text-sm text-muted-foreground hover:text-primary"}
        >
            TR
        </button>
    </div>
);

export const Navbar = () => {
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { language, setLanguage } = useLanguage();
    const links = navLinks[language];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
    <header className={isScrolled ? "glass-strong fixed inset-x-0 top-0 z-50 py-2 transition-all duration-500" : "fixed inset-x-0 top-0 z-50 bg-transparent py-2 transition-all duration-500"}>
        <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 sm:px-6">
            <Link
                to="/"
                className="flex items-center gap-2"
                aria-label={language === "tr" ? "Spirit Healing ana sayfası" : "Spirit Healing Startseite"}
            >
                <img
                    src="/Logo-tuerkis.jpeg"
                    alt="Spirit Healing Logo"
                    className="h-14 w-14 rounded-full object-cover shadow-lg shadow-primary/20 ring-2 ring-primary/80 sm:h-16 sm:w-16"
                />
                <span className={isScrolled ? "text-xl font-bold tracking-tight text-muted-foreground transition hover:text-primary sm:text-2xl" : "text-xl font-bold tracking-tight transition hover:text-primary sm:text-2xl"}>
                    Spirit Healing
                </span>
            </Link>
            {/*Navbar pc */}
            <div className="hidden xl:flex gap-1">
                <div className="glass rounded-full px-2 py-1 flex items-center gap-1">
                    {links.map((link) => (
                        <Link 
                            to={link.href}
                            key={link.href}
                            className={link.member
                                ? "inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-2 text-[13px] font-bold text-muted-foreground hover:bg-primary hover:text-primary-foreground 2xl:px-2.5 2xl:text-sm"
                                : "rounded-full px-2 py-2 text-[13px] text-muted-foreground hover:bg-surface hover:text-primary-foreground 2xl:px-2.5 2xl:text-sm"}
                        >
                            {link.member && <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />}
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="hidden xl:flex items-center gap-3">
                        {LANGUAGE_SWITCHER_ENABLED && <LanguageSwitcher language={language} setLanguage={setLanguage}/>}
                        <Button size="sm">
                            Kontakt
                        </Button>
                    </div>
            <button
                type="button"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-surface/65 p-2 text-muted-foreground shadow-sm xl:hidden"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label={isMobileMenuOpen
                    ? (language === "tr" ? "Menüyü kapat" : "Menü schließen")
                    : (language === "tr" ? "Menüyü aç" : "Menü öffnen")}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24}/>}
            </button>
        </nav>
        {isMobileMenuOpen && (
            <div id="mobile-navigation" className="glass-strong animate-fade-in xl:hidden">
                <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-6 py-6">
                    {links.map((link) => (
                            <Link 
                                to={link.href}
                                key={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={link.member
                                    ? "flex items-center gap-2 rounded-xl border border-primary/35 bg-primary/10 px-4 py-3 text-lg font-bold text-muted-foreground hover:bg-primary/20 hover:text-primary"
                                    : "rounded-xl py-2 text-lg text-muted-foreground hover:text-primary"}
                            >
                                {link.member && <LockKeyhole className="h-5 w-5 text-primary" aria-hidden="true" />}
                                {link.label}
                            </Link>
                        ))}
                    {LANGUAGE_SWITCHER_ENABLED && <LanguageSwitcher language={language} setLanguage={setLanguage} mobile/>}
                    <Button className="mt-1 w-full" onClick={() => setIsMobileMenuOpen(false)}>
                        Kontakt
                    </Button>
                </div>
            </div>
        )}
    </header>
    )
}
