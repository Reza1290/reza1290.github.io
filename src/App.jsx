import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Portfolio from './pages/Portfolio'
import Admin     from './pages/Admin'
import './styles/index.css'
import './styles/animations.css'
import './pages/Admin.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<Portfolio />} />
        <Route path="/admin"  element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
