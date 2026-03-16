import React from 'react'
import ReactDOM from 'react-dom/client'
import ComptaScan from './ComptaScan.jsx'

// Enregistrement du Service Worker PWA (géré par vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nouvelle version disponible. Mettre à jour ?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('ComptaScan est prêt à fonctionner hors-ligne')
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ComptaScan />
  </React.StrictMode>,
)
