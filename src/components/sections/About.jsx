import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Code2, Coffee, Zap, Heart } from 'lucide-react'
import './About.css'

const TRAITS = [
  { icon: Code2,  label: 'Clean Code',      desc: 'Writing readable, maintainable code is an art form.',  color: 'violet' },
  { icon: Zap,    label: 'Fast Learner',     desc: 'New tech? Challenge accepted. I ramp up quickly.',      color: 'amber'  },
  { icon: Coffee, label: 'Detail-Oriented',  desc: 'The difference is in the details. Pixel-perfect matters.', color: 'sage' },
  { icon: Heart,  label: 'Passion-Driven',   desc: 'I love what I build. That energy shows in the result.', color: 'rose' },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' }
  }),
}

function TraitCard({ icon: Icon, label, desc, color, index }) {
  return (
    <motion.div
      className={`trait-card trait-card--${color}`}
      variants={fadeUp}
      custom={index}
      id={`trait-card-${label.toLowerCase().replace(/\s+/, '-')}`}
    >
      <div className={`trait-card__icon trait-card__icon--${color}`}>
        <Icon size={22} />
      </div>
      <h3 className="trait-card__label">{label}</h3>
      <p className="trait-card__desc">{desc}</p>
    </motion.div>
  )
}

export default function About({ profile }) {
  const ref  = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="about section" id="about" ref={ref}>
      {/* Decorative orbs */}
      <div className="glow-orb glow-orb-violet about__orb-1" aria-hidden="true" />

      <div className="container">
        <div className="about__inner">
          {/* Left: Photo + decorative frame */}
          <motion.div
            className="about__photo-col"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="about__photo-frame">
              <div className="about__photo">
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt={profile.name} className="about__photo-img" />
                  : <div className="about__photo-placeholder">
                      <span className="about__photo-initial">
                        {(profile?.name || 'R').charAt(0)}
                      </span>
                      <div className="about__photo-grid" aria-hidden="true">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="about__photo-dot" />
                        ))}
                      </div>
                    </div>
                }
              </div>
              {/* Floating badge */}
              <div className="about__badge">
                <span className="about__badge-dot" />
                Available for work
              </div>
              {/* Decorative frame lines */}
              <div className="about__frame-border about__frame-border--tl" aria-hidden="true" />
              <div className="about__frame-border about__frame-border--br" aria-hidden="true" />
            </div>

            {/* Stats */}
            <div className="about__stats">
              {[
                { value: '3.94', label: 'GPA / 4.00'   },
                { value: '10+',  label: 'Projects Built' },
                { value: '840',  label: 'TOEIC Score'  },
              ].map(({ value, label }) => (
                <div key={label} className="about__stat">
                  <span className="about__stat-value text-gradient">{value}</span>
                  <span className="about__stat-label">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Text content */}
          <motion.div
            className="about__text-col"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          >
            <div className="chapter-label">
              Chapter 01 — About Me
            </div>

            <h2 className="section-title about__title">
              A developer who{' '}
              <em className="about__em font-display">tells stories</em>{' '}
              through code
            </h2>

            <div className="about__bio">
              <p>
                {profile?.bio ||
                  "I'm a passionate full-stack developer who loves turning complex problems into elegant, user-friendly solutions. From crafting pixel-perfect UIs to architecting scalable backends — every line of code tells a story."}
              </p>
              <p>
                When I'm not coding, I'm exploring new technologies, contributing to open-source projects, or learning from the developer community. I believe great software is built at the intersection of technical excellence and human empathy.
              </p>
            </div>

            {/* Trait cards */}
            <motion.div
              className="about__traits"
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {TRAITS.map((trait, i) => (
                <TraitCard key={trait.label} {...trait} index={i} />
              ))}
            </motion.div>

            <div className="about__actions">
              <a href="#projects" className="btn btn-primary" id="about-cta-projects">
                See My Projects
              </a>
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  id="about-cta-github"
                >
                  GitHub Profile
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
