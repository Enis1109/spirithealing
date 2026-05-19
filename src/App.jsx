import { Navbar } from "@/layout/Navbar"
import ScrollToTop from "@/layout/ScrollToTop"
import { About } from "@/sections/About"
import { Herotest } from "@/sections/Herotest"
import { Therapie } from "@/sections/Therapy"
import { Pricing } from "@/sections/Pricing"
import { Coaching } from "@/sections/Coaching"
import { FAQ } from "@/sections/FAQ"
import { Route, Routes } from "react-router-dom"

function App() {

  return (
    <div className="min-h-screen min-w-screen overflow-x-hidden">
      <ScrollToTop/>
      <Navbar/>
      <Routes>
        <Route path="/" element={ <Herotest/> }/>
        <Route path="/coaching" element={<Coaching/>}/>
        <Route path="/therapie" element={<Therapie/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/prices" element={<Pricing/>}/>
        <Route path="/faq" element={<FAQ/>}/>
      </Routes>
    </div>
  )
}

export default App
