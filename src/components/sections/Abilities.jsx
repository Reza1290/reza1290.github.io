import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Abilities.css'

const CATEGORY_META = {
  language:  { label: 'LANGUAGE ARTS',      code: 'LNG', color: 'energy' },
  framework: { label: 'FRAMEWORK SORCERY',  code: 'FRM', color: 'cyan'   },
  tool:      { label: 'INFRA DOMAIN',        code: 'INF', color: 'blood'  },
}

const TECH_ICONS = {
  'JavaScript':'🟨','TypeScript':'🔷','PHP':'🐘','Python':'🐍','Go (Golang)':'🟦',
  'Java':'☕','C (STM32)':'🧠','React':'⚛️','Next.js':'▲','Laravel':'🔴',
  'Node.js':'🟩','Flutter':'🏄','Remix':'🌀','GraphQL':'🟣','Docker':'🐳',
  'AWS':'☁️','GCP':'🌐','PostgreSQL':'🐘','MongoDB':'🍃','Firebase':'🔥',
  'CI/CD':'🔀','WebRTC':'📡','MariaDB':'🗄️','Nginx':'⚡',
}

function AbilityCard({ skill, color, index, inView }) {
  return (
    <motion.div
      className={`ability-card ability-card--${color}`}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.05 * index }}
    >
      <div className="ability-card__header">
        <span className="ability-card__icon">{TECH_ICONS[skill.name] || '⚡'}</span>
        <span className="ability-card__name">{skill.name}</span>
        <span className={`ability-card__pct ability-card__pct--${color}`}>{skill.proficiency}%</span>
      </div>
      <div className="ability-card__track">
        <motion.div
          className={`ability-card__fill ability-card__fill--${color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.05 * index + 0.2, ease: 'easeOut' }}
        />
        <div className="ability-card__track-dots" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="ability-card__track-dot" />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Abilities({ skills }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const grouped = Object.entries(CATEGORY_META).map(([cat, meta]) => ({
    cat, ...meta,
    items: skills.filter(s => s.category === cat),
  })).filter(g => g.items.length > 0)

  return (
    <section className="abilities section" id="abilities" ref={ref}>
      <div className="glow-orb glow-energy" style={{ width: 600, height: 600, top: '20%', left: '-10%' }} aria-hidden="true" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">CHAPTER II</div>
          <h2 className="section-title">
            VOID<br />
            <span className="text-energy">TECHNIQUES</span>
          </h2>
          <p className="abilities__subtitle">
            Mastered abilities across the three great disciplines of the digital realm.
          </p>
        </motion.div>

        <div className="abilities__grid">
          {grouped.map(({ cat, label, code, color, items }) => (
            <motion.div
              key={cat}
              className={`abilities__group abilities__group--${color}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Group header */}
              <div className="abilities__group-header">
                <div className="abilities__group-code">{code}</div>
                <div>
                  <h3 className={`abilities__group-title abilities__group-title--${color}`}>{label}</h3>
                  <span className="abilities__group-count">{items.length} TECHNIQUES</span>
                </div>
              </div>

              {/* Skill bars */}
              <div className="abilities__list">
                {items.map((skill, i) => (
                  <AbilityCard key={skill.id} skill={skill} color={color} index={i} inView={inView} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
