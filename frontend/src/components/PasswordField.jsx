import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function PasswordField({ id, name, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false)

  return (
    <div className="auth-field">
      <Lock size={22} className="auth-field__icon" />
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        className="auth-field__toggle"
        aria-label={show ? 'Hide password' : 'Show password'}
        onClick={() => setShow(!show)}
      >
        {show ? <Eye size={22} /> : <EyeOff size={22} />}
      </button>
    </div>
  )
}