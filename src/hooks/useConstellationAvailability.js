import { useEffect, useState } from "react"
import { constellationDays, constellationCapacity } from "@/content/constellationDays"

export function useConstellationAvailability() {
  const [days, setDays] = useState()
  useEffect(() => {
    let active = true, controller
    const refresh = async () => {
      if (document.visibilityState === "hidden") return
      controller?.abort()
      const requestController = new AbortController()
      controller = requestController
      const timeout = setTimeout(() => requestController.abort(), 10000)
      try {
        const response = await fetch("/api/aufstellungen/plaetze", {
          cache: "no-store", headers: { Accept: "application/json" }, signal: requestController.signal,
        })
        if (!response.ok) throw new Error("availability")
        const result = await response.json()
        const valid = result.ok && constellationDays.every(day => {
          const seats = result.days?.[day.id]
          return seats && ["own", "representative", "total"].every(type => Number.isInteger(seats[type])
            && seats[type] >= 0 && seats[type] <= constellationCapacity[type])
            && seats.total === seats.own + seats.representative
        })
        if (!valid) throw new Error("availability")
        if (active && controller === requestController) setDays(result.days)
      } catch {
        if (active && controller === requestController) setDays(null)
      } finally { clearTimeout(timeout) }
    }
    refresh()
    const timer = setInterval(refresh, 30000)
    window.addEventListener("focus", refresh)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      active = false
      controller?.abort()
      clearInterval(timer)
      window.removeEventListener("focus", refresh)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [])
  return days
}
