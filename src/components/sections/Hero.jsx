import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Linkedin, Mail, MapPin, ExternalLink } from 'lucide-react'
import VoidCanvas from '../canvas/VoidCanvas'
import ParticleField from '../canvas/ParticleField'
import GlitchText from '../ui/GlitchText'
import './Hero.css'

const STATS = [
  { value: '3.94', label: 'GPA', sub: '/ 4.00' },
  { value: '10+',  label: 'PROJECTS', sub: 'BUILT' },
  { value: '840',  label: 'TOEIC', sub: 'SCORE' },
]

export default function Hero({ profile }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="hero section" id="hero" ref={ref}>
      {/* Canvas layers */}
      <div className="hero__canvas" aria-hidden="true">
        <VoidCanvas intensity={1} />
      </div>
      <ParticleField count={60} />

      <div className="hero__container container">
        {/* Left — Identity */}
        <div className="hero__identity">
          {/* Classification badge */}
          <motion.div
            className="hero__class-badge"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="hero__class-dot" />
            GRADE S — FULLSTACK ENGINEER
          </motion.div>

          {/* Main name */}
          <motion.div
            className="hero__name-wrap"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlitchText tag="h1" className="hero__name font-display" data-text="REZA">
              REZA
            </GlitchText>
          </motion.div>

          {/* Full name + role */}
          <motion.div
            className="hero__meta"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="hero__fullname">{profile?.name || 'Muhamad Reza Muktasib'}</span>
            <span className="hero__divider">//</span>
            <span className="hero__role text-energy">{profile?.tagline || 'Fullstack Engineer'}</span>
          </motion.div>

          {/* Bio */}
          <motion.p
            className="hero__bio"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            {profile?.bio?.slice(0, 200) || 'Building scalable web applications across the space-time of the digital realm.'}
            {profile?.bio?.length > 200 ? '...' : ''}
          </motion.p>

          {/* Stats */}
          <motion.div
            className="hero__stats"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {STATS.map((s, i) => (
              <div key={i} className="hero__stat">
                <span className="hero__stat-value font-display text-energy">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
                <span className="hero__stat-sub">{s.sub}</span>
              </div>
            ))}
          </motion.div>

          {/* Links */}
          <motion.div
            className="hero__links"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            <a href="#missions" className="btn btn-energy">
              VIEW MISSIONS
            </a>
            <a href="#signal" className="btn btn-outline">
              OPEN CHANNEL
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div
            className="hero__socials"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            {profile?.github_url   && <a href={profile.github_url}   target="_blank" rel="noreferrer" className="hero__social-link" title="GitHub"><Github   size={18} /></a>}
            {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="hero__social-link" title="LinkedIn"><Linkedin size={18} /></a>}
            {profile?.email        && <a href={`mailto:${profile.email}`}                             className="hero__social-link" title="Email"><Mail     size={18} /></a>}
            <span className="hero__location"><MapPin size={14} /> {profile?.location || 'Indonesia 🇮🇩'}</span>
          </motion.div>
        </div>

        {/* Right — Avatar / Energy Sphere */}
        <motion.div
          className="hero__avatar-wrap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3, type: 'spring' }}
        >
          <div className="hero__avatar-frame">
            {/* Rotating orbit rings */}
            <div className="hero__orbit hero__orbit--1" aria-hidden="true" />
            <div className="hero__orbit hero__orbit--2" aria-hidden="true" />
            <div className="hero__orbit hero__orbit--3" aria-hidden="true" />

            {/* Avatar image or sphere */}
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="hero__avatar-img"
              />
            ) : (
              <div className="hero__energy-sphere">
                <div className="hero__sphere-inner" />
                <span className="hero__sphere-initial font-display">R</span>
              </div>
            )}
          </div>

          {/* Floating tag */}
          <motion.div
            className="hero__float-tag animate-float"
            style={{ animationDelay: '0.5s' }}
          >
            <span className="hero__float-tag-dot" />
            AVAILABLE FOR WORK
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
      >
        <span className="hero__scroll-line" />
        <span className="hero__scroll-text">SCROLL DOWN</span>
      </motion.div>
    </section>
  )
}
