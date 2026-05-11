import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Github, Linkedin, Send, MapPin, BookOpen } from 'lucide-react'
import './Contact.css'

export default function Contact({ profile }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'sent' | 'error'

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    // Mailto fallback (no server needed)
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.open(`mailto:${profile?.email || 'reza1290@example.com'}?subject=${subject}&body=${body}`)
    setStatus('sent')
  }

  return (
    <section className="contact section" id="contact" ref={ref}>
      <div className="glow-orb glow-orb-violet contact__orb-1" aria-hidden="true" />
      <div className="glow-orb glow-orb-amber  contact__orb-2" aria-hidden="true" />

      <div className="container">
        <div className="contact__inner">
          {/* Left: Info */}
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="chapter-label">Chapter 05 — Contact</div>

            <h2 className="section-title">
              Let's write the{' '}
              <em className="text-gradient font-display">next chapter</em>{' '}
              together
            </h2>

            <p className="contact__subtitle">
              Have a project idea? Want to collaborate? Or just want to say hi? 
              I'd love to hear from you. 📬
            </p>

            {/* Contact links */}
            <div className="contact__links">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="contact__link" id="contact-email-link">
                  <div className="contact__link-icon contact__link-icon--violet">
                    <Mail size={18} />
                  </div>
                  <div className="contact__link-text">
                    <span className="contact__link-label">Email</span>
                    <span className="contact__link-value">{profile.email}</span>
                  </div>
                </a>
              )}

              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                   className="contact__link" id="contact-github-link">
                  <div className="contact__link-icon contact__link-icon--amber">
                    <Github size={18} />
                  </div>
                  <div className="contact__link-text">
                    <span className="contact__link-label">GitHub</span>
                    <span className="contact__link-value">reza1290</span>
                  </div>
                </a>
              )}

              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                   className="contact__link" id="contact-linkedin-link">
                  <div className="contact__link-icon contact__link-icon--sage">
                    <Linkedin size={18} />
                  </div>
                  <div className="contact__link-text">
                    <span className="contact__link-label">LinkedIn</span>
                    <span className="contact__link-value">Muhamad Reza Muktasib</span>
                  </div>
                </a>
              )}

              <div className="contact__link">
                <div className="contact__link-icon contact__link-icon--rose">
                  <MapPin size={18} />
                </div>
                <div className="contact__link-text">
                  <span className="contact__link-label">Location</span>
                  <span className="contact__link-value">Indonesia 🇮🇩</span>
                </div>
              </div>
            </div>

            {/* Book decoration */}
            <div className="contact__book" aria-hidden="true">
              <BookOpen size={120} strokeWidth={0.4} />
              <p className="contact__book-quote font-display">
                "Every great developer you know got there by solving problems they were unqualified to solve."
              </p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="contact__form-wrap"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <form className="contact__form" onSubmit={handleSubmit} id="contact-form">
              <div className="contact__form-header">
                <h3 className="contact__form-title">Send a message</h3>
                <p className="contact__form-desc text-muted">I'll reply within 24 hours.</p>
              </div>

              <div className="contact__field">
                <label htmlFor="contact-name" className="contact__label">Your Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className="contact__input"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-email" className="contact__label">Email Address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="contact__input"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-message" className="contact__label">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="contact__textarea"
                  placeholder="Hey Reza, I'd love to work on..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary contact__submit ${status === 'sending' ? 'contact__submit--loading' : ''}`}
                disabled={status === 'sending'}
                id="contact-submit"
              >
                {status === 'sent'
                  ? '✅ Message sent!'
                  : status === 'sending'
                  ? 'Opening mail...'
                  : <><Send size={16} /> Send Message</>
                }
              </button>

              {status === 'sent' && (
                <p className="contact__success">
                  Your email client should have opened! If not, email me directly at{' '}
                  <a href={`mailto:${profile?.email}`}>{profile?.email}</a>.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="contact__footer">
        <div className="container">
          <div className="contact__footer-inner">
            <span className="contact__footer-logo font-display">
              reza<span style={{ color: 'var(--clr-amber)' }}>.</span>
            </span>
            <span className="text-muted">
              Built with React + Supabase · {new Date().getFullYear()}
            </span>
            <span className="text-muted">Made with ❤️ in Indonesia</span>
          </div>
        </div>
      </div>
    </section>
  )
}
