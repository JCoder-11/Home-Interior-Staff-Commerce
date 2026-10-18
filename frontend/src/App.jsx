import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import SalesTeam from './pages/SalesTeam'
import HowItWorks from './pages/HowItWorks'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import VerifyCode from './pages/VerifyCode'
import ResetPassword from './pages/ResetPassword'
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"
import ITAdminDashboard from "./pages/ITAdminDashboard"

const Soon = ({ title }) => (
  <h1 style={{ padding: '2rem' }}>{title} (coming soon)</h1>
)

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
      {/* Public pages with Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<SalesTeam />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/admin-tools" element={<Soon title="Admin Tools" />} />
      </Route>

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Temporarily open dashboards (no protection) */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/it-admin" element={<ITAdminDashboard />} />
    </Routes>
  )
}