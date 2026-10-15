import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ShoppingBag } from 'lucide-react'
import './Login.css'



export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // backend look am 
    console.log('Sign in with', { email, remember })
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