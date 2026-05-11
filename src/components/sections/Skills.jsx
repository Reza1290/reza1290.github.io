import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Skills.css'

const CATEGORY_META = {
  language:  { label: 'Languages',          color: 'violet', emoji: '⌨️' },
  framework: { label: 'Frameworks & Libs',  color: 'amber',  emoji: '🔧' },
  tool:      { label: 'Tools, DBs & Infra', color: 'sage',   emoji: '🛠️' },
}

const TECH_ICONS = {
  'JavaScript':   '🟨', 'TypeScript':  '🔷', 'PHP':         '🐘',
  'Python':       '🐍', 'Go (Golang)': '🟦', 'Java':        '☕',
  'C (STM32)':    '🧠', 'React':       '⚛️', 'Next.js':     '▲',
  'Laravel':      '🔴', 'Node.js':     '🟩', 'Flutter':     '🢋',
  'Remix':        '🌀', 'GraphQL':     '🟣', 'Docker':      '🐳',
  'AWS':          '☁️',  'GCP':         '🌐', 'PostgreSQL':  '🐘',
  'MongoDB':      '🍃', 'Firebase':    '🔥', 'CI/CD':       '🔀',
  'WebRTC':       '📹', 'MariaDB':     '🗄️', 'Nginx':      '⚡',
}

function SkillBar({ name, proficiency, color, index, inView }) {
  return (
    <motion.div
      className="skill-item"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      id={`skill-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
    >
      <div className="skill-item__header">
        <div className="skill-item__name">
          <span className="skill-item__icon">{TECH_ICONS[name] || '💡'}</span>
          <span>{name}</span>
        </div>
        <span className={`skill-item__pct skill-item__pct--${color}`}>
          {proficiency}%
        </span>
      </div>
      <div className="skill-item__track">
        <motion.div
          className={`skill-item__fill skill-item__fill--${color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${proficiency}%` } : { width: 0 }}
          transition={{ duration: 1, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

export default function Skills({ skills }) {
  const [activeTab, setActiveTab] = useState('all')
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const categories = ['all', 'language', 'framework', 'tool']

  const filtered = activeTab === 'all'
    ? skills
    : skills.filter(s => s.category === activeTab)

  // Group by category for the card view when "all" is selected
  const grouped = categories
    .filter(c => c !== 'all')
    .map(cat => ({
      cat,
      items: skills.filter(s => s.category === cat),
      ...CATEGORY_META[cat],
    }))
    .filter(g => g.items.length > 0)

  return (
    <section className="skills section" id="skills" ref={ref}>
      <div className="glow-orb glow-orb-amber skills__orb" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="chapter-label">Chapter 02 — Skills</div>
          <h2 className="section-title">
            My{' '}
            <span className="text-gradient-violet font-display">
              <em>toolkit</em>
            </span>{' '}
            & superpowers
          </h2>
          <p className="section-subtitle">
            Technologies I've mastered and tools I use to bring ideas to life.
          </p>
        </motion.div>

        {/* Tab filters */}
        <motion.div
          className="skills__tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              className={`skills__tab ${activeTab === cat ? 'skills__tab--active' : ''}`}
              onClick={() => setActiveTab(cat)}
              id={`skills-tab-${cat}`}
            >
              {cat === 'all' ? '✨ All' : `${CATEGORY_META[cat].emoji} ${CATEGORY_META[cat].label}`}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        {activeTab === 'all' ? (
          // Grouped card view
          <div className="skills__groups">
            {grouped.map(({ cat, items, label, color, emoji }) => (
              <motion.div
                key={cat}
                className={`skills__group skills__group--${color}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="skills__group-header">
                  <span className="skills__group-emoji">{emoji}</span>
                  <h3 className={`skills__group-title skills__group-title--${color}`}>{label}</h3>
                  <span className="skills__group-count badge badge-violet">
                    {items.length}
                  </span>
                </div>
                <div className="skills__list">
                  {items.map((skill, i) => (
                    <SkillBar
                      key={skill.id}
                      name={skill.name}
                      proficiency={skill.proficiency}
                      color={color}
                      index={i}
                      inView={inView}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Filtered flat list
          <div className="skills__flat">
            {filtered.map((skill, i) => (
              <SkillBar
                key={skill.id}
                name={skill.name}
                proficiency={skill.proficiency}
                color={CATEGORY_META[skill.category]?.color || 'violet'}
                index={i}
                inView={inView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
