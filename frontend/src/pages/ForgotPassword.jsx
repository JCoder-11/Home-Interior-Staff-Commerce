import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: ask the backend to email a 6-digit code to `email`
    await new Promise((r) => setTimeout(r, 600)) // fake delay for now
    setLoading(false)
    navigate('/verify-code', { state: { email } })
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries, we'll send you a reset code to your email."
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="auth__label">Email Address</label>
        <div className="auth-field">
          <Mail size={22} className="auth-field__icon" />
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth__btn" disabled={loading}>
          {loading ? 'Sending...' : 'Send reset code'}
        </button>
      </form>

      <p className="auth__note">
        Remember your password? <Link to="/login" className="auth__link">Sign in</Link>
      </p>
    </AuthLayout>
  )
}