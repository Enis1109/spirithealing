import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ContentContext = createContext({ content: {}, loading: true });

export const ContentProvider = ({ children }) => {
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        fetch("/api/content", { headers: { Accept: "application/json" }, cache: "no-store" })
            .then(async (response) => {
                if (!response.ok) throw new Error("content_unavailable");
                return response.json();
            })
            .then((result) => {
                if (active && result?.ok) setContent(result.content || {});
            })
            .catch(() => undefined)
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, []);

    const value = useMemo(() => ({ content, loading }), [content, loading]);
    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePublishedContent = () => useContext(ContentContext);
