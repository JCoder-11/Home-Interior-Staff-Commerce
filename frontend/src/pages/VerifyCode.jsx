import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

const LENGTH = 6
const EXPIRY_SECONDS = 10 * 60

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function VerifyCode() {
  const [digits, setDigits] = useState(Array(LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS)
  const inputs = useRef([])
  const navigate = useNavigate()
  const { state } = useLocation()
  const email = state?.email

  const focusAt = (i) => inputs.current[i]?.focus()

  // focus the first box when the page opens
  useEffect(() => { focusAt(0) }, [])

  // countdown timer
  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])

  // put several digits into the boxes, starting at box `start`
  const fillFrom = (start, chars) => {
    const list = chars.slice(0, LENGTH)
    const from = list.length >= LENGTH ? 0 : start // a full code always starts at box 1
    const next = [...digits]
    list.forEach((c, k) => {
      if (from + k < LENGTH) next[from + k] = c
    })
    setDigits(next)
    focusAt(Math.min(from + list.length, LENGTH - 1))
  }

  const handleChange = (e, i) => {
    const chars = e.target.value.replace(/\D/g, '').split('')
    if (chars.length === 0) {
      const next = [...digits]
      next[i] = ''
      setDigits(next)
      return
    }
    fillFrom(i, chars) // handles 1 typed digit AND an autofilled full code
  }

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      const next = [...digits]
      next[i - 1] = ''
      setDigits(next)
      focusAt(i - 1)
    }
    if (e.key === 'ArrowLeft' && i > 0) focusAt(i - 1)
    if (e.key === 'ArrowRight' && i < LENGTH - 1) focusAt(i + 1)
  }

  const handlePaste = (e, i) => {
    e.preventDefault()
    const chars = e.clipboardData.getData('text').replace(/\D/g, '').split('')
    if (chars.length) fillFrom(i, chars)
  }

  const code = digits.join('')
  const complete = code.length === LENGTH
  const expired = secondsLeft === 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!complete || expired) return
    // TODO: send `email` and `code` to the backend to check them
    navigate('/reset-password', { state: { email, code } })
  }

  const handleResend = () => {
    // TODO: ask the backend to send a new code
    setDigits(Array(LENGTH).fill(''))
    setSecondsLeft(EXPIRY_SECONDS)
    focusAt(0)
  }

  return (
    <AuthLayout
      title="Check your email"
      subtitle={
        <>
          We sent a 6-digit code to {email ? <strong>{email}</strong> : 'your email'}.
          Enter it below to reset your password.
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="otp">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              className={d ? 'filled' : ''}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label={`Digit ${i + 1} of ${LENGTH}`}
              placeholder="0"
              value={d}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        <p className="auth__note" style={{ margin: '0 0 18px' }}>
          Didn't receive the code?{' '}
          <button type="button" className="auth__link" onClick={handleResend}>
            Resend
          </button>
        </p>

        <button type="submit" className="auth__btn" disabled={!complete || expired}>
          Verify code
        </button>
      </form>

      <p className="auth__timer">
        {expired ? (
          'Code expired. Please resend a new one.'
        ) : (
          <>Code expires in <strong>{formatTime(secondsLeft)}</strong></>
        )}
      </p>
    </AuthLayout>
  )
}