import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, BookOpen } from 'lucide-react'
import './Navbar.css'

const NAV_LINKS = [
  { href: '#about',   label: 'About',   chapter: '01' },
  { href: '#skills',  label: 'Skills',  chapter: '02' },
  { href: '#journey', label: 'Journey', chapter: '03' },
  { href: '#projects',label: 'Projects',chapter: '04' },
  { href: '#contact', label: 'Contact', chapter: '05' },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [activeLink,  setActiveLink]  = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      // Determine active section
      const sections = NAV_LINKS.map(l => l.href.slice(1))
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActiveLink(`#${id}`)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="navbar__inner container">
          {/* Logo */}
          <a href="#" className="navbar__logo" onClick={closeMenu}>
            <BookOpen size={20} className="navbar__logo-icon" />
            <span className="navbar__logo-text">
              <span className="text-gradient">reza</span>
              <span className="navbar__logo-dot">.</span>
            </span>
          </a>

          {/* Desktop Links */}
          <ul className="navbar__links">
            {NAV_LINKS.map(({ href, label, chapter }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`navbar__link ${activeLink === href ? 'navbar__link--active' : ''}`}
                >
                  <span className="navbar__link-chapter">{chapter}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#contact"
            className="btn btn-primary navbar__cta"
            id="navbar-contact-cta"
          >
            Let's Talk
          </a>

          {/* Mobile Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            id="navbar-hamburger"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="mobile-menu__header">
              <a href="#" className="navbar__logo" onClick={closeMenu}>
                <BookOpen size={20} className="navbar__logo-icon" />
                <span className="navbar__logo-text">
                  <span className="text-gradient">reza</span>
                  <span className="navbar__logo-dot">.</span>
                </span>
              </a>
              <button
                className="navbar__hamburger"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <ul className="mobile-menu__links">
              {NAV_LINKS.map(({ href, label, chapter }, i) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <a
                    href={href}
                    className="mobile-menu__link"
                    onClick={closeMenu}
                  >
                    <span className="mobile-menu__chapter">{chapter}</span>
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <a
              href="#contact"
              className="btn btn-primary mobile-menu__cta"
              onClick={closeMenu}
            >
              Let's Talk
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>
    </>
  )
}
