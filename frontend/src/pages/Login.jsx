import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ShoppingBag } from 'lucide-react'
import './Login.css'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z" />
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // later: send these to the backend through a function in services/
    console.log('Sign in with', { email, remember })
  }

  return (
    <div className="login">
      {/* ---------- Left: brand panel ---------- */}
      <aside className="login__brand">
        <div className="login__brand-logo">
          <img src="/images/logo.png" alt="" />
        </div>
        <p className="login__brand-name">Staff Commerce</p>
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
            <label htmlFor="email" className="login__label">Email Address</label>
            <div className="field">
              <Mail size={20} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label htmlFor="password" className="login__label">Password</label>
            <div className="field">
              <Lock size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="field__toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="login__row">
              <label className="login__remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="login__forgot">Forgot password?</Link>
            </div>

            <button type="submit" className="btn-signin">Sign in</button>
          </form>

          <div className="login__divider"><span>or</span></div>

          <button type="button" className="btn-google">
            <GoogleIcon />
            Sign in with Google
          </button>
        </div>
           <p className="login__signup">
            Don't have an account? <Link to="/signup">Sign up</Link>
           </p>
        <p className="login__footer">
          © {new Date().getFullYear()} Home Interior. All rights reserved.
        </p>
      </main>
    </div>
  )
}