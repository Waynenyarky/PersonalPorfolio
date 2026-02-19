import './App.css'
import { Routes, Route } from 'react-router-dom'
import Main from './pages/portfolio'
import AdminReviews from './pages/AdminReviews'
import Layout from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div>
        <Routes>
          <Route path="/" element={<Layout><Main /></Layout>} />
          <Route path="/admin/reviews" element={<Layout><AdminReviews /></Layout>} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}

export default App
