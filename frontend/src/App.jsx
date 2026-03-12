import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Interview from './pages/Interview.jsx'
import Results from './pages/Results.jsx'
import Navbar from './components/Navbar.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </>
  )
}
