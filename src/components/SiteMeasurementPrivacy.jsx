import { useLanguage } from '../i18n/LanguageContext';
import { siteMeasurementCopy } from '../../shared/siteMeasurementCopy';
export function SiteMeasurementPrivacy(){
    const {language}=useLanguage();const c=siteMeasurementCopy[language==='tr'?'tr':'de'];
    return <section id="website-auswertung" data-no-translate="true" className="scroll-mt-24 space-y-3">
        <h3 className="text-lg font-bold text-primary">{c.title}</h3>
        <p>{c.purpose}</p><p>{c.retention}</p><p>{c.withdrawal}</p>
    </section>;
}
