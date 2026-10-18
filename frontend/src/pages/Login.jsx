import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ShoppingBag } from 'lucide-react'
import './Login.css'
import { homeFor } from '../lib/roles'
import { useAuth } from "../hooks/useAuth";


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // backend look am

    // TEMPORARY: fake login until the backend is ready.
    let role = 'sales'
    if (email.includes('itadmin')) role = 'it_admin'
    else if (email.includes('admin')) role = 'admin'

    const userData = { name: 'Michael Okafor', role }

    login(userData)
    navigate(homeFor(userData.role))
  }

  return (
    <div className="login">
      {/* ---------- Left: brand panel ---------- */}
      <aside className="login__brand">
        <div className="login__brand-logo">
          <img src="/images/logo.png" alt="" />
        </div>
        <p className="login__brand-name">Home Interior</p>
        <h1>
          Sell Faster.<br />Serve Better.
        </h1>
        <p className="login__brand-text">
          Sign in to your mobile workspace and keep the floor moving in real time.
        </p>
        <ShoppingBag className="login__brand-bag" strokeWidth={1} />
      </aside>

      {/* ---------- Right: form ---------- */}
      <main className="login__main">
        <div className="login__card">
          <img
            src="/images/logo.png"
            alt="Home Interior Staff Commerce"
            className="login__card-logo"
          />
          <h2>Welcome Back</h2>
          <p className="login__subtitle">Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="login__label">
              Email Address
            </label>
            <div className="field">
              <Mail size={20} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
            </div>

            <label htmlFor="password" className="login__label">
              Password
            </label>
            <div className="field">
              <Lock size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="login__options">
              <label className="login__remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="login__link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login__submit">
              Sign In
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}