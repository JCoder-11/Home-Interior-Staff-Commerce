import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import PasswordField from '../components/PasswordField'
import PasswordRules from '../components/PasswordRules'
import { isPasswordValid } from '../utils/passwordRules'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isPasswordValid(password)) {
      return setError('Your password does not meet all the requirements.')
    }
    if (password !== confirm) {
      return setError('Passwords do not match.')
    }
    setError('')
    // TODO: send the new password (and the code) to the backend
    navigate('/login')
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Create a strong new password for your account."
    >
      <form onSubmit={handleSubmit}>
        <PasswordField
          id="new-password"
          placeholder="New Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordField
          id="confirm-password"
          placeholder="Confirm New Password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <PasswordRules password={password} />

        {error && <p className="auth__error" role="alert">{error}</p>}

        <button type="submit" className="auth__btn">Reset password</button>
      </form>
    </AuthLayout>
  )
}