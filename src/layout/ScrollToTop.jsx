import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            let id;
            try { id = decodeURIComponent(hash.slice(1)); } catch { return undefined; }
            const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 0);
            return () => window.clearTimeout(timer);
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);

    return null;
}
export default ScrollToTop
