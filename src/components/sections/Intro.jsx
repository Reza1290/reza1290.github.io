import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VoidCanvas from '../canvas/VoidCanvas'
import { useDomainSound } from '../../hooks/useSound'
import './Intro.css'

export default function Intro({ onEnter }) {
  const [phase, setPhase]       = useState('idle') // idle → charging → explode
  const [progress, setProgress] = useState(0)
  const [dots, setDots]         = useState('')
  const { playBoot, playCharge, playExpand } = useDomainSound()

  useEffect(() => {
    // Play startup terminal blips
    playBoot()
  }, [playBoot])

  useEffect(() => {
    const iv = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 500)
    return () => clearInterval(iv)
  }, [])

  const handleClick = () => {
    if (phase !== 'idle') return
    playCharge()
    setPhase('charging')
    let p = 0
    const iv = setInterval(() => {
      p += 2
      setProgress(p)
      if (p >= 100) {
        clearInterval(iv)
        playExpand()
        setPhase('explode')
        setTimeout(onEnter, 900)
      }
    }, 30)
  }

  return (
    <AnimatePresence>
      {phase !== 'explode' && (
        <motion.div
          className="intro"
          exit={{ opacity: 0, scale: 3 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background vortex */}
          <div className="intro__canvas">
            <VoidCanvas intensity={phase === 'charging' ? 1.8 : 0.7} />
          </div>

          {/* Expanding rings on charge */}
          {phase === 'charging' && (
            <>
              <div className="intro__ring intro__ring--1" />
              <div className="intro__ring intro__ring--2" />
              <div className="intro__ring intro__ring--3" />
            </>
          )}

          {/* Content */}
          <div className="intro__content">
            {/* Japanese kanji decoration */}
            <motion.div
              className="intro__kanji font-jp"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 0.15, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              空間展開
            </motion.div>

            {/* Main title */}
            <motion.h1
              className="intro__title font-display"
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.1em' }}
              transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            >
              FIELD<br />OPEN
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="intro__subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {phase === 'idle'
                ? `INITIATING SPATIAL EXPANSION${dots}`
                : 'DOMAIN MANIFESTING...'}
            </motion.p>

            {/* Progress bar (charging) */}
            {phase === 'charging' && (
              <motion.div
                className="intro__bar-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="intro__bar">
                  <motion.div
                    className="intro__bar-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="intro__bar-label">{progress}%</span>
              </motion.div>
            )}

            {/* CTA button */}
            {phase === 'idle' && (
              <motion.button
                className="intro__btn"
                onClick={handleClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="intro__btn-icon">⬡</span>
                ENTER THE DOMAIN
              </motion.button>
            )}
          </div>

          {/* Corner decorations */}
          <div className="intro__corner intro__corner--tl" />
          <div className="intro__corner intro__corner--tr" />
          <div className="intro__corner intro__corner--bl" />
          <div className="intro__corner intro__corner--br" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
