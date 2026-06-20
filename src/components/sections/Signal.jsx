import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Github, Linkedin, MapPin, Send } from 'lucide-react'
import { useDomainSound } from '../../hooks/useSound'
import './Signal.css'

const CHANNELS = [
  { icon: Mail,     label: 'EMAIL',    key: 'email',        href: (v) => `mailto:${v}`,    value: (p) => p?.email },
  { icon: Github,   label: 'GITHUB',   key: 'github',       href: (v) => v,                value: (p) => p?.github_url,   display: 'reza1290' },
  { icon: Linkedin, label: 'LINKEDIN', key: 'linkedin',     href: (v) => v,                value: (p) => p?.linkedin_url, display: 'Muhamad Reza Muktasib' },
  { icon: MapPin,   label: 'LOCATION', key: 'location',     href: null,                    value: (p) => p?.location },
]

export default function Signal({ profile }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const { playTick } = useDomainSound()

  return (
    <section className="signal section" id="signal" ref={ref}>
      <div className="glow-orb glow-cyan"   style={{ width: 500, height: 500, bottom: '0', left: '5%' }} aria-hidden="true" />
      <div className="glow-orb glow-energy" style={{ width: 400, height: 400, top: '10%', right: '5%' }} aria-hidden="true" />

      <div className="container">
        <div className="signal__grid">
          {/* Left: Heading */}
          <motion.div
            className="signal__left"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="section-label">FINAL CHAPTER</div>
            <h2 className="section-title">
              OPEN A<br />
              <span className="text-energy">CHANNEL</span>
            </h2>
            <p className="signal__tagline">
              Currently accepting new missions. Reach out and let's build something extraordinary together.
            </p>

            {/* Status */}
            <div className="signal__status">
              <span className="signal__status-dot" />
              <span className="signal__status-text">TRANSMISSION READY</span>
            </div>

            {/* Channel links */}
            <div className="signal__channels">
              {CHANNELS.map(({ icon: Icon, label, key, href, value, display }) => {
                const val = value(profile)
                if (!val) return null
                const target = href?.(val)
                return (
                  <motion.div
                    key={key}
                    className="signal__channel"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: CHANNELS.findIndex(c => c.key === key) * 0.1 + 0.3 }}
                  >
                    <div className="signal__channel-icon">
                      <Icon size={16} />
                    </div>
                    <div className="signal__channel-body">
                      <span className="signal__channel-label">{label}</span>
                      {target ? (
                        <a href={target} target="_blank" rel="noreferrer" className="signal__channel-value" onMouseEnter={playTick} onClick={playTick}>
                          {display || val}
                        </a>
                      ) : (
                        <span className="signal__channel-value signal__channel-value--static">{display || val}</span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right: Terminal form */}
          <motion.div
            className="signal__right"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="signal__terminal">
              {/* Terminal header */}
              <div className="signal__terminal-header">
                <div className="signal__terminal-dots">
                  <span className="signal__terminal-dot signal__terminal-dot--red" />
                  <span className="signal__terminal-dot signal__terminal-dot--yellow" />
                  <span className="signal__terminal-dot signal__terminal-dot--green" />
                </div>
                <span className="signal__terminal-title">TRANSMISSION_CHANNEL.sh</span>
              </div>

              {/* Form */}
              <form
                className="signal__form"
                onSubmit={e => {
                  e.preventDefault()
                  const data = new FormData(e.target)
                  const to   = profile?.email || ''
                  const subj = encodeURIComponent(data.get('subject') || 'New message from portfolio')
                  const body = encodeURIComponent(`From: ${data.get('name')}\n\n${data.get('message')}`)
                  window.location.href = `mailto:${to}?subject=${subj}&body=${body}`
                }}
              >
                <div className="signal__field">
                  <label className="signal__label">
                    <span className="signal__prompt">$</span> NAME
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="signal__input"
                    placeholder="ENTER IDENTIFIER"
                    autoComplete="name"
                    onFocus={playTick}
                  />
                </div>

                <div className="signal__field">
                  <label className="signal__label">
                    <span className="signal__prompt">$</span> SUBJECT
                  </label>
                  <input
                    name="subject"
                    type="text"
                    required
                    className="signal__input"
                    placeholder="MISSION BRIEFING TOPIC"
                    onFocus={playTick}
                  />
                </div>

                <div className="signal__field">
                  <label className="signal__label">
                    <span className="signal__prompt">$</span> MESSAGE
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="signal__input signal__textarea"
                    placeholder="TRANSMIT YOUR MESSAGE..."
                    onFocus={playTick}
                  />
                </div>

                <button type="submit" className="btn btn-energy signal__submit" onMouseEnter={playTick} onClick={playTick}>
                  <Send size={14} />
                  TRANSMIT SIGNAL
                </button>
              </form>

              {/* Terminal blink */}
              <div className="signal__cursor">
                <span className="signal__prompt">$</span>
                <span className="signal__blink" aria-hidden="true">_</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="signal__footer container">
        <div className="signal__footer-line" />
        <div className="signal__footer-inner">
          <span className="signal__copyright">© 2025 MUHAMAD REZA MUKTASIB // ALL RIGHTS RESERVED</span>
          <span className="signal__made-with text-energy">BUILT IN THE VOID ⬡</span>
        </div>
      </div>
    </section>
  )
}
