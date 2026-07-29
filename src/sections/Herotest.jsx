import { ArrowRight, BookOpen, Calendar1, Headphones, Instagram, LockKeyhole, PlayCircle, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { MemberWelcomeModal } from "@/components/MemberWelcomeModal";

const memberCallout = {
    de: {
        eyebrow: "Neu: deine kostenlose Spirit-Healing-Mediathek",
        title: "2 Meditationen, Vortrag und Workbook – kostenlos für dich.",
        text: "Melde dich einmalig kostenlos an. Im geschützten Mitgliederbereich kannst du die Meditationen „Loslassen & Reinigen“ und „Wiedergeburt“ anhören, den vollständigen Vortrag ansehen und mit dem Workbook weiterarbeiten.",
        recording: "Vollständiger Vortrag",
        workbook: "Workbook zum Download",
        meditations: "2 geführte Meditationen",
        button: "Kostenlose Inhalte öffnen",
    },
    tr: {
        eyebrow: "Yeni: ücretsiz Spirit Healing içerik alanı",
        title: "2 meditasyon, seminer ve çalışma kitabı – senin için ücretsiz.",
        text: "Bir kez ücretsiz kaydol. Korumalı üye alanında “Bırakmak ve Arınmak” ile “Yeniden Doğuş” meditasyonlarını dinleyebilir, seminerin tamamını izleyebilir ve çalışma kitabıyla devam edebilirsin.",
        recording: "Seminerin tamamı",
        workbook: "İndirilebilir çalışma kitabı",
        meditations: "2 rehberli meditasyon",
        button: "Ücretsiz içerikleri aç",
    },
};

const testimonialCopy = {
    de: {
        eyebrow: "Persönliche Erfahrung",
        title: "Was Menschen über unsere Begleitung sagen",
        session: "Rückmeldung nach einer Intensivsitzung",
        paragraphs: [
            "Liebe Selcan, liebe Sabine, ich möchte euch einfach von Herzen Danke sagen.",
            "Als ich zu euch in die Intensivsitzung gekommen bin, wusste ich nicht, was mich erwartet. Umso überraschter war ich, was sich seitdem bei mir verändert hat.",
            "Das Erste, was ich direkt nach der Sitzung bemerkt habe, war, dass ich plötzlich viel tiefer einatmen konnte. Es fühlte sich an, als würde endlich wieder mehr Sauerstoff in meinen Lungen ankommen. Dieses Gefühl ist bis heute geblieben und begleitet mich jeden Tag.",
            "Zunächst dachte ich, das wäre die einzige Veränderung. Doch in den letzten Tagen habe ich gemerkt, dass sich noch viel mehr getan hat.",
            "Mein Essverhalten hat sich komplett verändert. Ich hatte über lange Zeit große Probleme damit. Jetzt habe ich kaum noch Hunger, kleine Portionen reichen mir völlig aus und ich bin schnell satt. Das fühlt sich für mich unglaublich befreiend an.",
            "Außerdem spüre ich eine Energie, die ich so lange nicht mehr hatte. Ich habe angefangen, meine Wohnung auszumisten, kann mich ohne Schwierigkeiten von Dingen trennen und habe richtig Tatendrang. Es fühlt sich an, als würde ich nicht nur äußerlich aufräumen, sondern auch innerlich.",
            "Am tiefsten berührt hat mich jedoch ein Moment während der Anteilarbeit mit dir, Sabine. Als du mein inneres Baby liebevoll gehalten hast, durfte ich etwas fühlen, das ich kaum in Worte fassen kann. Dieses Gefühl von Geborgenheit, Gehaltensein und bedingungsloser Liebe trage ich bis heute in meinem Herzen. Allein dieser Moment war für mich unbeschreiblich wertvoll.",
            "Ich weiß nicht, was sich in den nächsten Wochen noch alles zeigen wird. Aber schon jetzt bin ich unendlich dankbar für diese Erfahrung und dafür, dass ihr mich so achtsam, liebevoll und wertschätzend begleitet habt.",
            "Von Herzen: Danke euch beiden. ❤️",
        ],
        author: "D. C.",
    },
    tr: {
        eyebrow: "Kişisel deneyim",
        title: "Danışanlarımız eşliğimiz hakkında ne söylüyor?",
        session: "Yoğun bir seans sonrası geri bildirim",
        paragraphs: [
            "Sevgili Selcan, sevgili Sabine, size tüm kalbimle teşekkür etmek istiyorum.",
            "Yoğun seansa geldiğimde beni neyin beklediğini bilmiyordum. O zamandan beri bende değişenleri fark etmek beni daha da şaşırttı.",
            "Seanstan hemen sonra ilk fark ettiğim şey, birden çok daha derin nefes alabilmemdi. Sanki ciğerlerime sonunda yeniden daha fazla oksijen ulaşıyordu. Bu his bugüne kadar devam etti ve bana her gün eşlik ediyor.",
            "Önce bunun tek değişiklik olduğunu düşündüm. Fakat son günlerde çok daha fazlasının değiştiğini fark ettim.",
            "Yeme alışkanlıklarım tamamen değişti. Uzun zamandır bu konuda büyük zorluklar yaşıyordum. Şimdi neredeyse hiç açlık hissetmiyorum, küçük porsiyonlar bana yetiyor ve çabuk doyuyorum. Bu bana inanılmaz derecede özgürleştirici geliyor.",
            "Ayrıca uzun zamandır hissetmediğim bir enerji hissediyorum. Evimi ayıklamaya başladım, eşyalardan zorlanmadan ayrılabiliyorum ve gerçekten harekete geçme isteğim var. Sanki yalnızca dışarıyı değil, içimi de düzenliyormuşum gibi geliyor.",
            "Beni en derinden etkileyen ise seninle yaptığımız parça çalışması sırasında yaşadığım bir andı, Sabine. İçimdeki bebeği sevgiyle tuttuğunda kelimelere dökmekte zorlandığım bir şeyi hissetmeme izin verildi. O güven, tutulma ve koşulsuz sevgi hissini hâlâ kalbimde taşıyorum. Yalnızca o an bile benim için tarif edilemeyecek kadar değerliydi.",
            "Önümüzdeki haftalarda daha nelerin ortaya çıkacağını bilmiyorum. Ancak şimdiden bu deneyim ve bana böylesine özenli, sevgi dolu ve değer veren bir şekilde eşlik ettiğiniz için sonsuz minnet duyuyorum.",
            "Tüm kalbimle: İkinize de teşekkür ederim. ❤️",
        ],
        author: "D. C.",
    },
};

const number_four = [
    {
        description:
        "Nervensystemzustände",
    },
    {
        description:
        "Bindungsmuster",
    },
    {
        description:
        "innere Konflikte",
    },
    {
        description:
        "emotionale Schutzstrategien",
    },
    {
        description:
        "frühe Prägungen",
    },
    {
        description:
        "verdrängte Gefühle",
    },
    {
        description:
        "Selbstwert- und Schamdynamiken",
    },
];

const number_five = [
    {
        description:
        "trauma-sensitive Prozessarbeit",
    },
    {
        description:
        "Arbeit mit inneren Anteilen",
    },
    {
        description:
        "Bindungs- und Beziehungsthemen",
    },
    {
        description:
        "Nervensystemarbeit",
    },
    {
        description:
        "emotionale Prozessbegleitung",
    },
    {
        description:
        "körperorientierte Wahrnehmung",
    },
    {
        description:
        "systemische Dynamiken",
    },
    {
        description:
        "energetische Wahrnehmung",
    },
    {
        description:
        "Bewusstseinsarbeit",
    },
];




export const Herotest = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const memberCopy = memberCallout[language];
    const testimonial = testimonialCopy[language];
    const [memberModalOpen, setMemberModalOpen] = useState(false);
    const [hasMemberSession, setHasMemberSession] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("spirit-member-popup-dismissed") === "yes") return undefined;

        let active = true;
        let timer;
        fetch("/api/members/session", { headers: { Accept: "application/json" } })
            .then((response) => {
                if (!active) return;
                if (response.ok) {
                    setHasMemberSession(true);
                    return;
                }
                timer = window.setTimeout(() => active && setMemberModalOpen(true), 650);
            })
            .catch(() => {
                timer = window.setTimeout(() => active && setMemberModalOpen(true), 650);
            });

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, []);

    const closeMemberModal = useCallback(() => {
        setMemberModalOpen(false);
        sessionStorage.setItem("spirit-member-popup-dismissed", "yes");
    }, []);

    const openMemberArea = () => {
        if (hasMemberSession) {
            navigate("/mitglieder");
            return;
        }
        setMemberModalOpen(true);
    };

    return <section id="hero" className="home-page relative overflow-hidden">
        <MemberWelcomeModal language={language} open={memberModalOpen} onClose={closeMemberModal} />
        <div className="relative z-10 w-full">
            <div className="relative isolate bg-[url('/herobg.jpeg')] bg-center bg-cover">
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-surface/95 via-surface/70 to-surface/10" aria-hidden="true"/>
                <div className="container relative mx-auto px-4 pb-28 pt-24 sm:px-6 sm:pb-32 sm:pt-28 lg:px-10">
                        <div className="grid gap-12 lg:grid-cols-2">
                            <div className="flex lg:pr-16">
                                <div className="animate-fade-in space-y-7 rounded-3xl border border-white/20 bg-surface/45 p-5 shadow-xl backdrop-blur-sm sm:p-8">
                                    <div className="space-y-0">    
                                        <h1 className="text-4xl font-bold leading-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">Online
                                            <span className="text-muted-foreground font-serif italic font-normal glow-text"> Praxis</span>
                                            <br/>
                                        </h1>
                                        <br/>
                                        <span className="py-4 text-xl text-muted-foreground sm:text-2xl md:text-3xl lg:text-4xl">
                                            Für integrative Therapie, Coaching & Beratung
                                        </span>
                                        <br/>
                                        <br/>
                                        <p className="text-base leading-7 text-[#123f38] sm:text-lg">
                                            Wir begleiten Menschen, die viel tragen und viel fühlen – und trotzdem das Gefühl haben,
                                            sich selbst irgendwo verloren zu haben. Mit Tiefe, Klarheit und echter menschlicher Präsenz
                                            schauen wir auf emotionale Prozesse, innere Muster und die Dynamiken des Nervensystems.
                                        </p>
                                    </div>
                                    <div>
                                        <Link to="/kontakt" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                                            Kontakt <ArrowRight className="w-5 h-5"/>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <div data-no-translate className="relative z-20 mx-auto -mt-10 w-full max-w-6xl px-4 sm:px-6">
                <div className="overflow-hidden rounded-[2rem] border border-primary/45 bg-[#f7f1e7] shadow-2xl shadow-black/20">
                    <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
                        <div>
                            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">
                                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                                {memberCopy.eyebrow}
                            </p>
                            <h2 className="mt-3 text-2xl font-bold leading-tight text-muted-foreground sm:text-3xl">{memberCopy.title}</h2>
                            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground/80 sm:text-lg">{memberCopy.text}</p>
                            <div className="mt-5 flex flex-col gap-2 text-sm font-semibold text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-5">
                                <span className="inline-flex items-center gap-2"><PlayCircle className="h-5 w-5 text-primary" aria-hidden="true" />{memberCopy.recording}</span>
                                <span className="inline-flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />{memberCopy.workbook}</span>
                                <span className="inline-flex items-center gap-2"><Headphones className="h-5 w-5 text-primary" aria-hidden="true" />{memberCopy.meditations}</span>
                            </div>
                        </div>
                        <button type="button" onClick={openMemberArea} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface lg:w-auto">
                            {memberCopy.button}<ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="glass rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="space-y-8 py-8 pb-16 items-center justify-center">
                        <div className="glow-border flex rounded-2xl bg-card/70 p-5 sm:p-8">
                            <div className="grid gap-4 lg:flex">
                                <div className="flex items-center justify-center md:px-1 ">
                                    <img src="/Hero/Blumehero.png" className=" 2xl:h-64 xl:h-52 lg:h-40 md:h-30 sm:h-24 h-24 rounded-full object-cover"/>
                                </div>
                                <div className="sm:pl-4">
                                    <p>
                                        Vielleicht kennst du das Gefühl, stark sein zu müssen – vieles zu tragen, 
                                        für andere da zu sein und dabei deine eigenen Bedürfnisse aus dem Blick zu verlieren.
                                        Vielleicht begleitet dich die Sorge, dass alles zusammenbrechen könnte, wenn du einmal innehältst. 
                                        Oder du spürst, dass deine Kraft langsam erschöpft ist und weißt nicht, 
                                        wie du etwas verändern kannst.
                                    </p> <br/>
                                    <div className="grid gap-16 grid-cols-6 px-2">
                                        <div className=""/>
                                        <div className=""/>
                                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                        </div>
                                    <div className="flex -mt-15 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-36 h-32 rounded-full"/>
                                    </div>
                                    <p>
                                        In unserer Begleitung darf alles Raum haben, was gerade da ist. 
                                        Wir schauen gemeinsam und behutsam auf das, was dich innerlich bewegt – 
                                        in deinem Tempo und mit einem traumasensiblen Blick auf deine Erfahrungen und 
                                        dein Nervensystem.
                                    </p> <br/>
                                    <p>
                                        Du beginnst zu verstehen, warum bestimmte Muster immer wieder auftauchen. 
                                        Warum du dich vielleicht zurückhältst, dich anpasst oder festhältst, 
                                        obwohl ein Teil von dir sich nach mehr Freiheit und innerer Sicherheit sehnt. 
                                        Schritt für Schritt kann sich lösen, was dich bisher eingeengt hat.
                                    </p> <br/>
                                    <p>
                                        So kann wieder Vertrauen in dich selbst entstehen. 
                                        Du spürst klarer, was dir wirklich wichtig ist und was dich stärkt.
                                    </p>
                                    <p>
                                        Du musst diesen Weg nicht allein gehen.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" glass rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                <div className="container mx-auto space-y-6 py-16">
                    <div className="grid md:grid-cols-2 gap-12 h-full">
                         <div className="bg-card rounded-2xl overflow-hidden">
                            <div className="grid md:grid-cols-2 h-full">
                                <div className="md:pl-16 max-md:px-16 py-12 md:-mr-16">
                                    <div className="flex -mt-15 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-42 h-38 rounded-full"/>
                                    </div>
                                    <h2 className="text-lg md:text-lg leading-tight font-bold text-primary">Traumasensible Prozessbegleitung
                                        <span className="font-serif italic font-normal text-white"> für Menschen, die funktionieren – und innerlich trotzdem kämpfen. </span>
                                        <br/>
                                    </h2>
                                    <br/>
                                    <div className="grid gap-8 grid-cols-2 px-2">
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-8 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                    </div>
                                    <br/>
                                    <p className="text-center text-sm">
                                    Manche Menschen wirken stabil. Und brechen innerlich trotzdem jeden Tag ein Stück zusammen.
                                    </p>
                                    <p className="text-center text-sm">
                                    Nicht sichtbar. Nicht laut. Aber konstant.
                                    </p>
                                    <p className="text-center text-sm text-primary">
                                    Vielleicht kennst du das:
                                    </p>
                                    <p className="text-center text-sm">
                                    Du denkst viel. Du reflektierst dich. <br/>
                                    Du verstehst oft sogar, warum du reagierst, wie du reagierst. <br/>
                                    Und trotzdem gerätst du immer wieder in dieselben inneren Schleifen.
                                    </p>
                                    <br/>
                                    <p className="text-center text-sm">
                                    Nähe fühlt sich gleichzeitig schön und gefährlich an. <br/>
                                    Ruhe wird plötzlich unerträglich. Ein Teil von dir sehnt sich nach Verbindung.<br/>
                                    Ein anderer zieht sich zurück.
                                    </p>
                                    <br/>
                                    <p className="text-center text-sm">
                                    Vielleicht hast du gelernt zu funktionieren. <br/>
                                    Aber nie wirklich Sicherheit in dir aufgebaut. Unsere Arbeit beginnt genau dort.
                                    </p>
                                    <br/>
                                    <p className="text-center text-sm">
                                    Nicht mit Optimierung. Nicht mit toxischer Positivität.  <br/>
                                    Nicht mit schnellen Lösungen.
                                    </p>
                                    <br/>
                                    <p className="text-center text-sm">
                                    Sondern mit dem Versuch zu verstehen, warum dein System geworden ist, <br/>
                                    wie es geworden ist.
                                    </p>
                                </div>
                                <div className="flex md:-ml-16 max-md:items-center max-md:justify-center">
                                    <img src="/Hero/heroplant3.JPG" className="object-cover max-md:rounded-3xl md:mask-radial-[100%_80%] md:mask-radial-from-80% md:mask-l-from-0%"/>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card rounded-2xl overflow-hidden">
                            <div className="grid h-full md:grid-cols-2 w-full">
                                <div className="md:pl-16 py-14 md:-mr-24">
                                    <div className="flex -mt-15 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-42 h-38 rounded-full"/>
                                    </div>
                                    <h3 className="text-lg md:text-lg text-center leading-tight  font-bold text-primary">Was
                                        <span className="font-serif italic font-normal text-white"> viele Menschen bei uns zum ersten Mal erleben </span>
                                        <br/>
                                    </h3>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <div className="grid gap-8 grid-cols-2 px-2">
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-8 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                    </div>
                                    <br/>
                                    <p className="text-center text-sm">
                                        Dass ihre Schutzmechanismen nicht bewertet werden.
                                    </p>
                                    <p className="text-center text-sm">
                                        Nicht die Wut. Nicht der Rückzug. Nicht die Scham. Nicht die Kontrolle. Nicht die Angst. <br/>
                                        Nicht die emotionale Überforderung.
                                    </p>
                                    <p className="text-center text-sm">
                                        Sondern verstanden.
                                    </p>
                                    <p className="text-center text-sm">
                                        Viele Muster wirken von außen irrational. Von innen ergeben sie oft vollkommen Sinn.
                                    </p>
                                    <br/>    
                                    <p className="text-sm text-center text-primary"> Unser Fokus liegt nicht nur auf Verhalten. Sondern auf den Dynamiken darunter:</p>        
                                    <br/>    
                                        <div className="flex items-center justify-center">
                                            <div>
                                                {number_four.map((item, idx) => (                            
                                                <div 
                                                    key={idx}                                 
                                                    className="p-0"
                                                >                                
                                                    <span className="text-center text-sm inline-flex items-center justify-center gap-4">
                                                    <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                        {item.description}
                                                    </span>
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                        <br/>
                                    <p className="text-sm text-center "> Denn oft ist nicht „etwas falsch“ mit dir.</p>
                                    <p className="text-sm text-center "> Sondern ein Teil deines Systems lebt noch immer in alten Überlebensmustern.</p>
                                    <br/>
                                    <br/>
                                    <br/>
                                </div>
                                <div className="flex md:-ml-8 md:-mb-2 max-md:items-center max-md:justify-center">
                                    <img src="/Hero/herostein2.PNG" className="object-cover max-md:rounded-3xl md:mask-radial-[100%_80%] md:mask-radial-from-80% md:mask-l-from-0%"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                    
            </div>
            <div className=" bg-card rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                    <div className="container mx-auto space-y-6 py-16">
                        <div className="glass flex rounded-2xl glow-border tiems-center justify-center overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <div className="mt-0 mb-0 max-md:px-6 py-6 md:pl-8 md:-mr-24">
                                    <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Der Weg
                                        <span className="font-serif italic font-normal text-white"> zurück zu dir </span>
                                    <br/>
                                    </h3>
                                    <br/>
                                    <div className="grid gap-8 grid-cols-6 px-2">
                                        <div/>
                                        <div/>
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-8 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                    </div>
                                    <br/>
                                    <p className="text-sm">
                                        Jeder Mensch bringt seine eigene Geschichte, Erfahrungen und inneren Dynamiken mit. 
                                        Deshalb verläuft auch jeder Veränderungsprozess anders. Manchmal genügt ein behutsames Hinschauen,
                                        manchmal braucht es mehr Zeit und tiefere innere Arbeit,
                                        damit sich wirklich etwas verändern kann.
                                    </p>
                                    <br/>
                                    <p className="text-sm">
                                        Im Mittelpunkt steht dabei immer die Verbindung zu dir selbst: zu deinen Bedürfnissen, 
                                        deinen Grenzen und dem, was dir wirklich wichtig ist.
                                    </p>
                                    <br/>
                                    <p className="text-sm">
                                        So kannst du Schritt für Schritt erkennen, 
                                        welche inneren Muster dich bisher eingeschränkt haben – 
                                        und beginnen, das loszulassen, 
                                        was dir nicht mehr entspricht.
                                    </p>
                                    <br/>
                                    <br/>
                                    <p className="text-sm">
                                        Hier findest du Möglichkeiten, wie wir dich auf diesem Weg begleiten können: traumasensibel, 
                                        achtsam und in deinem eigenen Tempo.
                                    </p>
                                </div>
                                <div className="flex md:-ml-8 -mb-2">
                                    <img src="/Hero/steine.jpeg" className="object-cover md:mask-l-from-60%"/>
                                </div>
                            </div>
                        </div>
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="flex">
                            <div className="glass glow-border rounded-2xl overflow-hidden">
                                <div className="space-y-0">
                                    <div className="flex -mt-32 pb-4">
                                        <img src="/Hero/traumasens.jpeg" className="object-cover mask-b-from-80%"/>
                                    </div>
                                    <div className="flex items-center justify-center pb-4">
                                        <h2 className="text-2xl md:text-2xl text-center text-primary font-bold leading-tight">Traumasensible 
                                            <span className="text-white font-serif italic glow-text"> Begleitung</span>
                                            <br/>
                                        </h2>
                                    </div>
                                    <div className="grid gap-8 grid-cols-6 px-2">
                                        <div/>
                                        <div/>
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-8 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                    </div>
                                    <div className="px-16 pt-4">
                                        <p className="text-sm text-center">
                                            Die Auswirkungen belastender Erfahrungen – sei es durch frühe Entwicklungsprägungen 
                                            oder durch überwältigende Ereignisse – können Menschen oft über viele Jahre begleiten. 
                                            Sie zeigen sich in innerer Anspannung, wiederkehrenden Mustern, Unsicherheit oder dem Gefühl, 
                                            sich selbst nicht wirklich vertrauen zu können.
                                        </p>
                                        <br/>
                                        <p className="text-sm text-center">
                                            In unserer traumasensiblen Begleitung unterstützen wir dich dabei, diese Zusammenhänge behutsam 
                                            zu verstehen und Schritt für Schritt neue innere Stabilität zu entwickeln. 
                                            Dabei arbeiten wir nicht nur mit dem, was im Denken sichtbar ist, 
                                            sondern auch mit den emotionalen und körperlichen Reaktionen deines Nervensystems.
                                        </p>
                                        <br/>
                                        <p className="text-sm text-center">
                                            So kann sich nach und nach lösen, was dich bisher innerlich festgehalten hat. Gleichzeitig stärkst 
                                            du deine Fähigkeit, dich selbst besser wahrzunehmen, 
                                            deine Grenzen zu achten und wieder mehr Vertrauen in dich und dein Leben zu entwickeln.
                                        </p>
                                        <br/>
                                    </div>
                                </div>
                                <div className=" flex items-center justify-center mb-6">
                                    <div className="flex bg-primary items-center justify-center rounded-full px-4 hover:bg-surface">   
                                        <Link 
                                            to="/coaching"
                                            className="px-8 py-2 text-xl text-muted-foreground hover:text-primary-foreground rounded-full"
                                        >
                                            Mehr erfahren
                                        </Link>
                                        <ArrowRight className="text-muted-foreground"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex ">
                            <div className="glass rounded-2xl overflow-hidden">
                                <div className="space-y-0">
                                    <div className="flex -mt-32 pb-4">
                                        <img src="/Hero/psyschberatung.jpeg" className="object-cover mask-b-from-80%"/>
                                    </div>
                                    <div className="flex items-center justify-center pb-4">
                                        <h2 className="text-2xl md:text-2xl text-center text-primary font-bold leading-tight">Therapeutische
                                            <span className="text-white font-serif italic glow-text"> Begleitung</span>
                                            <br/>
                                        </h2>
                                    </div>
                                    <div className="grid gap-8 grid-cols-6 px-2">
                                        <div/>
                                        <div/>
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-8 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                    </div>
                                    <div className="px-16 pt-4">
                                        <p className="text-sm text-center">
                                            Manchmal geraten wir in Kreisläufe aus Erwartungsdruck, Überforderung und Selbstkritik. 
                                            Gedanken drehen sich im Kreis, 
                                            der Anspruch an sich selbst wird immer größer und das Gefühl entsteht, nie wirklich zu genügen.
                                        </p>
                                        <br/>
                                        <p className="text-sm text-center">
                                            In unserer therapeutischen Begleitung unterstützen wir dich dabei, diese Muster besser zu
                                            verstehen und einen achtsameren Umgang mit dir selbst zu entwickeln. 
                                            Gemeinsam schauen wir auf die inneren Überzeugungen und Erfahrungen, die dein Erleben geprägt haben.
                                        </p>
                                        <br/>
                                        <p className="text-sm text-center">
                                            Du darfst jetzt den nächsten Schritt gehen.
                                        </p>
                                        <br/>
                                        <p className="text-sm text-center pb-4">
                                            So kann Schritt für Schritt mehr Selbstakzeptanz, Klarheit und innere Stabilität entstehen – 
                                            und du findest wieder einen Zugang zu deinen eigenen Bedürfnissen und Ressourcen.
                                        </p>
                                        <br/>
                                        <br/>
                                    </div>
                                </div>
                                <div className=" flex items-center justify-center mb-6">
                                    <div className="flex bg-primary items-center justify-center rounded-full px-4 hover:bg-surface">   
                                        <Link 
                                            to="/therapie"
                                            className="px-8 py-2 text-xl text-muted-foreground hover:text-primary-foreground rounded-full"
                                        >
                                            Mehr erfahren
                                        </Link>
                                        <ArrowRight className="text-muted-foreground"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" bg-card rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                <div className="container mx-auto space-y-6 py-16">
                    <div className="glass rounded-2xl glow-border overflow-hidden">
                        <div className="grid md:grid-cols-2 w-full h-full">
                            <div className="py-6">
                                <h3 className="text-2xl md:text-2xl text-center leading-tight pb-2 font-bold text-primary">Unsere
                                    <span className="font-serif italic font-normal text-white"> Arbeit </span>
                                    <br/>
                                </h3>
                                <div className="grid gap-8 grid-cols-6 px-2">
                                    <div/>
                                    <div/>
                                    <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                    <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                </div>
                                <div className="flex -mt-8 -mb-8 items-center justify-center">
                                    <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                </div>
                                <p className="text-sm text-center pt-2 pb-2"> Unsere Begleitung verbindet:</p>
                                    <div className="flex items-center justify-center">
                                        <div>
                                            {number_five.map((item, idx) => (                            
                                            <div 
                                                key={idx}                                 
                                                className="p-0"
                                            >                                
                                                <span className="text-center text-sm inline-flex items-center justify-center gap-4">
                                                    <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                    {item.description}
                                                </span>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                    <br/>
                                <p className="text-sm text-center "> Dabei arbeiten wir nicht nach starren Konzepten.</p>
                                <p className="text-sm text-center "> Wir folgen dem, was sich im System wirklich zeigt.</p>
                                <br/>
                                <p className="text-sm text-center "> Manchmal ruhig und stabilisierend. Manchmal direkt.</p>
                                <p className="text-sm text-center "> Manchmal konfrontierend. Aber niemals beschämend.</p>
                            </div>
                            <div className="min-h-72 overflow-hidden">
                                <img src="/Hero/bild.jpeg" className="h-full w-full object-cover object-center md:mask-l-from-70%"/>
                            </div>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-2 lg:gap-12 gap-8 w-full">
                        <div className="flex">
                            <div className="bg-[url('/pflanzelinks.jpeg')] bg-right bg-cover glow-border rounded-2xl overflow-hidden py-6 lg:pl-44 md:pl-80 sm:pl-48 max-sm:px-12">
                                <h3 className="text-2xl md:text-2xl text-center leading-tight font-bold text-black">Wie Menschen
                                    <span className="font-serif italic font-normal text-muted-foreground"> unsere Arbeit oft erleben </span>
                                    <br/>
                                </h3>
                                <br/>
                                <div className="grid gap-8 grid-cols-4 px-2">
                                    <div/>
                                    <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                    <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                </div>
                                <div className="flex -mt-8 -mb-8 items-center justify-center">
                                    <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                </div>
                                <br/>
                                <div>
                                    <p className="text-center text-black">
                                        Viele Menschen kommen zu uns, weil sie bereits viel ausprobiert haben.
                                    </p>
                                    <p className="text-center text-black">
                                        Sie haben reflektiert. Gelesen. Analysiert.
                                    </p>
                                    <p className="text-center text-black">
                                        Therapien gemacht. Methoden gelernt.
                                    </p>
                                    <p className="text-center text-black">
                                        Und trotzdem bleibt etwas bestehen.
                                    </p> 
                                    <br/>  
                                    <p className="text-center text-black"> Oft hören wir Sätze wie:</p>
                                    <br/>
                                    <p className="text-center text-black"> „Ich habe mich zum ersten Mal wirklich verstanden gefühlt.“</p>
                                    <p className="text-center text-black"> „Ihr habt Dinge ausgesprochen, die ich selbst nicht greifen konnte.“</p>
                                    <p className="text-center text-black"> „Es war intensiv, aber nicht überfordernd.“</p>
                                    <p className="text-center text-black"> „Ich musste mich nicht verstellen.“</p>
                                    <p className="text-center text-black"> „Zum ersten Mal hatte ich das Gefühl, dass jemand wirklich sieht, was in mir passiert.“</p>
                                    <br/>
                                    <p className="text-center text-black"> Vielleicht, weil Menschen weniger perfekte Antworten brauchen.</p>
                                    <p className="text-center text-black"> Und mehr Räume, in denen sie nicht kämpfen müssen, um verstanden zu werden.</p> 
                                </div>
                            </div>
                        </div>
                        <div className="flex ">
                            <div className="bg-[url('/steinerechts.jpeg')] bg-left bg-cover glow-border rounded-2xl overflow-hidden py-6 pr-16 pl-6">
                                <div className="lg:flex lg:items-center h-full lg:justify-center md:pr-32">
                                    <div>    
                                        <h3 className="text-2xl md:text-2xl text-center leading-tight  font-bold text-black">Unsere
                                        <span className="font-serif italic font-normal text-muted-foreground"> Haltung </span>
                                        <br/>
                                        </h3>
                                        <br/>
                                        <div className="grid gap-8 grid-cols-4 px-2">
                                            <div/>
                                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                        </div>
                                        <div className="flex -mt-8 -mb-8 items-center justify-center">
                                            <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                        </div>
                                        <br/>
                                        <p className="text-center text-black">
                                            Wir glauben nicht, dass Menschen einfach „positiver denken“ müssen.
                                        </p>
                                        <p className="text-center text-black">
                                            Wir glauben auch nicht, dass Heilung darin besteht, sich über Schmerz hinwegzuspiritualisieren.
                                        </p>
                                        <br/>
                                        <p className="text-center text-black">
                                            Viele Reaktionen entstehen nicht aus Schwäche. Sondern aus Anpassung.
                                        </p>
                                        <p className="text-center text-black">
                                            Aus Nervensystemlogik. Aus Bindung. Aus Schutz.
                                        </p>
                                        <br/>
                                        <p className="text-center text-black">
                                            Deshalb arbeiten wir nicht gegen Symptome. Sondern versuchen, die innere Logik dahinter zu verstehen.  
                                        </p>
                                        <br/>
                                        <p className="text-center text-black"> Vielleicht musst du nicht härter gegen dich kämpfen.</p> 
                                        <br/>   
                                        <p className="text-center text-black"> Vielleicht braucht dein System nicht noch mehr Druck.</p>
                                        <p className="text-center text-black"> Sondern zum ersten Mal einen Raum, in dem es nicht falsch ist.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative bg-[#f7f1e7] px-4 py-16 sm:px-6 sm:py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-9 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{testimonial.eyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold leading-tight text-muted-foreground sm:text-4xl">{testimonial.title}</h2>
                    </div>
                    <article className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-white/80 p-6 shadow-xl shadow-black/10 sm:p-10 lg:p-12">
                        <Quote className="absolute right-6 top-6 h-16 w-16 text-primary/10 sm:right-10 sm:top-8 sm:h-20 sm:w-20" aria-hidden="true" />
                        <div className="relative">
                            <div className="mb-5 flex gap-1 text-primary" aria-label="5 von 5 Sternen">
                                {[0, 1, 2, 3, 4].map((star) => <Star key={star} className="h-5 w-5 fill-current" aria-hidden="true" />)}
                            </div>
                            <p className="mb-7 text-sm font-semibold text-primary">{testimonial.session}</p>
                            <blockquote className="space-y-5 text-base leading-8 text-muted-foreground sm:text-lg">
                                {testimonial.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                            </blockquote>
                            <footer className="mt-8 border-t border-primary/20 pt-6">
                                <p className="font-bold text-muted-foreground">— {testimonial.author}</p>
                            </footer>
                        </div>
                    </article>
                </div>
            </div>

            <div className="border-y border-white/10 bg-[#0B777A]">
                    <div className="mx-auto grid max-w-6xl items-center md:grid-cols-[0.45fr_1.15fr_0.8fr]">
                        <div className="flex items-center justify-center p-8">
                            <Calendar1 className="md:w-36 md:h-36 w-24 h-24 text-primary"/>
                        </div>
                        <div className="px-6 py-10">
                            <h2 className="text-3xl font-bold leading-tight">Ein erster Schritt kann vieles in Bewegung bringen</h2>
                            <p className="mt-4 leading-7 text-white/85">
                                Wenn du möchtest, finden wir in einem kostenfreien Gespräch heraus, was dir guttut.
                                Ganz unverbindlich und nur für dich.
                            </p>
                            <div className="pt-6">
                                <Link to="/kontakt" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                                    Kennenlernen <ArrowRight className="w-5 h-5"/>
                                </Link>
                            </div>
                        </div>
                        <div className="min-h-64 overflow-hidden md:min-h-full">
                            <img src="/breachright.jpeg" className="h-full w-full object-cover object-center md:mask-l-from-50%"/>
                        </div>
                    </div>
            </div>
            <div className="mb-6">
                <div className="flex items-center justify-center gap-4 pb-3">
                    <a
                        href="https://www.facebook.com/profile.php?id=61588723230682"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition hover:border-primary hover:text-primary"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
                            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.24 0-1.62.77-1.62 1.56V12h2.76l-.44 2.89h-2.32v6.99A10 10 0 0 0 22 12Z" />
                        </svg>
                    </a>
                    <a
                        href="https://www.instagram.com/spirit4healing/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition hover:border-primary hover:text-primary"
                    >
                        <Instagram className="h-6 w-6" aria-hidden="true" />
                    </a>
                </div>
                <div className="flex items-center justify-center">
                    <div className="flex items-center justify-center px-4">
                        <Link
                            to="/impressum"
                            className="px-8 py-2 text-sm text-white"
                        >
                            Impressum
                        </Link>
                    </div>
                    <div className="flex items-center justify-center px-4">
                        <Link
                            to="/datenschutz"
                            className="px-8 py-2 text-sm text-white"
                        >
                            Datenschutz
                        </Link>
                    </div>
                </div>
            </div>
        </div> 
    </section>
}
