import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Navbar.css'

const NAV_LINKS = [
  { id: 'hero',      label: 'HOME'     },
  { id: 'abilities', label: 'ABILITIES'},
  { id: 'records',   label: 'RECORDS'  },
  { id: 'missions',  label: 'MISSIONS' },
  { id: 'accolades', label: 'TROPHIES' },
  { id: 'signal',    label: 'CONTACT'  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const scroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }

  return (
    <header className="navbar" role="banner">
      {/* Logo */}
      <div className="navbar__logo font-display" onClick={() => scroll('hero')} role="link" tabIndex={0}>
        RZM<span className="navbar__logo-dot">⬡</span>
      </div>

      {/* Desktop nav */}
      <nav className="navbar__links" aria-label="Main navigation">
        {NAV_LINKS.map(l => (
          <button
            key={l.id}
            className="navbar__link"
            onClick={() => scroll(l.id)}
          >
            {l.label}
          </button>
        ))}
        <a
          href="mailto:reza.muktasib@gmail.com"
          className="navbar__cta btn btn-energy"
        >
          OPEN CHANNEL
        </a>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="navbar__hamburger"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span className={`navbar__hamburger-line ${open ? 'is-open-1' : ''}`} />
        <span className={`navbar__hamburger-line ${open ? 'is-open-2' : ''}`} />
        <span className={`navbar__hamburger-line ${open ? 'is-open-3' : ''}`} />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="navbar__drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_LINKS.map(l => (
              <button key={l.id} className="navbar__drawer-link" onClick={() => scroll(l.id)}>
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
