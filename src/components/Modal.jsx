import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export const Modal = ({ open, onClose, title, closeLabel, children }) => {
    const titleId = useId();
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) return undefined;

        const previousOverflow = document.body.style.overflow;
        const previouslyFocused = document.activeElement;
        document.body.style.overflow = "hidden";

        const focusTimer = window.setTimeout(() => {
            dialogRef.current?.querySelector("input, select, textarea, button")?.focus();
        }, 0);

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onCloseRef.current();

            if (event.key === "Tab" && dialogRef.current) {
                const focusable = Array.from(dialogRef.current.querySelectorAll(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                ));
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            window.clearTimeout(focusTimer);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-[#012f31]/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="max-h-[94dvh] w-full overflow-y-auto rounded-t-[2rem] bg-[#f7f1e7] p-5 text-muted-foreground shadow-2xl sm:max-w-3xl sm:rounded-[2rem] sm:p-8 lg:max-w-4xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <h2 id={titleId} className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={closeLabel}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-white/70 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
                {children}
            </section>
        </div>,
        document.body,
    );
};
