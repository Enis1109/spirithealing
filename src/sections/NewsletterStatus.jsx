import { CheckCircle2, CircleAlert, MailCheck, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const content = {
    de: {
        confirmed: { title: "Anmeldung bestätigt", text: "Du erhältst künftig Neuigkeiten zu Vorträgen, Seminaren und Terminen von Spirit Healing.", icon: CheckCircle2 },
        unsubscribed: { title: "Erfolgreich abgemeldet", text: "Deine E-Mail-Adresse wird nicht mehr für den Newsletter verwendet.", icon: MailCheck },
        invalid: { title: "Link nicht mehr gültig", text: "Der Link wurde bereits verwendet oder ist abgelaufen. Du kannst dich über unsere Formulare erneut anmelden.", icon: CircleAlert },
        error: { title: "Das hat nicht geklappt", text: "Bitte versuche es später noch einmal oder schreibe uns an info@spirit-healing.tr.", icon: XCircle },
        home: "Zur Startseite",
    },
    tr: {
        confirmed: { title: "Abonelik onaylandı", text: "Bundan sonra Spirit Healing seminerleri, eğitimleri ve yeni tarihleri hakkında bilgi alacaksın.", icon: CheckCircle2 },
        unsubscribed: { title: "Abonelik iptal edildi", text: "E-posta adresin artık bülten gönderimi için kullanılmayacak.", icon: MailCheck },
        invalid: { title: "Bağlantı artık geçerli değil", text: "Bağlantı daha önce kullanılmış veya süresi dolmuş olabilir. Formlarımız üzerinden yeniden abone olabilirsin.", icon: CircleAlert },
        error: { title: "Bir sorun oluştu", text: "Lütfen daha sonra tekrar dene veya info@spirit-healing.tr adresine yaz.", icon: XCircle },
        home: "Ana sayfaya dön",
    },
};

export const NewsletterStatus = () => {
    const { language } = useLanguage();
    const [searchParams] = useSearchParams();
    const copy = content[language];
    const state = searchParams.get("state");
    const status = copy[state] || copy.error;
    const StatusIcon = status.icon;

    return (
        <main className="flex min-h-screen items-center justify-center bg-card px-4 py-28 text-white">
            <section className="glass-strong w-full max-w-xl rounded-[2rem] p-7 text-center shadow-2xl sm:p-10">
                <img src="/Logo-tuerkis.jpeg?v=20260730" alt="Spirit Healing Logo" className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-primary" />
                <StatusIcon className="mx-auto mt-7 h-14 w-14 text-primary" aria-hidden="true" />
                <h1 className="mt-5 text-3xl font-bold text-muted-foreground sm:text-4xl">{status.title}</h1>
                <p className="mt-4 text-lg leading-8 text-muted-foreground/80">{status.text}</p>
                <Link to="/" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                    {copy.home}
                </Link>
            </section>
        </main>
    );
};
