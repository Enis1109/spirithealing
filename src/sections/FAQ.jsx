import { ArrowRight, ChevronDown, CircleHelp, MessageCircle, ShieldCheck, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const content = {
    de: {
        eyebrow: "Häufige Fragen",
        title: "Was du vor einer Begleitung wissen möchtest",
        intro: "Hier findest du klare Antworten zu Ablauf, Arbeitsweise und Rahmenbedingungen. Wenn deine Frage nicht dabei ist, schreib uns gern direkt.",
        facts: [
            { icon: Video, text: "Online über Zoom" },
            { icon: MessageCircle, text: "Deutsch und Türkisch" },
            { icon: ShieldCheck, text: "Vertraulicher Rahmen" },
        ],
        groups: [
            {
                label: "Einstieg & Ablauf",
                items: [
                    {
                        question: "Wie finde ich heraus, welche Begleitung zu mir passt?",
                        answer: [
                            "Du musst dich nicht vorab für eine Methode entscheiden. In einem kostenfreien 15-minütigen Kennenlerngespräch kannst du dein Anliegen kurz schildern und offene Fragen klären.",
                            "Danach empfehlen wir dir transparent, ob eine Einzelsitzung, eine gemeinsame Sitzung mit uns beiden oder ein längerer Intensivprozess sinnvoll sein könnte.",
                        ],
                    },
                    {
                        question: "Wie läuft eine Sitzung ab?",
                        answer: [
                            "Nach der Buchung erhältst du die Terminbestätigung und den Zoom-Link. Je nach Format bekommst du zusätzlich einen kurzen Fragebogen, damit wir dein Anliegen bereits einordnen können.",
                            "Zu Beginn klären wir, was dich aktuell beschäftigt und was du dir von der Sitzung wünschst. Der weitere Verlauf orientiert sich an deinem Prozess – ohne starres Programm und ohne Druck.",
                        ],
                    },
                    {
                        question: "Muss ich mein Thema schon genau benennen können?",
                        answer: [
                            "Nein. Oft ist zunächst nur spürbar, dass sich etwas wiederholt, dass du innerlich feststeckst oder dass eine Situation unverhältnismäßig viel Kraft kostet.",
                            "Wir beginnen mit dem, was im Moment wahrnehmbar ist. Im gemeinsamen Prozess kann sich Schritt für Schritt zeigen, welche Erfahrungen, Muster oder Schutzreaktionen damit verbunden sind.",
                        ],
                    },
                    {
                        question: "Wie kann ich mich auf den Termin vorbereiten?",
                        answer: [
                            "Plane möglichst etwas Ruhe vor und nach der Sitzung ein und sorge für einen ungestörten Ort mit stabiler Internetverbindung. Du brauchst nichts vorzubereiten oder besonders gut formulieren zu können.",
                            "Bitte nimm nicht unter dem Einfluss von Alkohol oder bewusstseinsverändernden Substanzen teil, damit du dich während der Sitzung klar wahrnehmen und im Kontakt mit dir bleiben kannst.",
                        ],
                    },
                ],
            },
            {
                label: "Arbeitsweise",
                items: [
                    {
                        question: "Was bedeutet „traumasensibel“ bei euch?",
                        answer: [
                            "Traumasensibel bedeutet für uns, Schutzreaktionen nicht als Fehler zu behandeln. Wir versuchen zuerst zu verstehen, welche Funktion ein Muster einmal hatte und was dein System heute braucht.",
                            "Wir arbeiten dosiert, transparent und in deinem Tempo. Du behältst jederzeit die Entscheidung darüber, worauf du eingehen möchtest und wo eine Grenze liegt.",
                        ],
                    },
                    {
                        question: "Welche Ebenen bezieht ihr in die Arbeit ein?",
                        answer: [
                            "Je nach Anliegen beziehen wir emotionales Erleben, Körperwahrnehmung, Nervensystem, Bindungs- und Beziehungsmuster, innere Anteile sowie systemische Zusammenhänge ein.",
                            "Intuitive, energetische oder schamanisch ausgerichtete Perspektiven nutzen wir nur dann, wenn sie für dich stimmig sind. Vorgehen und Ziel werden gemeinsam besprochen.",
                        ],
                    },
                    {
                        question: "Muss ich spirituell sein, um mit euch zu arbeiten?",
                        answer: [
                            "Nein. Du musst an kein bestimmtes Modell glauben. Viele Menschen kommen über psychologische, emotionale oder körperbezogene Themen zu uns.",
                            "Spirituelle oder intuitive Perspektiven sind ein mögliches Angebot, keine Voraussetzung. Entscheidend ist, dass die gewählte Arbeitsweise nachvollziehbar ist und zu dir passt.",
                        ],
                    },
                    {
                        question: "Arbeitet ihr einzeln oder gemeinsam?",
                        answer: [
                            "Beides ist möglich. In einer Einzelsitzung arbeitest du mit Sabine oder Selcan. In gemeinsamen Sitzungen verbinden wir systemische Anteilearbeit und Energiearbeit innerhalb desselben Prozesses.",
                            "Welche Form sinnvoll ist, hängt von deinem Anliegen, der gewünschten Arbeitstiefe und deinem persönlichen Gefühl ab.",
                        ],
                    },
                ],
            },
            {
                label: "Rahmen & Grenzen",
                items: [
                    {
                        question: "Finden die Sitzungen online oder vor Ort statt?",
                        answer: [
                            "Der Schwerpunkt liegt auf Online-Sitzungen über Zoom. Dadurch kannst du unabhängig von deinem Wohnort teilnehmen und anschließend in deiner vertrauten Umgebung bleiben.",
                            "Ausgewählte Intensiv- oder Aufstellungsformate können nach persönlicher Absprache auch vor Ort in Berlin oder Antalya stattfinden.",
                        ],
                    },
                    {
                        question: "Was ist der Unterschied zwischen einer Sitzung und einem Intensivprozess?",
                        answer: [
                            "Eine reguläre Sitzung dauert 60 Minuten und eignet sich für einen klar umrissenen Einstieg oder die kontinuierliche Begleitung eines Prozesses.",
                            "Die Intensivsitzung dauert 150 Minuten. Sie gibt komplexeren systemischen oder schamanisch ausgerichteten Prozessen mehr Zeit, ohne sie in ein zu enges Zeitfenster zu drängen.",
                        ],
                    },
                    {
                        question: "Kann ich mit körperlichen Beschwerden zu euch kommen?",
                        answer: [
                            "Ja. Körperliche Beschwerden dürfen ausdrücklich Teil unserer Arbeit sein. Aus unserer Sicht können sich darin auch innere Anteile, gebundene Gefühle und energetische Blockaden zeigen.",
                            "Wir schauen gemeinsam, welche Schutzbewegung, innere Geschichte oder energetische Dynamik mit deinem körperlichen Erleben verbunden sein kann. Wir legen dabei keine fertige Ursache fest; entscheidend ist, was sich in deinem eigenen Prozess nachvollziehbar zeigt.",
                        ],
                    },
                    {
                        question: "Wann ist eure Begleitung nicht der passende Rahmen?",
                        answer: [
                            "Bei akuten Krisen oder einer unmittelbaren Gefahr für dich oder andere ist dieses Angebot nicht der passende Rahmen. Wende dich dann bitte an den örtlichen Notruf – in Deutschland und der Türkei 112 – oder an eine geeignete Krisen- beziehungsweise Notfallstelle.",
                        ],
                    },
                ],
            },
        ],
        stillEyebrow: "Noch etwas unklar?",
        stillQuestion: "Deine Frage ist noch offen?",
        stillText: "Schreib uns kurz, worum es geht. Wir antworten dir persönlich und sagen dir ehrlich, ob und wie wir dich begleiten können.",
        contact: "Kontakt aufnehmen",
        prices: "Preise & Termine ansehen",
        legal: { imprint: "Impressum", privacy: "Datenschutz" },
    },
    tr: {
        eyebrow: "Sık sorulan sorular",
        title: "Çalışmaya başlamadan önce bilmek isteyebileceklerin",
        intro: "Süreç, çalışma biçimi ve çerçeveyle ilgili açık yanıtları burada bulabilirsin. Sorun listede yoksa bize doğrudan yazabilirsin.",
        facts: [
            { icon: Video, text: "Zoom üzerinden çevrim içi" },
            { icon: MessageCircle, text: "Türkçe ve Almanca" },
            { icon: ShieldCheck, text: "Gizli ve güvenli çerçeve" },
        ],
        groups: [
            {
                label: "Başlangıç & süreç",
                items: [
                    {
                        question: "Hangi çalışma biçiminin bana uygun olduğunu nasıl anlarım?",
                        answer: [
                            "Önceden bir yönteme karar vermen gerekmez. Ücretsiz 15 dakikalık tanışma görüşmesinde konunu kısaca anlatabilir ve sorularını sorabilirsin.",
                            "Ardından bireysel seansın, ikimizin birlikte katıldığı bir seansın ya da daha uzun bir yoğun çalışmanın uygun olup olmadığını açıkça paylaşırız.",
                        ],
                    },
                    {
                        question: "Bir seans nasıl ilerler?",
                        answer: [
                            "Randevudan sonra tarih-saat onayını ve Zoom bağlantısını alırsın. Çalışmanın türüne göre, konunu önceden anlayabilmemiz için kısa bir form da gönderebiliriz.",
                            "Başlangıçta şu anda seni neyin etkilediğini ve seanstan ne beklediğini netleştiririz. Devamı katı bir programa göre değil, senin sürecine göre şekillenir.",
                        ],
                    },
                    {
                        question: "Konumu önceden tam olarak tanımlamam gerekir mi?",
                        answer: [
                            "Hayır. Bazen yalnızca bir şeylerin tekrar ettiğini, sıkışmış hissettiğini veya belirli bir durumun çok fazla enerji aldığını fark edersin.",
                            "O anda hissedilebilen yerden başlarız. İlgili deneyimler, örüntüler veya korunma tepkileri süreç içinde adım adım görünür hâle gelebilir.",
                        ],
                    },
                    {
                        question: "Randevuya nasıl hazırlanabilirim?",
                        answer: [
                            "Mümkünse seanstan önce ve sonra kendine biraz zaman ayır; rahatsız edilmeyeceğin ve internet bağlantısının iyi olduğu bir ortam hazırla. Özel bir hazırlık yapman gerekmez.",
                            "Seans sırasında kendini açık biçimde algılayabilmen ve kendinle temasta kalabilmen için alkol ya da bilinci etkileyen maddelerin etkisi altında katılmamanı rica ediyoruz.",
                        ],
                    },
                ],
            },
            {
                label: "Çalışma biçimimiz",
                items: [
                    {
                        question: "Travma bilgili çalışmak sizin için ne anlama geliyor?",
                        answer: [
                            "Korunma tepkilerini bir kusur gibi ele almıyoruz. Önce bir örüntünün geçmişte hangi işlevi üstlendiğini ve sisteminin bugün neye ihtiyaç duyduğunu anlamaya çalışıyoruz.",
                            "Çalışma ölçülü, açık ve senin hızında ilerler. Hangi konuya girmek istediğine ve sınırının nerede olduğuna her zaman sen karar verirsin.",
                        ],
                    },
                    {
                        question: "Çalışmada hangi düzeyleri dikkate alıyorsunuz?",
                        answer: [
                            "Konuya göre duygusal deneyimi, beden farkındalığını, sinir sistemini, bağlanma ve ilişki örüntülerini, içsel parçaları ve sistemik bağlantıları birlikte ele alıyoruz.",
                            "Sezgisel, enerjetik veya şamanik perspektifleri yalnızca sana uygun olduğunda kullanıyoruz. Yöntem ve amaç önceden birlikte konuşulur.",
                        ],
                    },
                    {
                        question: "Sizinle çalışmak için spiritüel olmam gerekir mi?",
                        answer: [
                            "Hayır. Belirli bir modele inanman gerekmez. Birçok kişi bize psikolojik, duygusal veya bedensel konularla geliyor.",
                            "Spiritüel ya da sezgisel bakış açıları bir seçenek olabilir, fakat bir ön koşul değildir. Önemli olan yaklaşımın anlaşılır ve sana uygun olmasıdır.",
                        ],
                    },
                    {
                        question: "Seanslara tek kişi mi, ikiniz birlikte mi katılıyorsunuz?",
                        answer: [
                            "İkisi de mümkün. Bireysel seansta Sabine veya Selcan ile çalışırsın. Ortak seanslarda sistemik içsel parçalar çalışması ile enerji çalışmasını aynı süreç içinde birleştiririz.",
                            "Hangi çalışma biçiminin uygun olduğu konuna, istediğin çalışma derinliğine ve kişisel tercihine bağlıdır.",
                        ],
                    },
                ],
            },
            {
                label: "Çerçeve & sınırlar",
                items: [
                    {
                        question: "Seanslar çevrim içi mi, yüz yüze mi?",
                        answer: [
                            "Çalışmalarımızın büyük bölümü Zoom üzerinden çevrim içi gerçekleşir. Böylece bulunduğun yerden katılabilir ve seans sonrasında kendi alışık olduğun ortamda kalabilirsin.",
                            "Bazı yoğun süreçler veya sistemik dizim çalışmaları kişisel görüşmeyle Berlin veya Antalya'da yüz yüze de planlanabilir.",
                        ],
                    },
                    {
                        question: "Normal seans ile yoğun çalışma arasındaki fark nedir?",
                        answer: [
                            "Normal seans 60 dakika sürer; belirli bir konuya başlamak veya devam eden süreci düzenli şekilde yürütmek için uygundur.",
                            "Yoğun seans 150 dakikadır. Karmaşık sistemik veya şamanik yaklaşımlı süreçlerin dar bir zaman aralığına sıkışmadan ele alınmasına alan açar.",
                        ],
                    },
                    {
                        question: "Bedensel şikâyetlerle gelebilir miyim?",
                        answer: [
                            "Evet. Bedensel şikâyetler çalışmamızda açıkça yer alabilir. Bizim yaklaşımımıza göre bunlarda içsel parçalar, tutulmuş duygular ve enerjetik blokajlar da kendini gösterebilir.",
                            "Bedensel deneyiminle hangi korunma hareketinin, içsel hikâyenin veya enerjetik dinamiğin bağlantılı olabileceğine birlikte bakarız. Hazır bir neden dayatmayız; belirleyici olan, kendi sürecinde anlaşılır ve hissedilir biçimde ortaya çıkandır.",
                        ],
                    },
                    {
                        question: "Bu çalışma hangi durumlarda uygun değildir?",
                        answer: [
                            "Akut bir kriz yaşıyorsan veya kendin ya da başkaları için yakın bir tehlike varsa bu çalışma uygun değildir. Böyle bir durumda bulunduğun yerdeki acil yardım hattına – Almanya ve Türkiye'de 112 – ya da uygun bir kriz ve acil yardım birimine başvur.",
                        ],
                    },
                ],
            },
        ],
        stillEyebrow: "Hâlâ merak ettiğin bir şey mi var?",
        stillQuestion: "Sorun hâlâ yanıtlanmadı mı?",
        stillText: "Bize konunu kısaca yazabilirsin. Sana kişisel olarak geri döner, nasıl destek olabileceğimizi açıkça paylaşırız.",
        contact: "İletişime geç",
        prices: "Ücretler ve randevular",
        legal: { imprint: "Künye", privacy: "Gizlilik" },
    },
};

const FaqItem = ({ item }) => (
    <details className="group rounded-2xl border border-white/15 bg-white/[0.07] px-5 py-1 transition open:bg-white/[0.1] sm:px-6">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-left text-lg font-bold text-white marker:content-none">
            <span>{item.question}</span>
            <ChevronDown className="h-5 w-5 shrink-0 text-primary transition duration-300 group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="max-w-3xl space-y-3 border-t border-white/10 pb-6 pt-5 text-base leading-7 text-white/80">
            {item.answer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
    </details>
);

export const FAQ = () => {
    const { language } = useLanguage();
    const copy = content[language];

    return (
        <main data-no-translate className="min-h-screen overflow-hidden bg-card pb-8 pt-24 text-white sm:pt-28">
            <section className="relative border-b border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_38%)]" aria-hidden="true" />
                <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.72fr] lg:items-end lg:px-8">
                    <div className="max-w-3xl">
                        <p className="font-semibold uppercase tracking-[0.2em] text-primary">{copy.eyebrow}</p>
                        <h1 className="mt-4 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">{copy.title}</h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">{copy.intro}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                        {copy.facts.map(({ icon, text }) => {
                            const FactIcon = icon;
                            return <div key={text} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3.5 backdrop-blur-sm">
                                <FactIcon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                <span className="text-sm font-medium text-white/90">{text}</span>
                            </div>;
                        })}
                    </div>
                </div>
            </section>

            <div className="mx-auto w-full max-w-5xl space-y-16 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                {copy.groups.map((group) => (
                    <section key={group.label} aria-labelledby={`faq-${group.label}`}>
                        <div className="mb-6 flex items-center gap-3">
                            <CircleHelp className="h-6 w-6 text-primary" aria-hidden="true" />
                            <h2 id={`faq-${group.label}`} className="text-2xl font-bold sm:text-3xl">{group.label}</h2>
                        </div>
                        <div className="space-y-3">
                            {group.items.map((item) => <FaqItem key={item.question} item={item} />)}
                        </div>
                    </section>
                ))}

                <section className="rounded-[2rem] border border-primary/30 bg-[#0B777A] p-6 shadow-2xl shadow-black/15 sm:p-10">
                    <div className="max-w-3xl">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.stillEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{copy.stillQuestion}</h2>
                        <p className="mt-5 text-lg leading-8 text-white/80">{copy.stillText}</p>
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <Link to="/kontakt" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                                {copy.contact}
                                <ArrowRight className="h-5 w-5" aria-hidden="true" />
                            </Link>
                            <Link to="/prices" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 font-bold text-white transition hover:border-primary hover:text-primary">
                                {copy.prices}
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="flex items-center justify-center gap-2 px-4 pt-2 text-sm text-white/75">
                <Link to="/impressum" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">{copy.legal.imprint}</Link>
                <Link to="/datenschutz" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">{copy.legal.privacy}</Link>
            </footer>
        </main>
    );
};
