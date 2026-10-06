import './AuthLayout.css'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth">
      <div className="auth__blob auth__blob--top" />
      <div className="auth__blob auth__blob--bottom" />

      <div className="auth__content">
        <div className="auth__card">
          <img
            src="/images/logo.png"
            alt="Home Interior Staff Commerce"
            className="auth__logo"
          />
          <h1 className="auth__title">{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
        </div>

        <p className="auth__footer">
          <img src="/images/logo.png" alt="" />
          <span>© {new Date().getFullYear()} Home Interior. All rights reserved.</span>
        </p>
      </div>
    </div>
  )
}