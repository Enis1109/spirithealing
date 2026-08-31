import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export const NotFound = () => (
  <main className="flex min-h-screen items-center bg-card px-5 pb-16 pt-28 text-white sm:px-8">
    <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/15 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/15 sm:p-12">
      <img src="/Logo-tuerkis.jpeg?v=20260730" alt="Spirit Healing" className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-primary/60" />
      <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-primary">Fehler 404</p>
      <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">Diese Seite wurde nicht gefunden.</h1>
      <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/75">Vielleicht wurde der Link verändert oder die Seite ist nicht mehr verfügbar. Über die Startseite findest du alle aktuellen Angebote und Termine.</p>
      <Link to="/" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bold text-primary-foreground transition hover:bg-surface">
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />Zur Startseite
      </Link>
    </section>
  </main>
)
