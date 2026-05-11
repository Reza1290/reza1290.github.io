import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github, Star, Layers, ArrowRight } from 'lucide-react'
import ProjectModal from '../ui/ProjectModal'
import './Projects.css'

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #1a0a3d, #4a1fa8)',
  'linear-gradient(135deg, #0a2a1a, #1a7a4a)',
  'linear-gradient(135deg, #1a1500, #7a5a00)',
  'linear-gradient(135deg, #1a0d2a, #6a1a9a)',
  'linear-gradient(135deg, #001a2a, #006699)',
  'linear-gradient(135deg, #1a0a0a, #7a2020)',
]

function ProjectCard({ project, index, inView, onOpen }) {
  const gradient = project.gradient || PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length]

  return (
    <motion.article
      className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      id={`project-card-${project.id}`}
    >
      {/* Image / Placeholder — clickable */}
      <button
        className="project-card__image-btn"
        onClick={() => onOpen(project)}
        aria-label={`View ${project.title} details`}
      >
        <div className="project-card__image">
          {project.image_url
            ? <img src={project.image_url} alt={project.title} className="project-card__img" />
            : <div className="project-card__placeholder" style={{ background: gradient }}>
                <Layers size={40} strokeWidth={1} className="project-card__placeholder-icon" />
                <span className="project-card__placeholder-label">{project.title}</span>
              </div>
          }
          {/* Hover overlay */}
          <div className="project-card__overlay">
            <span className="project-card__overlay-text">
              <ArrowRight size={18} /> View Details
            </span>
          </div>
        </div>
        {project.featured && (
          <div className="project-card__featured-badge">
            <Star size={12} fill="currentColor" />
            Featured
          </div>
        )}
      </button>

      {/* Content */}
      <div className="project-card__body">
        {project.period && (
          <span className="project-card__period">{project.period}</span>
        )}
        <h3 className="project-card__title">{project.title}</h3>
        {project.subtitle && (
          <p className="project-card__subtitle text-violet">{project.subtitle}</p>
        )}
        <p className="project-card__desc">{project.description}</p>

        {/* Tech Stack */}
        {project.tech_stack?.length > 0 && (
          <div className="project-card__stack">
            {project.tech_stack.slice(0, 4).map(tech => (
              <span key={tech} className="badge badge-violet project-card__tech">
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="badge badge-violet project-card__tech">
                +{project.tech_stack.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="project-card__links">
          <button
            className="btn btn-primary project-card__link project-card__details-btn"
            onClick={() => onOpen(project)}
            id={`project-details-${project.id}`}
          >
            <ArrowRight size={14} />
            Details
          </button>
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary project-card__link"
              id={`project-demo-${project.id}`}
            >
              <ExternalLink size={14} />
              Live
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary project-card__link"
              id={`project-repo-${project.id}`}
            >
              <Github size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects({ projects }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [selectedProject, setSelectedProject] = useState(null)

  const featured = projects.filter(p => p.featured)
  const rest      = projects.filter(p => !p.featured)

  return (
    <section className="projects section" id="projects" ref={ref}>
      <div className="glow-orb glow-orb-sage projects__orb" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="chapter-label">Chapter 04 — Projects</div>
          <h2 className="section-title">
            Things I've{' '}
            <em className="text-gradient font-display">built</em>
          </h2>
          <p className="section-subtitle">
            From open-source proctoring tools to AI-powered apps — here's what I've shipped.
          </p>
        </motion.div>

        {/* Featured grid */}
        {featured.length > 0 && (
          <div className="projects__featured">
            {featured.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                inView={inView}
                onOpen={setSelectedProject}
              />
            ))}
          </div>
        )}

        {/* Other projects */}
        {rest.length > 0 && (
          <>
            <motion.h3
              className="projects__more-label"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              More work
            </motion.h3>
            <div className="projects__grid">
              {rest.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={featured.length + i}
                  inView={inView}
                  onOpen={setSelectedProject}
                />
              ))}
            </div>
          </>
        )}

        {/* GitHub CTA */}
        <motion.div
          className="projects__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
        >
          <p className="projects__cta-text">Want to see more?</p>
          <a
            href="https://github.com/reza1290"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            id="projects-github-cta"
          >
            <Github size={16} />
            View GitHub Profile
          </a>
        </motion.div>
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
