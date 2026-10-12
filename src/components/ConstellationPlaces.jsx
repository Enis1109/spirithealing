export const ConstellationPlaces = ({ seats, language = "de", compact = false }) => {
  if (seats === null) return <p role="status" className="text-sm leading-6 text-[#49635f]">{language === "tr" ? "Güncel kontenjana şu anda ulaşılamıyor." : "Die aktuelle Platzanzeige ist gerade nicht erreichbar."}</p>
  if (!seats) return <p role="status" className="text-sm leading-6 text-[#49635f]">{language === "tr" ? "Güncel kontenjan sorgulanıyor." : "Aktuelle Plätze werden abgefragt."}</p>
  return <div aria-live="polite" className="space-y-1 text-sm leading-6 text-[#49635f]">
    <p className="font-bold text-[#075a57]">{language === "tr" ? `${seats.total} boş yer` : `${seats.total} freie ${seats.total === 1 ? "Platz" : "Plätze"}`}</p>
    {!compact && <p>{language === "tr" ? `${seats.representative} temsilci yeri · ${seats.own} kendi dizimi yeri` : `${seats.representative} für Stellvertretung · ${seats.own} für eigene Aufstellungen`}</p>}
  </div>
}
