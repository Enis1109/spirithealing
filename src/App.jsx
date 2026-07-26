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
import { MemberArea } from "@/sections/MemberArea"
import { Route, Routes } from "react-router-dom"
import { Imp } from "@/sections/Imp"
import { Daten } from "@/sections/Daten"
import { DocumentTranslator } from "@/i18n/DocumentTranslator"
import { useLanguage } from "@/i18n/LanguageContext"

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

  return (
    <div className="min-h-screen min-w-screen overflow-x-hidden">
      <DocumentTranslator/>
      <ScrollToTop/>
      <Navbar/>
      <Routes>
        <Route path="/" element={ <Herotest/> }/>
        <Route path="/coaching" element={<Coaching/>}/>
        <Route path="/therapie" element={<Therapie/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/prices" element={<Pricing/>}/>
        <Route path="/faq" element={<FAQ/>}/>
        <Route path="/vortraege-seminare" element={<Events/>}/>
        <Route path="/kontakt" element={<Contact/>}/>
        <Route path="/newsletter/status" element={<NewsletterStatus/>}/>
        <Route path="/mitglieder" element={<MemberArea/>}/>
        <Route path="/impressum" element={<Imp/>}/>
        <Route path="/datenschutz" element={<PrivacyPage/>}/>
      </Routes>
    </div>
  )
}

export default App
