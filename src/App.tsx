import './App.css'
import { Routes, Route } from 'react-router-dom'
import Main from './pages/portfolio'
import AdminReviews from './pages/AdminReviews'


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
      </Routes>
    </div>
  )
}

export default App
