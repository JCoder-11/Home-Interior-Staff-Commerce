export default function AuthField({ icon: Icon, id, name, type = 'text', ...props }) {
  return (
    <div className="auth-field">
      <Icon size={22} className="auth-field__icon" />
      <input
        id={id}
        name={name}
        type={type}
        aria-label={props.placeholder}
        required
        {...props}
      />
    </div>
  )
}