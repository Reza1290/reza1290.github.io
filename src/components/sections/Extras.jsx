import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Trophy, BadgeCheck } from 'lucide-react'
import './Extras.css'

const ISSUER_COLORS = {
  'Udemy':    'violet',
  'BNSP':     'amber',
  'Dicoding': 'sage',
  'default':  'violet',
}

export default function Extras({ awards = [], certifications = [] }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="extras section-sm" id="extras" ref={ref}>
      <div className="glow-orb glow-orb-amber extras__orb" aria-hidden="true" />

      <div className="container">
        <div className="extras__grid">
          {/* Awards */}
          <motion.div
            className="extras__col"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="chapter-label">
              <Trophy size={14} />
              Awards & Achievements
            </div>
            <h2 className="extras__title font-display">
              Recognition
            </h2>
            <div className="extras__list">
              {awards.map((award, i) => (
                <motion.div
                  key={award.id}
                  className="award-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08 }}
                  id={`award-${award.id}`}
                >
                  <span className="award-card__icon">{award.icon}</span>
                  <div className="award-card__text">
                    <span className="award-card__title">{award.title}</span>
                    <span className="award-card__org">{award.org} · {award.year}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            className="extras__col"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="chapter-label">
              <BadgeCheck size={14} />
              Certifications
            </div>
            <h2 className="extras__title font-display">
              Credentials
            </h2>
            <div className="extras__list">
              {certifications.map((cert, i) => {
                const color = ISSUER_COLORS[cert.issuer] || ISSUER_COLORS.default
                return (
                  <motion.div
                    key={cert.id}
                    className="cert-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.07 }}
                    id={`cert-${cert.id}`}
                  >
                    <div className={`cert-card__dot cert-card__dot--${color}`} />
                    <div className="cert-card__text">
                      <span className="cert-card__name">{cert.name}</span>
                      <div className="cert-card__meta">
                        <span className={`badge badge-${color}`}>{cert.issuer}</span>
                        <span className="cert-card__year">{cert.year}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
