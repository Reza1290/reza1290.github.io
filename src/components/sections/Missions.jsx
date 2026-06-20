import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, Shield, Clock, User, CheckCircle } from 'lucide-react'
import './Missions.css'

function MissionModal({ project, onClose }) {
  // Escape key
  useState(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  return (
    <motion.div
      className="mission-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="mission-modal"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label={project.title}
      >
        {/* Close */}
        <button className="mission-modal__close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        {/* Hero */}
        <div
          className="mission-modal__hero"
          style={{ background: project.gradient || 'linear-gradient(135deg, #1a0a3d, #4a1fa8)' }}
        >
          <div className="mission-modal__hero-overlay" />
          {project.image_url ? (
            <img
              src={Array.isArray(project.image_url)
                ? project.image_url[0]
                : project.image_url.split(',')[0].trim()}
              alt={project.title}
              className="mission-modal__hero-img"
            />
          ) : null}
          <div className="mission-modal__hero-content">
            {project.featured && (
              <span className="badge badge-gold mission-modal__featured">⭐ PRIORITY MISSION</span>
            )}
            <h2 className="mission-modal__title font-display">{project.title}</h2>
            <p className="mission-modal__subtitle">{project.subtitle}</p>
          </div>
        </div>

        {/* Body */}
        <div className="mission-modal__body">
          {/* Meta */}
          <div className="mission-modal__meta">
            {project.period && (
              <span className="mission-modal__meta-item">
                <Clock size={12} /> {project.period}
              </span>
            )}
            {project.role && (
              <span className="mission-modal__meta-item">
                <User size={12} /> {project.role}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mission-modal__desc">
            {project.long_description || project.description}
          </p>

          {/* Highlights */}
          {project.highlights?.length > 0 && (
            <div className="mission-modal__highlights">
              <h3 className="mission-modal__section-title">
                <Shield size={14} /> MISSION INTEL
              </h3>
              <ul className="mission-modal__highlight-list">
                {project.highlights.map((h, i) => (
                  <li key={i} className="mission-modal__highlight-item">
                    <CheckCircle size={13} className="mission-modal__check" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          {project.tech_stack?.length > 0 && (
            <div className="mission-modal__tech">
              <h3 className="mission-modal__section-title">EQUIPMENT USED</h3>
              <div className="mission-modal__tech-list">
                {project.tech_stack.map(t => (
                  <span key={t} className="badge badge-energy">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mission-modal__actions">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noreferrer" className="btn btn-energy">
                <ExternalLink size={14} /> LIVE DEMO
              </a>
            )}
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noreferrer" className="btn btn-outline">
                <Github size={14} /> SOURCE CODE
              </a>
            )}
            <button className="btn btn-outline" onClick={onClose}>← CLOSE FILE</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MissionCard({ project, index, inView, onClick }) {
  return (
    <motion.div
      className={`mission-card ${project.featured ? 'mission-card--featured' : ''}`}
      style={{ '--gradient': project.gradient }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onClick(project)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(project)}
    >
      {/* Top accent */}
      <div className="mission-card__accent" />

      {/* Image or gradient preview */}
      <div className="mission-card__preview" style={{ background: project.gradient || 'var(--surface)' }}>
        {project.image_url ? (
          <img
            src={Array.isArray(project.image_url)
              ? project.image_url[0]
              : project.image_url.split(',')[0].trim()}
            alt={project.title}
            className="mission-card__img"
          />
        ) : (
          <span className="mission-card__initial font-display">
            {project.title[0]}
          </span>
        )}
        {project.featured && <span className="mission-card__badge badge badge-gold">⭐ PRIORITY</span>}
        <div className="mission-card__overlay">
          <span className="mission-card__open">OPEN FILE →</span>
        </div>
      </div>

      {/* Body */}
      <div className="mission-card__body">
        <div className="mission-card__period">{project.period || '—'}</div>
        <h3 className="mission-card__title font-display">{project.title}</h3>
        <p className="mission-card__sub">{project.subtitle}</p>
        <p className="mission-card__desc">{project.description}</p>

        <div className="mission-card__tech">
          {(project.tech_stack || []).slice(0, 4).map(t => (
            <span key={t} className="badge badge-energy">{t}</span>
          ))}
          {project.tech_stack?.length > 4 && (
            <span className="badge badge-energy">+{project.tech_stack.length - 4}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Missions({ projects }) {
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: true, amount: 0.05 })
  const [active, setActive] = useState(null)

  return (
    <section className="missions section" id="missions" ref={ref}>
      <div className="glow-orb glow-blood" style={{ width: 500, height: 500, bottom: '10%', left: '5%' }} aria-hidden="true" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">CHAPTER IV</div>
          <h2 className="section-title">
            CLASSIFIED<br />
            <span className="text-energy">OPERATIONS</span>
          </h2>
          <p className="missions__subtitle">
            Click any dossier to open the full mission briefing.
          </p>
        </motion.div>

        <div className="missions__grid">
          {projects.map((p, i) => (
            <MissionCard key={p.id} project={p} index={i} inView={inView} onClick={setActive} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && <MissionModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  )
}
