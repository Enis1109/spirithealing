import {
    ArrowRight,
    Brain,
    CircleCheck,
    HeartHandshake,
    Layers3,
    ShieldCheck,
    UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { useLanguage } from "@/i18n/LanguageContext";

const content = {
    de: {
        eyebrow: "Über uns",
        titleStart: "Anteilearbeit und Energiearbeit.",
        titleAccent: "In einer Sitzung verbunden.",
        intro: "Wir sind Sabine Schmidt und Selcan Yilmaz. Bei Spirit Healing begleiten wir Menschen, die sich selbst gut reflektieren können und trotzdem immer wieder in denselben Reaktionen, Beziehungen oder Entscheidungen feststecken.",
        introStrong: "Wir arbeiten gleichzeitig mit der inneren Schutzorganisation und mit den energetischen Dynamiken, die ein Muster aufrechterhalten.",
        imageAlt: "Sabine Schmidt und Selcan Yilmaz von Spirit Healing",
        imageCaption: "Sabine Schmidt & Selcan Yilmaz",
        focusEyebrow: "Unsere Expertise",
        focusTitle: "Wir schauen dorthin, wo ein Muster entsteht",
        focusIntro: "Viele belastende Reaktionen sind nicht unvernünftig. Sie waren einmal ein Versuch, mit Angst, Bindungsunsicherheit, Scham oder Überforderung umzugehen. Genau dort setzt unsere Arbeit an.",
        focuses: [
            {
                icon: Layers3,
                title: "Innere Anteile und Schutzmuster",
                text: "Wir machen sichtbar, welche inneren Stimmen, alten Erfahrungen und Schutzstrategien eine aktuelle Reaktion beeinflussen.",
            },
            {
                icon: Brain,
                title: "Traumasensible Prozessarbeit",
                text: "Wir arbeiten nicht gegen dein System. Tempo, Stabilität und die Fähigkeit, im Kontakt mit dir zu bleiben, bestimmen den Prozess.",
            },
            {
                icon: HeartHandshake,
                title: "Bindung, Scham und Selbstwert",
                text: "Wir begleiten Themen, die sich in Beziehungen, beim Grenzen setzen, in Selbstzweifeln oder in starker innerer Anpassung zeigen.",
            },
            {
                icon: UsersRound,
                title: "Systemische Anteilearbeit & Energiearbeit",
                text: "In gemeinsamen Sitzungen verbinden wir beide Ebenen unmittelbar. So wird ein Muster nicht nur verstanden, sondern auch dort bearbeitet, wo Spannung, Bindung oder energetische Dynamik es aufrechterhalten.",
            },
        ],
        peopleEyebrow: "Wer wir sind",
        peopleTitle: "Unterschiedliche Expertise, bewusst verbunden",
        sabine: {
            name: "Sabine Schmidt",
            role: "Coaching, Hypnose und innere Musterarbeit",
            text: "Sabine erkennt schnell, wo sich ein innerer Konflikt festgefahren hat. Sie arbeitet klar und direkt, ohne Menschen zu überfordern. Ihre Stärke liegt darin, wiederkehrende Muster präzise zu erfassen und gemeinsam einen Zugang zu den Anteilen zu finden, die Veränderung bislang verhindern oder absichern wollen.",
            facts: [
                "NLP Practitioner und NLP Master",
                "Ausbildung zum Hypnosecoach",
                "Ausbildung zur psychologischen Beraterin",
                "Erfahrung mit Meditation, Anteile- und Musterarbeit",
            ],
        },
        selcan: {
            name: "Selcan Yilmaz",
            role: "Heilpraktikerin für Psychotherapie · Stabilisierung · Prozessbegleitung",
            text: "Selcan behält auch in emotional stark belastenden Situationen den Überblick. Ihre ruhige, klare Präsenz gibt Orientierung, ohne zu bewerten oder vorschnell eine Lösung vorzugeben. Die langjährige Arbeit mit Menschen, deren Alltag durch psychische Belastungen erheblich eingeschränkt war, prägt ihre Begleitung bis heute.",
            facts: [
                "Heilpraktikerin für Psychotherapie",
                "Langjährige Erfahrung in der Einzelfallhilfe",
                "Praxis mit Menschen in psychischen Krisen und Extremsituationen",
                "Dozenten-, Gruppen- und Ausbildungserfahrung",
            ],
        },
        togetherEyebrow: "Unsere gemeinsame Arbeit",
        togetherTitle: "Zwei Arbeitsweisen greifen in einem Prozess ineinander",
        togetherText: "In einer gemeinsamen Sitzung laufen systemische Anteilearbeit und Energiearbeit nicht nacheinander und nicht getrennt. Die Anteilearbeit macht sichtbar, welcher innere Anteil führt, schützt oder blockiert. Die Energiearbeit bezieht die gebundene Spannung und jene tieferen Dynamiken ein, die sich nicht allein über Sprache erreichen lassen. So kommen Verstehen und unmittelbares Erleben in einem konzentrierten Prozess zusammen.",
        togetherNote: "Die Tiefe entsteht dadurch, dass beide Ebenen präzise aufeinander bezogen werden – immer in deinem Tempo und mit deinem Einverständnis.",
        methodEyebrow: "Wie wir arbeiten",
        methodTitle: "Verstehen, entlasten, neu handeln",
        steps: [
            { number: "01", title: "Wahrnehmen", text: "Was geschieht gerade – in Gedanken, Gefühlen und im Körper?" },
            { number: "02", title: "Einordnen", text: "Was gehört zur Gegenwart, was ist eine alte Erfahrung oder Schutzreaktion?" },
            { number: "03", title: "Verstehen", text: "Wovor will dieser Anteil schützen und was braucht er heute?" },
            { number: "04", title: "Neu entscheiden", text: "Welcher nächste Schritt ist stimmig, realistisch und im Alltag tragfähig?" },
        ],
        standards: [
            "Klare Sprache statt spiritueller Floskeln",
            "Kein Druck, etwas fühlen oder leisten zu müssen",
            "Ehrliche Rückmeldung ohne Beschämung",
            "Ein Tempo, das zu deiner aktuellen Stabilität passt",
        ],
        ctaEyebrow: "Erster Schritt",
        ctaTitle: "Lerne uns in Ruhe kennen",
        ctaText: "In einem kostenfreien Gespräch klären wir, worum es dir geht und welche Form der Begleitung sinnvoll sein könnte. Du musst dich dabei zu nichts entscheiden.",
        ctaButton: "Kontakt aufnehmen",
        legal: { imprint: "Impressum", privacy: "Datenschutz" },
    },
    tr: {
        eyebrow: "Hakkımızda",
        titleStart: "İçsel parçalar ve enerji çalışması.",
        titleAccent: "Tek bir seansta birlikte.",
        intro: "Biz Sabine Schmidt ve Selcan Yilmaz. Spirit Healing'de, kendini iyi gözlemlediği hâlde aynı tepkilerin, ilişki döngülerinin ya da kararların içinde tekrar tekrar sıkışan insanlarla çalışıyoruz.",
        introStrong: "İçsel korunma sistemini ve bir örüntüyü sürdüren enerjetik dinamikleri aynı süreç içinde ele alıyoruz.",
        imageAlt: "Spirit Healing'den Sabine Schmidt ve Selcan Yilmaz",
        imageCaption: "Sabine Schmidt & Selcan Yilmaz",
        focusEyebrow: "Uzmanlık alanlarımız",
        focusTitle: "Bir örüntünün oluştuğu yere bakıyoruz",
        focusIntro: "Zorlayıcı tepkilerin çoğu anlamsız değildir. Bir zamanlar korku, bağlanma güvensizliği, utanç ya da aşırı yükle başa çıkabilmek için gelişmiş olabilirler. Çalışmamız tam da bu noktadan başlar.",
        focuses: [
            {
                icon: Layers3,
                title: "İçsel parçalar ve korunma örüntüleri",
                text: "Bugünkü tepkilerini etkileyen iç sesleri, eski deneyimleri ve korunma yollarını birlikte görünür hâle getiriyoruz.",
            },
            {
                icon: Brain,
                title: "Travmaya duyarlı süreç çalışması",
                text: "İç sistemine karşı çalışmıyoruz. Sürecin hızını; güven, dengede kalma ve kendinle teması sürdürebilme kapasiten belirler.",
            },
            {
                icon: HeartHandshake,
                title: "Bağlanma, utanç ve özdeğer",
                text: "İlişkilerde, sınır koyarken, kendinden şüphe duyduğunda ya da sürekli uyum sağlamak zorunda hissettiğinde ortaya çıkan konularla çalışıyoruz.",
            },
            {
                icon: UsersRound,
                title: "Sistemik içsel parçalar çalışması & enerji çalışması",
                text: "Ortak seanslarda iki düzeyi doğrudan birbirine bağlıyoruz. Böylece bir örüntü yalnızca anlaşılmakla kalmıyor; onu sürdüren gerilim, bağ ya da enerjetik dinamik de sürece dahil ediliyor.",
            },
        ],
        peopleEyebrow: "Biz kimiz",
        peopleTitle: "Farklı uzmanlıkların bilinçli birleşimi",
        sabine: {
            name: "Sabine Schmidt",
            role: "Koçluk, hipnoz ve içsel örüntülerle çalışma",
            text: "Sabine, içsel bir çatışmanın nerede düğümlendiğini hızlı ve net biçimde fark eder. Açık ve doğrudan çalışırken kişiyi zorlamamaya özen gösterir. Tekrarlayan örüntüleri ayırt etmek ve değişimi bugüne kadar engelleyen ya da güvence altına almaya çalışan parçalarla temas kurmak onun güçlü yanıdır.",
            facts: [
                "NLP Practitioner ve NLP Master",
                "Hipnoz koçluğu eğitimi",
                "Psikolojik danışmanlık eğitimi",
                "Meditasyon, içsel parçalar ve örüntü çalışması deneyimi",
            ],
        },
        selcan: {
            name: "Selcan Yilmaz",
            role: "Heilpraktikerin für Psychotherapie (Almanya) · Stabilizasyon · Süreç danışmanlığı",
            text: "Selcan, duygusal yükün çok yoğun olduğu anlarda da sakinliğini ve genel bakışını korur. Yargılamadan ve acele bir çözüm dayatmadan yön bulmaya yardımcı olan net bir çalışma tarzı vardır. Psikolojik zorluklar nedeniyle günlük yaşamı ciddi biçimde etkilenmiş insanlarla yıllar boyunca çalışmış olması, bugünkü yaklaşımının önemli bir temelidir.",
            facts: [
                "Heilpraktikerin für Psychotherapie (Almanya)",
                "Bireysel psikososyal destek alanında uzun yıllara dayanan deneyim",
                "Psikolojik kriz ve ağır yüklenme yaşayan insanlarla çalışma deneyimi",
                "Eğitmenlik, grup çalışmaları ve eğitim süreçleri deneyimi",
            ],
        },
        togetherEyebrow: "Ortak çalışma biçimimiz",
        togetherTitle: "İki çalışma biçimi tek bir süreçte birleşiyor",
        togetherText: "Ortak bir seansta sistemik içsel parçalar çalışması ile enerji çalışması birbirinden ayrı ya da art arda ilerlemez. Parçalar çalışması; hangi içsel parçanın yönettiğini, koruduğunu ya da engellediğini görünür kılar. Enerji çalışması ise yalnızca konuşmayla ulaşılamayan, bedende ve ilişkilerde bağlı kalan gerilimleri ve daha derindeki dinamikleri sürece dahil eder. Böylece anlamak ve doğrudan deneyimlemek aynı odakta buluşur.",
        togetherNote: "Derinlik, iki düzeyin özenle birbiriyle ilişkilendirilmesinden doğar; her zaman senin hızında ve onayınla.",
        methodEyebrow: "Nasıl çalışıyoruz",
        methodTitle: "Fark etmek, anlamak, yükü hafifletmek ve yeni bir adım atmak",
        steps: [
            { number: "01", title: "Fark etmek", text: "Şu anda düşüncelerinde, duygularında ve bedeninde neler oluyor?" },
            { number: "02", title: "Ayırt etmek", text: "Bugüne ait olan ne, eski bir deneyim ya da korunma tepkisi olan ne?" },
            { number: "03", title: "Anlamak", text: "Bu parça seni neden koruyor ve bugün neye ihtiyaç duyuyor?" },
            { number: "04", title: "Yeni bir seçim yapmak", text: "Şu anda gerçekçi, sana uygun ve günlük hayatta sürdürülebilir olan adım ne?" },
        ],
        standards: [
            "Manevi klişeler yerine açık ve anlaşılır bir dil",
            "Bir şey hissetmek ya da başarmak zorunda olmadığın bir alan",
            "Utandırmadan, dürüst ve net geri bildirim",
            "O anki dayanıklılığına uygun bir çalışma temposu",
        ],
        ctaEyebrow: "İlk adım",
        ctaTitle: "Önce sakin bir şekilde tanışalım",
        ctaText: "Ücretsiz ön görüşmede seni neyin getirdiğini ve hangi çalışma biçiminin uygun olabileceğini birlikte değerlendiririz. Görüşmenin sonunda karar vermek zorunda değilsin.",
        ctaButton: "İletişime geç",
        legal: { imprint: "Künye", privacy: "Gizlilik" },
    },
};

const FactList = ({ facts }) => (
    <ul className="mt-6 space-y-3">
        {facts.map((fact) => (
            <li key={fact} className="flex items-start gap-3 text-base leading-7 text-white/85">
                <CircleCheck className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span>{fact}</span>
            </li>
        ))}
    </ul>
);

export const About = () => {
    const { language } = useLanguage();
    const copy = content[language];

    return (
        <main data-no-translate className="min-h-screen overflow-hidden bg-card pt-24 text-white sm:pt-28">
            <section className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
                <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
                <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                    <div className="relative z-10">
                        <p className="font-semibold uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
                        <h1 className="mt-3 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
                            {copy.titleStart}{" "}
                            <span className="font-serif font-normal italic text-primary">{copy.titleAccent}</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-white/85 sm:text-xl">{copy.intro}</p>
                        <p className="mt-5 border-l-2 border-primary pl-5 text-lg font-semibold leading-8 text-white">
                            {copy.introStrong}
                        </p>
                    </div>

                    <figure className="relative z-10 overflow-hidden rounded-3xl border border-primary/30 bg-white/5 p-2 shadow-2xl shadow-black/30">
                        <img
                            src="/ueberuns.jpeg"
                            alt={copy.imageAlt}
                            className="aspect-[3/2] h-auto w-full rounded-[1.15rem] object-cover object-center"
                        />
                        <figcaption className="px-3 pb-1 pt-3 text-center text-sm font-medium tracking-wide text-white/70">
                            {copy.imageCaption}
                        </figcaption>
                    </figure>
                </div>
            </section>

            <section className="border-y border-white/10 bg-white/[0.035] py-16 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="font-semibold uppercase tracking-[0.18em] text-primary">{copy.focusEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{copy.focusTitle}</h2>
                        <p className="mt-5 text-lg leading-8 text-white/80">{copy.focusIntro}</p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-2">
                        {copy.focuses.map((item) => (
                            <article key={item.title} className="glass rounded-3xl p-6 sm:p-7">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                </div>
                                <h3 className="mt-5 text-xl font-bold text-muted-foreground sm:text-2xl">{item.title}</h3>
                                <p className="mt-3 text-base leading-7 text-muted-foreground/80 sm:text-lg">{item.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="font-semibold uppercase tracking-[0.18em] text-primary">{copy.peopleEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{copy.peopleTitle}</h2>
                    </div>

                    <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
                        {[copy.sabine, copy.selcan].map((person) => (
                            <article key={person.name} className="relative overflow-hidden rounded-3xl border border-primary/25 bg-white/[0.045] p-6 sm:p-8">
                                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
                                <h3 className="relative text-3xl font-bold text-primary">{person.name}</h3>
                                <p className="relative mt-2 font-semibold text-white/70">{person.role}</p>
                                <p className="relative mt-5 text-lg leading-8 text-white/85">{person.text}</p>
                                <FactList facts={person.facts} />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-primary/[0.08] py-16 sm:py-20">
                <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14 lg:px-8">
                    <div>
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-muted-foreground">
                            <UsersRound className="h-8 w-8" aria-hidden="true" />
                        </div>
                        <p className="mt-6 font-semibold uppercase tracking-[0.18em] text-primary">{copy.togetherEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{copy.togetherTitle}</h2>
                    </div>
                    <div className="rounded-3xl border border-primary/25 bg-card/80 p-6 sm:p-8">
                        <p className="text-lg leading-8 text-white/85">{copy.togetherText}</p>
                        <p className="mt-6 flex items-start gap-3 border-t border-white/10 pt-6 text-lg font-semibold leading-8 text-white">
                            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                            <span>{copy.togetherNote}</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="font-semibold uppercase tracking-[0.18em] text-primary">{copy.methodEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{copy.methodTitle}</h2>
                    </div>

                    <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {copy.steps.map((step) => (
                            <li key={step.number} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                                <span className="text-sm font-bold tracking-[0.2em] text-primary">{step.number}</span>
                                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                                <p className="mt-3 leading-7 text-white/75">{step.text}</p>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-10 grid gap-3 rounded-3xl border border-primary/20 bg-primary/[0.06] p-6 sm:grid-cols-2 sm:p-8">
                        {copy.standards.map((standard) => (
                            <p key={standard} className="flex items-start gap-3 leading-7 text-white/85">
                                <CircleCheck className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                <span>{standard}</span>
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
                <div className="mx-auto max-w-5xl rounded-[2rem] border border-primary/30 bg-white/[0.06] px-6 py-10 text-center sm:px-10 sm:py-14">
                    <p className="font-semibold uppercase tracking-[0.18em] text-primary">{copy.ctaEyebrow}</p>
                    <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{copy.ctaTitle}</h2>
                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">{copy.ctaText}</p>
                    <div className="mt-8 flex justify-center">
                        <Button size="lg" to="/kontakt">
                            {copy.ctaButton}
                            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/10 py-6">
                <div className="mx-auto flex max-w-7xl justify-center gap-6 px-4 text-sm text-white/65 sm:px-6 lg:px-8">
                    <Link to="/impressum" className="transition hover:text-primary">{copy.legal.imprint}</Link>
                    <Link to="/datenschutz" className="transition hover:text-primary">{copy.legal.privacy}</Link>
                </div>
            </footer>
        </main>
    );
};
