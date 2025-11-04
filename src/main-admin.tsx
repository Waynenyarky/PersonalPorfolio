import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminReviews from './pages/AdminReviews'
import { ThemeProvider } from './theme/useTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AdminReviews />
    </ThemeProvider>
  </StrictMode>,
)

