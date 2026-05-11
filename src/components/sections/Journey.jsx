import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Briefcase, GraduationCap, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import './Journey.css'

const TYPE_META = {
  education: { icon: GraduationCap, color: 'violet', label: 'Education'  },
  work:       { icon: Briefcase,     color: 'amber',  label: 'Work'       },
  milestone:  { icon: Star,          color: 'sage',   label: 'Milestone'  },
}

export default function Journey({ journey }) {
  const [active,    setActive]    = useState(0)
  const [direction, setDirection] = useState(1)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const go = (next) => {
    setDirection(next > active ? 1 : -1)
    setActive(next)
  }

  const prev = () => active > 0 && go(active - 1)
  const next = () => active < journey.length - 1 && go(active + 1)

  const item = journey[active]
  if (!item) return null

  const meta = TYPE_META[item.type] || TYPE_META.milestone
  const Icon = meta.icon

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center:        { opacity: 1, x: 0 },
    exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  }

  return (
    <section className="journey section" id="journey" ref={ref}>
      <div className="glow-orb glow-orb-violet journey__orb" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="journey__header"
        >
          <div className="chapter-label">Chapter 03 — Journey</div>
          <h2 className="section-title">
            My story,{' '}
            <em className="text-gradient font-display">chapter by chapter</em>
          </h2>
          <p className="section-subtitle">
            Each milestone shaped who I am as a developer. Here's the journey so far.
          </p>
        </motion.div>

        {/* Timeline scrubber */}
        <motion.div
          className="journey__scrubber"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {journey.map((j, i) => {
            const m = TYPE_META[j.type] || TYPE_META.milestone
            return (
              <button
                key={j.id}
                className={`journey__dot-btn ${i === active ? 'journey__dot-btn--active' : ''} journey__dot-btn--${m.color}`}
                onClick={() => go(i)}
                title={j.title}
                id={`journey-dot-${i}`}
              >
                <span className="journey__dot-year">{j.year}</span>
                <span className={`journey__dot journey__dot--${m.color}`} />
              </button>
            )
          })}
          {/* Connecting line */}
          <div className="journey__line">
            <motion.div
              className="journey__line-fill"
              initial={{ width: '0%' }}
              animate={inView ? { width: `${(active / (journey.length - 1)) * 100}%` } : {}}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Slide panel */}
        <div className="journey__stage">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={item.id}
              className={`journey__slide journey__slide--${meta.color}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {/* Chapter number */}
              <div className="journey__slide-num">
                {String(active + 1).padStart(2, '0')} / {String(journey.length).padStart(2, '0')}
              </div>

              {/* Type badge */}
              <div className={`journey__type-badge journey__type-badge--${meta.color}`}>
                <Icon size={14} />
                {meta.label}
              </div>

              {/* Year */}
              <div className={`journey__year text-gradient`}>
                {item.year}
                {item.end_year ? ` - ${item.end_year}` : (item.end_year === null && (item.type === 'work' || item.type === 'education') ? ' - Present' : '')}
              </div>

              {/* Title */}
              <h3 className="journey__title font-display">{item.title}</h3>

              {/* Description */}
              <p className="journey__desc">{item.description}</p>

              {/* Decorative icon */}
              <div className={`journey__bg-icon journey__bg-icon--${meta.color}`} aria-hidden="true">
                <Icon size={160} strokeWidth={0.5} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            className={`journey__arrow journey__arrow--prev ${active === 0 ? 'journey__arrow--disabled' : ''}`}
            onClick={prev}
            disabled={active === 0}
            aria-label="Previous chapter"
            id="journey-prev"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`journey__arrow journey__arrow--next ${active === journey.length - 1 ? 'journey__arrow--disabled' : ''}`}
            onClick={next}
            disabled={active === journey.length - 1}
            aria-label="Next chapter"
            id="journey-next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Mini cards strip (overview) */}
        <motion.div
          className="journey__strip"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {journey.map((j, i) => {
            const m = TYPE_META[j.type] || TYPE_META.milestone
            const JIcon = m.icon
            return (
              <button
                key={j.id}
                className={`journey__mini ${i === active ? `journey__mini--active journey__mini--${m.color}` : ''}`}
                onClick={() => go(i)}
                id={`journey-mini-${i}`}
              >
                <JIcon size={14} />
                <span>{j.year}</span>
                <span className="journey__mini-title">{j.title}</span>
              </button>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
