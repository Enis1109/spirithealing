import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);
export const LANGUAGE_SWITCHER_ENABLED = false;

const getInitialLanguage = () => {
    if (typeof window === "undefined") return "de";
    if (!LANGUAGE_SWITCHER_ENABLED) return "de";

    const storedLanguage = window.localStorage.getItem("spirit-healing-language");
    return storedLanguage === "tr" ? "tr" : "de";
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(getInitialLanguage);

    useEffect(() => {
        document.documentElement.lang = language;
        window.localStorage.setItem("spirit-healing-language", language);
    }, [language]);

    const value = useMemo(() => ({ language, setLanguage }), [language]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error("useLanguage must be used inside LanguageProvider");
    }

    return context;
};
