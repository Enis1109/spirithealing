import { lazy, Suspense } from "react"
import { Navbar } from "@/layout/Navbar"
import ScrollToTop from "@/layout/ScrollToTop"
import { About } from "@/sections/About"
import { Herotest } from "@/sections/Herotest"
import { Therapie } from "@/sections/Therapy"
import { Pricing } from "@/sections/Pricing"
import { Coaching } from "@/sections/Coaching"
import { FAQ } from "@/sections/FAQ"
import { Contact } from "@/sections/Contact"
import { Events } from "@/sections/Events"
import { NewsletterStatus } from "@/sections/NewsletterStatus"
import { BookingHub } from "@/sections/BookingHub"
import { Route, Routes, useLocation } from "react-router-dom"
import { Imp } from "@/sections/Imp"
import { Daten } from "@/sections/Daten"
import { DocumentTranslator } from "@/i18n/DocumentTranslator"
import { useLanguage } from "@/i18n/LanguageContext"
import { WebsiteAssistant } from "@/components/WebsiteAssistant"
import { BerlinLive } from "@/sections/BerlinLive"
import { Zepter13 } from "@/sections/Zepter13"
import { Rauhnaechte } from "@/sections/Rauhnaechte"

const MemberArea = lazy(() => import("@/sections/MemberArea").then((module) => ({ default: module.MemberArea })));
const AdminArea = lazy(() => import("@/sections/AdminArea").then((module) => ({ default: module.AdminArea })));
const OnboardingQuestionnaire = lazy(() => import("@/sections/OnboardingQuestionnaire").then((module) => ({ default: module.OnboardingQuestionnaire })));
const ScheduleSurvey = lazy(() => import("@/sections/ScheduleSurvey").then((module) => ({ default: module.ScheduleSurvey })));

const PrivacyPage = () => {
  const { language } = useLanguage();

  return (
    <>
      {language === "tr" && (
        <div className="container mx-auto px-6 pt-28">
          <div className="rounded-2xl border border-primary/40 bg-surface/70 p-5 text-muted-foreground">
            <p className="font-semibold text-primary">Gizlilik bildirimi hakkında önemli bilgi</p>
            <p className="mt-2">
              Aşağıdaki hukuki metin, doğruluğunun korunması için Almanca özgün haliyle sunulmaktadır.
              Türkçe hukuki sürüm uzman incelemesinden sonra eklenebilir.
            </p>
          </div>
        </div>
      )}
      <div data-no-translate={language === "tr" ? "true" : undefined}>
        <Daten/>
      </div>
    </>
  );
};

function App() {
  const location = useLocation();
  const isCampaignLanding = location.pathname === "/gratis-meditationen";
  const isBerlinLanding = location.pathname === "/berlin-live";
  const isZepter13Landing = location.pathname === "/13-wochen-programm";
  const isRauhnaechteLanding = location.pathname === "/rauhnaechte";
  const isAdminApp = location.pathname.startsWith("/admin");
  const isOnboardingApp = location.pathname.startsWith("/startfragebogen");
  const isScheduleSurveyApp = location.pathname.startsWith("/terminumfrage");
  const isMemberApp = location.pathname.startsWith("/mitglieder")
    || isCampaignLanding;
  const isStandaloneApp = isMemberApp || isAdminApp || isOnboardingApp || isScheduleSurveyApp || isBerlinLanding || isZepter13Landing || isRauhnaechteLanding;

  return (
    <div className="min-h-screen min-w-screen overflow-x-hidden">
      <DocumentTranslator/>
      <ScrollToTop/>
      {!isStandaloneApp && <Navbar/>}
      <Routes>
        <Route path="/" element={ <Herotest/> }/>
        <Route path="/coaching" element={<Coaching/>}/>
        <Route path="/therapie" element={<Therapie/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/prices" element={<Pricing/>}/>
        <Route path="/termin-buchen" element={<BookingHub/>}/>
        <Route path="/faq" element={<FAQ/>}/>
        <Route path="/vortraege-seminare" element={<Events/>}/>
        <Route path="/kontakt" element={<Contact/>}/>
        <Route path="/newsletter/status" element={<NewsletterStatus/>}/>
        <Route path="/berlin-live" element={<BerlinLive/>}/>
        <Route path="/13-wochen-programm" element={<Zepter13/>}/>
        <Route path="/rauhnaechte" element={<Rauhnaechte/>}/>
        <Route path="/mitglieder/*" element={
          <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#edf8f6] font-bold text-[#168e91]">Spirit Healing wird geladen …</main>}>
            <MemberArea/>
          </Suspense>
        }/>
        <Route path="/gratis-meditationen" element={
          <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#edf8f6] font-bold text-[#168e91]">Spirit Healing wird geladen …</main>}>
            <MemberArea/>
          </Suspense>
        }/>
        <Route path="/admin" element={
          <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#eaf4f1] font-bold text-[#0f8b8d]">Admin-Bereich wird geladen …</main>}>
            <AdminArea/>
          </Suspense>
        }/>
        <Route path="/startfragebogen" element={
          <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#eaf4f1] font-bold text-[#0f8b8d]">Startfragebogen wird geladen …</main>}>
            <OnboardingQuestionnaire/>
          </Suspense>
        }/>
        <Route path="/terminumfrage" element={
          <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#eaf4f1] font-bold text-[#0f8b8d]">Terminabfrage wird geladen …</main>}>
            <ScheduleSurvey/>
          </Suspense>
        }/>
        <Route path="/impressum" element={<Imp/>}/>
        <Route path="/datenschutz" element={<PrivacyPage/>}/>
      </Routes>
      {!isStandaloneApp && <WebsiteAssistant/>}
    </div>
  )
}

export default App
