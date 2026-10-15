import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Phone, Mail } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import AuthField from '../components/AuthField'
import PasswordField from '../components/PasswordField'
import PasswordRules from '../components/PasswordRules'
import { isPasswordValid } from '../utils/passwordRules'

export default function SignUp() {
  // one object holds every field
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // runs on every keystroke in ANY field
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const phoneDigits = form.phone.replace(/\D/g, '')

    if (form.fullName.trim().length < 2) {
      return setError('Please enter your full name.')
    }
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return setError('Please enter a valid phone number.')
    }
    if (!isPasswordValid(form.password)) {
      return setError('Your password does not meet all the requirements.')
    }
    if (form.password !== form.confirm) {
      return setError('Passwords do not match.')
    }

    setError('')
    setLoading(true)
    // TODO: send fullName, phone, email and password to the backend
    await new Promise((r) => setTimeout(r, 600)) // fake delay for now
    setLoading(false)
    navigate('/login')
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join your sales team and start selling faster today."
    >
      <form onSubmit={handleSubmit} className="auth-form--plain">
        <AuthField
          icon={User}
          id="fullName"
          name="fullName"
          placeholder="Full Name"
          autoComplete="name"
          value={form.fullName}
          onChange={handleChange}
        />
        <AuthField
          icon={Phone}
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="Phone Number"
          autoComplete="tel"
          value={form.phone}
          onChange={handleChange}
        />
        <AuthField
          icon={Mail}
          id="email"
          name="email"
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
        />
        <PasswordField
          id="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
        />
        <PasswordField
          id="confirm"
          name="confirm"
          placeholder="Confirm Password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={handleChange}
        />

        {form.password && <PasswordRules password={form.password} />}

        {error && <p className="auth__error" role="alert">{error}</p>}

        <button type="submit" className="auth__btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="auth__note">
        Already have an account? <Link to="/login" className="auth__link">Sign in</Link>
      </p>
    </AuthLayout>

    
  )
}