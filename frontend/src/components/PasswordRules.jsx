import { Check, Circle } from 'lucide-react'
import { passwordRules } from '../utils/passwordRules'

export default function PasswordRules({ password }) {
  return (
    <ul className="pw-rules" aria-live="polite">
      {passwordRules.map((rule) => {
        const met = rule.test(password)
        return (
          <li key={rule.id} className={met ? 'met' : ''}>
            {met ? <Check size={16} /> : <Circle size={16} />}
            {rule.label}
          </li>
        )
      })}
    </ul>
  )
}