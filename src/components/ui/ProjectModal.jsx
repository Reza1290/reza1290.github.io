import { useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { X, ExternalLink, Github, CheckCircle2, Calendar, User } from 'lucide-react'
import './ProjectModal.css'

function HeroGallery({ project }) {
  // Parse images from DB (could be comma separated string)
  let images = []
  if (project.image_url) {
    if (Array.isArray(project.image_url)) {
      images = project.image_url
    } else if (typeof project.image_url === 'string') {
      images = project.image_url.split(',').map(url => url.trim()).filter(Boolean)
    }
  }

  // Ensure we have exactly 3 items to show (fill with null placeholders if needed)
  const displayImages = [...images, null, null, null].slice(0, 3)

  // 3D Hover setup
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  
  const rotateX = useTransform(y, [0, 1], [15, -15])
  const rotateY = useTransform(x, [0, 1], [-15, 15])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <div 
      className="modal__hero-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className="modal__hero-3d"
        style={{ rotateX, rotateY }}
      >
        {displayImages.map((img, i) => (
          <div key={i} className={`modal__hero-card modal__hero-card--${i}`}>
            {img ? (
              <img src={img} alt={`${project.title} preview ${i + 1}`} className="modal__hero-img" />
            ) : (
              <div className="modal__hero-placeholder" style={{ background: project.gradient || 'var(--clr-surface-2)' }}>
                <span className="modal__hero-title font-display" style={{ fontSize: i > 0 ? '1.5rem' : '' }}>
                  {i === 0 ? project.title : `Preview ${i + 1}`}
                </span>
                {i === 0 && <span className="modal__hero-subtitle">{project.subtitle}</span>}
              </div>
            )}
          </div>
        ))}
      </motion.div>
      {project.featured && (
        <span className="modal__featured-badge">⭐ Featured Project</span>
      )}
    </div>
  )
}

export default function ProjectModal({ project, onClose }) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        id="project-modal-backdrop"
      />

      {/* Panel */}
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ opacity: 0, x: "-50%", y: "-45%", scale: 0.96 }}
        animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
        exit={{ opacity: 0, x: "-50%", y: "-48%", scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        id="project-modal"
      >
        {/* Close */}
        <button
          className="modal__close"
          onClick={onClose}
          aria-label="Close"
          id="project-modal-close"
        >
          <X size={18} />
        </button>

        {/* Hero Gallery */}
        <HeroGallery project={project} />

        {/* Content */}
        <div className="modal__content">
          {/* Meta row */}
          <div className="modal__meta">
            {project.period && (
              <span className="modal__meta-item">
                <Calendar size={13} />
                {project.period}
              </span>
            )}
            {project.role && (
              <span className="modal__meta-item">
                <User size={13} />
                {project.role}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="modal__title font-display">{project.title}</h2>
          {project.subtitle && (
            <p className="modal__subtitle text-violet">{project.subtitle}</p>
          )}

          {/* Long description */}
          <p className="modal__desc">
            {project.long_description || project.description}
          </p>

          {/* Highlights */}
          {project.highlights?.length > 0 && (
            <div className="modal__highlights">
              <h3 className="modal__section-title">Key Highlights</h3>
              <ul className="modal__highlight-list">
                {project.highlights.map((h, i) => (
                  <li key={i} className="modal__highlight-item">
                    <CheckCircle2 size={15} className="modal__highlight-icon" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          {project.tech_stack?.length > 0 && (
            <div className="modal__tech">
              <h3 className="modal__section-title">Tech Stack</h3>
              <div className="modal__tech-list">
                {project.tech_stack.map(tech => (
                  <span key={tech} className="badge badge-violet modal__tech-badge">{tech}</span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="modal__links">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                id={`modal-demo-${project.id}`}
              >
                <ExternalLink size={15} />
                Live Demo
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                id={`modal-repo-${project.id}`}
              >
                <Github size={15} />
                View Code
              </a>
            )}
            <button
              className="btn btn-secondary"
              onClick={onClose}
              id="modal-back-btn"
            >
              ← Back
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
