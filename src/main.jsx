import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '@/i18n/LanguageContext.jsx'
import { ContentProvider } from '@/content/ContentContext.jsx'
import { SiteMeasurementProvider } from '@/components/SiteMeasurementProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ContentProvider>
        <BrowserRouter>
          <SiteMeasurementProvider><App /></SiteMeasurementProvider>
        </BrowserRouter>
      </ContentProvider>
    </LanguageProvider>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}
