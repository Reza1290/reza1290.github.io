import { HashRouter, Routes, Route } from 'react-router-dom'
import Portfolio from './pages/Portfolio'
import Admin     from './pages/Admin'
import './styles/index.css'
import './styles/animations.css'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"      element={<Portfolio />} />
        <Route path="/admin" element={<Admin />}     />
      </Routes>
    </HashRouter>
  )
}
