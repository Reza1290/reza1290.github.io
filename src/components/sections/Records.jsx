import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, GraduationCap, Star } from 'lucide-react'
import './Records.css'

const TYPE_META = {
  work:      { icon: Briefcase,      color: 'energy', label: 'MISSION'   },
  education: { icon: GraduationCap,  color: 'cyan',   label: 'TRAINING'  },
  milestone: { icon: Star,           color: 'gold',   label: 'MILESTONE' },
}

export default function Records({ journey }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section className="records section" id="records" ref={ref}>
      <div className="glow-orb glow-cyan" style={{ width: 500, height: 500, top: '30%', right: '-5%' }} aria-hidden="true" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">CHAPTER III</div>
          <h2 className="section-title">
            MISSION<br />
            <span className="text-energy">RECORDS</span>
          </h2>
          <p className="records__subtitle">
            A chronological log of operations, training, and milestones.
          </p>
        </motion.div>

        <div className="records__timeline">
          <div className="records__line" aria-hidden="true" />

          {(() => {
            const sortedJourney = [...journey].sort((a, b) => {
              const yearA = a.year || 0
              const yearB = b.year || 0
              if (yearB !== yearA) return yearB - yearA
              // Newer sort_order (higher sequence) first if in fallback, but let's reverse it to match latest-first
              return (a.sort_order || 0) - (b.sort_order || 0)
            })

            return sortedJourney.map((item, i) => {
              const meta  = TYPE_META[item.type] || TYPE_META.milestone
              const Icon  = meta.icon
              const isLeft = i % 2 === 0

            return (
              <motion.div
                key={item.id}
                className={`record-card record-card--${isLeft ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                {/* Timeline dot */}
                <div className={`record-card__dot record-card__dot--${meta.color}`}>
                  <Icon size={12} />
                </div>

                {/* Card */}
                <div className={`record-card__body record-card__body--${meta.color}`}>
                  {/* Header */}
                  <div className="record-card__header">
                    <span className={`badge badge-${meta.color === 'energy' ? 'energy' : meta.color === 'cyan' ? 'cyan' : 'gold'}`}>
                      {meta.label}
                    </span>
                    <span className="record-card__year">
                      MRK-{item.year}-{String(item.sort_order || i + 1).padStart(3, '0')}
                    </span>
                  </div>

                  {/* Period */}
                  <div className={`record-card__period record-card__period--${meta.color}`}>
                    {item.year}
                    {item.end_year
                      ? ` — ${item.end_year}`
                      : item.end_year === null && (item.type === 'work' || item.type === 'education')
                      ? ' — ONGOING'
                      : ''}
                  </div>

                  {/* Title */}
                  <h3 className="record-card__title font-display">{item.title}</h3>

                  {/* Description */}
                  <p className="record-card__desc">{item.description}</p>
                </div>
              </motion.div>
            )
          })})()}
        </div>
      </div>
    </section>
  )
}
