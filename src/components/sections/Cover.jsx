import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ChevronDown, Sparkles } from 'lucide-react'
import './Cover.css'

const TYPEWRITER_WORDS = [
  'Full Stack Developer',
  'API Architect',
  'UI Craftsman',
  'Open Source Enthusiast',
  'Problem Solver',
]

function useTypewriter(words, speed = 80, pause = 2200) {
  const [displayed, setDisplayed] = useState('')
  const [wordIdx,   setWordIdx]   = useState(0)
  const [charIdx,   setCharIdx]   = useState(0)
  const [deleting,  setDeleting]  = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    let timeout

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(i => i + 1), speed)
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(i => i - 1), speed / 2)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setWordIdx(i => (i + 1) % words.length)
    }

    setDisplayed(current.slice(0, charIdx))
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return displayed
}

// Animated star particles
function Stars({ count = 60 }) {
  const stars = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }))
  )

  return (
    <div className="stars" aria-hidden="true">
      {stars.current.map(s => (
        <span
          key={s.id}
          className="star"
          style={{
            left:             `${s.x}%`,
            top:              `${s.y}%`,
            width:            `${s.size}px`,
            height:           `${s.size}px`,
            animationDelay:   `${s.delay}s`,
            animationDuration:`${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function Cover({ profile }) {
  const typeText = useTypewriter(TYPEWRITER_WORDS)

  return (
    <section className="cover section noise" id="cover">
      <Stars />

      {/* Decorative orbs */}
      <div className="glow-orb glow-orb-violet cover__orb-1" aria-hidden="true" />
      <div className="glow-orb glow-orb-amber cover__orb-2"  aria-hidden="true" />
      <div className="glow-orb glow-orb-sage  cover__orb-3"  aria-hidden="true" />

      <div className="container cover__content">
        {/* Chapter Label */}
        <motion.div
          className="chapter-label cover__chapter"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles size={14} />
          Chapter 00 — Introduction
        </motion.div>

        {/* Avatar */}
        <motion.div
          className="cover__avatar-wrap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <div className="cover__avatar anim-pulse-glow">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={profile.name} className="cover__avatar-img" />
              : <span className="cover__avatar-initials">
                  {(profile?.name || 'R').charAt(0).toUpperCase()}
                </span>
            }
          </div>
          <div className="cover__avatar-ring" aria-hidden="true" />
        </motion.div>

        {/* Greeting */}
        <motion.p
          className="cover__greeting"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          👋 Hello, I'm
        </motion.p>

        {/* Name */}
        <motion.h1
          className="cover__name font-display"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          {profile?.short_name || 'Reza'}
          <span className="cover__name-dot text-amber">.</span>
        </motion.h1>

        {/* Full name subtitle */}
        <motion.p
          className="cover__fullname text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          {profile?.name || 'Muhamad Reza Muktasib'}
        </motion.p>

        {/* Typewriter */}
        <motion.div
          className="cover__typewriter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="cover__type-text text-gradient">{typeText}</span>
          <span className="cover__cursor" aria-hidden="true" />
        </motion.div>

        {/* Bio */}
        <motion.p
          className="cover__bio"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {profile?.bio?.split(' ').slice(0, 24).join(' ') + '…' ||
           'Crafting digital experiences one chapter at a time. From scalable APIs to pixel-perfect interfaces.'}
        </motion.p>

        {/* Social Links */}
        <motion.div
          className="cover__socials"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
               className="cover__social-btn" id="cover-github-link" aria-label="GitHub">
              <Github size={18} />
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
               className="cover__social-btn" id="cover-linkedin-link" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`}
               className="cover__social-btn" id="cover-email-link" aria-label="Email">
              <Mail size={18} />
            </a>
          )}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="cover__ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <a href="#projects" className="btn btn-primary" id="cover-cta-projects">
            <Sparkles size={16} />
            Explore My Work
          </a>
          <a href="#contact" className="btn btn-secondary" id="cover-cta-contact">
            Get In Touch
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="cover__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <a href="#about" className="cover__scroll-link" aria-label="Scroll to about">
            <span className="cover__scroll-label">Scroll to begin</span>
            <ChevronDown size={16} className="cover__scroll-icon" />
          </a>
        </motion.div>
      </div>

      {/* Book page corner decoration */}
      <div className="cover__corner" aria-hidden="true">
        <div className="cover__corner-inner">
          <span>Turn the page</span>
        </div>
      </div>
    </section>
  )
}
