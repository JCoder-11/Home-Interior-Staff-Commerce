import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo" onClick={close}>
        <img src="/images/logo.png" alt="Home Interior Staff Commerce" />
      </Link>

      <div className={`navbar__menu ${open ? 'is-open' : ''}`}>
        <nav className="navbar__links">
          <NavLink to="/" end onClick={close}>For Sales Team</NavLink>
          <NavLink to="/how-it-works" onClick={close}>How It Works</NavLink>
          <NavLink to="/admin-tools" onClick={close}>Admin Tools</NavLink>
        </nav>

        <div className="navbar__actions">
          <Link to="/login" className="navbar__login" onClick={close}>Log In</Link>
          <Link to="/signup" className="btn-cta" onClick={close}>
            <span>GET STARTED</span>
            <span className="btn-cta__arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <button
        className="navbar__burger"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span /><span /><span />
      </button>
    </header>
  )
}