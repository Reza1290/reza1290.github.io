import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { X, ExternalLink, Github, Shield, Clock, User, CheckCircle } from 'lucide-react'
import { useDomainSound } from '../../hooks/useSound'
import './Missions.css'

const COSMIC_FALLBACKS = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
]

function getProjectImages(imageUrl, projectId) {
  let list = []
  if (imageUrl) {
    if (Array.isArray(imageUrl)) {
      list = imageUrl
    } else {
      list = imageUrl.split(',').map(s => s.trim()).filter(Boolean)
    }
  }
  const seed = (projectId || '').toString().charCodeAt(0) || 0
  let index = seed
  while (list.length < 3) {
    const nextPhoto = COSMIC_FALLBACKS[index % COSMIC_FALLBACKS.length]
    if (!list.includes(nextPhoto)) {
      list.push(nextPhoto)
    }
    index++
  }
  return list.slice(0, 3)
}

function Image3DPreview({ src, alt }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [12, -12])
  const rotateY = useTransform(x, [-0.5, 0.5], [-12, 12])

  const handleMouseMove = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      className="image-3d-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="image-3d-wrapper"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <img
          src={src}
          alt={alt}
          className="image-3d-img"
          style={{ transform: 'translateZ(30px)' }}
        />
        <div
          className="image-3d-glare"
          style={{
            transform: 'translateZ(10px)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 80%)'
          }}
        />
      </motion.div>
    </div>
  )
}

function MissionModal({ project, onClose }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const { playTick } = useDomainSound()
  const images = getProjectImages(project.image_url, project.id)

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

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
        <button
          className="mission-modal__close"
          onClick={onClose}
          aria-label="Close"
          onMouseEnter={playTick}
        >
          <X size={16} />
        </button>

        {/* Hero with 3D Image Preview */}
        <div className="mission-modal__hero">
          <Image3DPreview src={images[activeImgIndex]} alt={project.title} />
          <div className="mission-modal__hero-overlay" />
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
          {/* Thumbnails grid */}
          <div className="mission-modal__thumbs-container">
            <span className="mission-modal__thumbs-label font-mono">INTEL IMAGES:</span>
            <div className="mission-modal__thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`mission-modal__thumb ${i === activeImgIndex ? 'active' : ''}`}
                  onClick={() => {
                    playTick()
                    setActiveImgIndex(i)
                  }}
                  onMouseEnter={playTick}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

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
              <h3 className="mission-modal__section-title font-mono">EQUIPMENT USED</h3>
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
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-energy"
                onMouseEnter={playTick}
              >
                <ExternalLink size={14} /> LIVE DEMO
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                onMouseEnter={playTick}
              >
                <Github size={14} /> SOURCE CODE
              </a>
            )}
            <button
              className="btn btn-outline"
              onClick={onClose}
              onMouseEnter={playTick}
            >
              ← CLOSE FILE
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MissionCard({ project, index, inView, onClick }) {
  const { playTick } = useDomainSound()
  return (
    <motion.div
      className={`mission-card ${project.featured ? 'mission-card--featured' : ''}`}
      style={{ '--gradient': project.gradient }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => {
        playTick()
        onClick(project)
      }}
      onMouseEnter={playTick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          playTick()
          onClick(project)
        }
      }}
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
