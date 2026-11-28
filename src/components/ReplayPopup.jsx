import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '@/components/Modal';
import { useBlackFriday } from '@/components/BlackFridayOffers';
import './blackFriday.css';

const DISMISSED_KEY = 'spirit-black-friday-2026-dismissed';
export const ReplayPopup = () => {
    const [open, setOpen] = useState(false);
    const active = useBlackFriday();
    useEffect(() => {
        try { if (sessionStorage.getItem(DISMISSED_KEY) === 'yes') return; } catch { /* Private browsing is supported. */ }
        const timer = setTimeout(() => setOpen(true), 2200);
        return () => clearTimeout(timer);
    }, []);
    const close = useCallback(() => {
        setOpen(false);
        try { sessionStorage.setItem(DISMISSED_KEY, 'yes'); } catch { /* Closing remains available. */ }
    }, []);
    return <Modal open={open && active} onClose={close} title="Black Friday verlängert bis Cyber Monday" closeLabel="Angebotsfenster schließen" className="bf-dialog" decoration={<div className="bf-snow" aria-hidden="true">
            {Array.from({ length: 32 }, (_, index) => <span key={index} style={{
                left: `${(index * 37 + 7) % 100}%`,
                '--flake-size': `${3 + index % 4}px`,
                '--fall-time': `${8 + index % 7}s`,
                '--fall-delay': `${-(index * 1.7) % 14}s`,
                '--flake-drift': `${(index % 2 ? 1 : -1) * (18 + index % 35)}px`,
            }}/>) }
        </div>}>
        <div lang="de" data-no-translate className="bf-content">
            <div className="bf-brand"><img src="/Logo-tuerkis.jpeg?v=20260730" alt="Spirit Healing" width="48" height="48"/><span>Mit Sabine & Selcan</span><span className="bf-until">Bis 30.11. · 23:59 Uhr</span></div>
            <div className="bf-grid">
                <article className="bf-raun">
                    <img src="/rauhnaechte-spirit-healing.png" alt="Sabine und Selcan im Kerzenlicht" className="bf-photo"/>
                    <div className="bf-raun-copy"><p className="bf-kicker">23. Dezember – 6. Januar</p><h3>Was möchtest du 2027<br/><em>in die Welt bringen?</em></h3><p>Unsere gemeinsame Rauhnachtsbegleitung.</p><p className="bf-price">88 € <del>111 €</del></p><Link to="/rauhnaechte" onClick={close} className="bf-button bf-gold">Rauhnächte entdecken<ArrowUpRight size={20} aria-hidden="true"/></Link></div>
                </article>
                <article className="bf-session"><p className="bf-kicker">Dein Anliegen. Unser gemeinsamer Raum.</p><p className="bf-discount">−30<span>%</span></p><h3>Für deine<br/>nächste Sitzung.</h3><p>Einzelsitzungen mit Sabine oder Selcan und gemeinsame Sitzungen mit uns beiden.</p><p className="bf-later">Jetzt buchen. Deinen Termin auch für später wählen.</p><Link to="/prices#black-friday" onClick={close} className="bf-button bf-teal">Sitzung & Gutschein wählen<ArrowUpRight size={20} aria-hidden="true"/></Link></article>
            </div>
            <p className="bf-fine">Aktionsende: 30.11.2026 um 23:59 Uhr deutscher Zeit. 30 % auf die ausgewiesenen Stripe-Einzelbuchungen. Gesprächs- und Verhaltenstherapie sowie Sitzungspakete sind ausgenommen.</p>
        </div>
    </Modal>;
};
