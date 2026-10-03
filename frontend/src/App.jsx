import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SalesTeam from './pages/SalesTeam'

const Soon = ({ title }) => <h1 style={{ padding: '2rem' }}>{title} (coming soon)</h1>

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SalesTeam />} />
        <Route path="/how-it-works" element={<Soon title="How It Works" />} />
        <Route path="/admin-tools" element={<Soon title="Admin Tools" />} />
      </Routes>
    </>
  )
}