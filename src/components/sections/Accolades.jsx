import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Accolades.css'

export default function Accolades({ awards = [], certifications = [] }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section className="accolades section" id="accolades" ref={ref}>
      <div className="glow-orb glow-energy" style={{ width: 600, height: 600, top: '20%', right: '-10%' }} aria-hidden="true" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">CHAPTER V</div>
          <h2 className="section-title">
            REALM<br />
            <span className="text-energy">TROPHIES</span>
          </h2>
          <p className="accolades__subtitle">Honors earned across competitions, training, and the field.</p>
        </motion.div>

        <div className="accolades__layout">
          {/* Awards */}
          <div className="accolades__awards">
            <h3 className="accolades__group-title">⚔️ BATTLE HONORS</h3>
            <div className="awards__grid">
              {awards.map((award, i) => (
                <motion.div
                  key={award.id}
                  className="award-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <div className="award-card__trophy">{award.icon || '🏆'}</div>
                  <div className="award-card__body">
                    <h4 className="award-card__title">{award.title}</h4>
                    <p className="award-card__org">{award.org}</p>
                    <span className="award-card__year badge badge-gold">{award.year}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="accolades__certs">
            <h3 className="accolades__group-title">📜 SKILL SEALS</h3>
            <div className="certs__list">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  className="cert-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <div className="cert-card__line" />
                  <div className="cert-card__body">
                    <span className="cert-card__name">{cert.name}</span>
                    <div className="cert-card__meta">
                      <span className={`badge badge-${cert.issuer === 'Udemy' ? 'energy' : cert.issuer === 'BNSP' ? 'blood' : 'cyan'}`}>
                        {cert.issuer}
                      </span>
                      <span className="cert-card__year">{cert.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
