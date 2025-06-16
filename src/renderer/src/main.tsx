import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import BOMConsultationScreen from './components/BOMtest'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <BOMConsultationScreen />
  </StrictMode>
)
