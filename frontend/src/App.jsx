import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import SalesTeam from './pages/SalesTeam'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import VerifyCode from './pages/VerifyCode'
import ResetPassword from './pages/ResetPassword'

const Soon = ({ title }) => <h1 style={{ padding: '2rem' }}>{title} (coming soon)</h1>

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<SalesTeam />} />
        <Route path="/how-it-works" element={<Soon title="How It Works" />} />
        <Route path="/admin-tools" element={<Soon title="Admin Tools" />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}