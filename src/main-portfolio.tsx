import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './theme/useTheme'

// Get base path from import.meta.env or fallback to '/'
const basePath = import.meta.env.BASE_URL || '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter basename={basePath}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)

