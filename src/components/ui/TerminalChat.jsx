import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, X, Minimize2, Send, Play } from 'lucide-react'
import { useDomainSound } from '../../hooks/useSound'
import './TerminalChat.css'

export default function TerminalChat({ profile, skills = [], projects = [], journey = [] }) {
  const [isOpen, setIsOpen]     = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [history, setHistory]   = useState([])
  const [inputVal, setInputVal] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { playTick } = useDomainSound()

  const listRef = useRef(null)
  const inputRef = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [history, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300)
    }
  }, [isOpen, isMinimized])

  // Welcome message
  useEffect(() => {
    if (history.length === 0) {
      setHistory([
        {
          type: 'system',
          text: `Initializing Reza AI Agent CLI v1.0.0...
[OK] Loading profile database (GPA: 3.94, Experience: 3+ years)
[OK] Indexing skills vector database (${skills.length || 22} keys)
[OK] Connecting network simulation...
`
        },
        {
          type: 'bot',
          text: `Welcome! I am Reza's AI agent CLI, fed with his complete professional dossier.
Type 'help' to see list of terminal commands, or ask me any question!
(e.g., 'What is his GPA?', 'Tell me about Mufko App', 'What did he do at PT Paragon?')`
        }
      ])
    }
  }, [skills])

  const handleCommand = (cmdText) => {
    const query = cmdText.trim().toLowerCase()
    if (!query) return

    // Play tactile sound
    playTick()

    // Add user message to history
    setHistory(prev => [...prev, { type: 'user', text: cmdText }])
    setInputVal('')
    setIsTyping(true)

    // Simulate AI Agent response time
    setTimeout(() => {
      let reply = ''
      
      if (query === 'help') {
        reply = `Available CLI Commands:
  profile     - Show general profile and bio
  experience  - Show work experience records
  projects    - List classified operations (Mufko, Procspy, WMS, etc.)
  skills      - Show technical skills and expertise
  clear       - Clear screen history
  help        - Show this list

Or simply ask any question in plain English!`
      } else if (query === 'clear') {
        setHistory([])
        setIsTyping(false)
        return
      } else if (query === 'profile' || query === 'bio') {
        reply = `IDENTIFIER: ${profile?.name || 'Muhamad Reza Muktasib'}
ROLE: ${profile?.tagline || 'Fullstack Engineer'}
GPA: 3.94 / 4.00 (Top of Class at PENS)
LOCATION: ${profile?.location || 'Indonesia 🇮🇩'}
EXPERIENCE: 3+ Years

BIO INTEL:
"${profile?.bio || 'Building scalable web applications across the space-time of the digital realm.'}"`
      } else if (query === 'experience' || query === 'history') {
        reply = `RECORDS DISCOVERED:
${journey.map(j => `* [${j.year}${j.end_year ? ` - ${j.end_year}` : ' - ONGOING'}] ${j.title}
  - ${j.description}`).join('\n\n')}`
      } else if (query === 'projects' || query === 'portfolio') {
        reply = `CLASSIFIED PROJECTS:
${projects.map(p => `* [${p.title}] - ${p.subtitle}
  Tech: ${p.tech_stack?.slice(0, 5).join(', ')}...
  Role: ${p.role}`).join('\n\n')}`
      } else if (query === 'skills' || query === 'tech') {
        const categories = {}
        skills.forEach(s => {
          const cat = s.category || 'other'
          if (!categories[cat]) categories[cat] = []
          categories[cat].push(`${s.name} (${s.proficiency}%)`)
        })
        reply = `TECHNICAL ABILITIES:
${Object.keys(categories).map(cat => `[${cat.toUpperCase()}]:
  ${categories[cat].join(', ')}`).join('\n\n')}`
      } 
      // Question answering logic
      else if (query.includes('gpa') || query.includes('grade') || query.includes('pens') || query.includes('college') || query.includes('gpa')) {
        reply = `[INTEL] Reza graduated with an Associate Degree in Informatics Engineering from PENS (Politeknik Elektronika Negeri Surabaya). He finished top of his class with a GPA of 3.94 / 4.00.`
      } else if (query.includes('mufko') || query.includes('mutio') || query.includes('mufko app')) {
        reply = `[PROJECT] Mufko App (formerly Mutio App) is a production application serving 4,100 daily active users. Reza maintained the Backend & DevOps using Laravel and managed infrastructure optimization on AWS.`
      } else if (query.includes('procspy') || query.includes('proctoring') || query.includes('anti-cheating')) {
        reply = `[PROJECT] Procspy is an open-source anti-cheating proctoring system that Reza built as his final graduation project. It uses Mediasoup + WebRTC to stream secure exam sessions, achieving high efficiency (30 concurrent users using only 20% CPU on dual-core hardware).`
      } else if (query.includes('paragon') || query.includes('wms') || query.includes('warehouse')) {
        reply = `[WORK] At PT Paragon × Sobat Kreasi, Reza worked as a Backend & DevOps engineer, leading a complex Batch Management migration across 24+ active warehouses and designing real-time SAP integration modules.`
      } else if (query.includes('cv') || query.includes('resume') || query.includes('evaluator')) {
        reply = `[PROJECT] CV Evaluator is an AI-powered resume analysis app built with Next.js, OpenAI, LangChain, and Pinecone vector search for semantic resume scoring and job-role matching.`
      } else if (query.includes('exzam') || query.includes('exam')) {
        reply = `[PROJECT] Exzam.id is a multi-tenant online exam SaaS Reza built using React and Laravel, engineered to handle 120+ concurrent exam users with custom proctoring features.`
      } else if (query.includes('budgetin') || query.includes('flutter')) {
        reply = `[PROJECT] BudgetIn is a personal finance Flutter app currently live on the Google Play Store with a 4.8★ user rating. Reza led the development lifecycle as both Product Owner and lead Flutter developer.`
      } else if (query.includes('experience') || query.includes('years') || query.includes('how long')) {
        reply = `[BIO] Reza has over 3 years of professional software engineering and full-stack development experience, specializing in React, Next.js, Laravel, Go, Docker, and AWS cloud infrastructure.`
      } else if (query.includes('contact') || query.includes('email') || query.includes('hire') || query.includes('reach')) {
        reply = `[CLI] You can contact Reza directly at reza.muktasib@gmail.com, view his LinkedIn at linkedin.com/in/m-rezamuktasib, or use the open transmission form in the CONTACT section at the bottom of the page.`
      } else if (query.includes('hello') || query.includes('hi') || query.includes('welcome')) {
        reply = `[CLI] Connection established. Ask me anything about Reza's GPA, Mufko App, Procspy, or PT Paragon. Try: 'What did he do at PT Paragon?'`
      } else {
        reply = `[AI RESPONSE] Query successfully processed, but direct match not found.
Analyzing keywords: "${cmdText}"
Suggested action: Check Reza's PROJECTS database (type 'projects') or email him directly at reza.muktasib@gmail.com.
(Try asking: 'What is his GPA?' or 'Tell me about Procspy')`
      }

      setHistory(prev => [...prev, { type: 'bot', text: reply }])
      setIsTyping(false)
      playTick()
    }, 750)
  }

  const toggleOpen = () => {
    playTick()
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  return (
    <>
      {/* Floating terminal trigger button */}
      {!isOpen && (
        <button className="terminal-chat-trigger font-mono" onClick={toggleOpen}>
          <span className="terminal-chat-trigger__prompt">&gt;_</span>
          <span className="terminal-chat-trigger__text">AI_AGENT_CLI</span>
        </button>
      )}

      {/* Terminal window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`terminal-chat-window ${isMinimized ? 'minimized' : ''}`}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.2 }}
          >
            {/* Terminal Title Bar */}
            <div className="terminal-chat-window__header">
              <div className="terminal-chat-window__dots">
                <span className="terminal-chat-window__dot terminal-chat-window__dot--red" onClick={() => setIsOpen(false)} />
                <span className="terminal-chat-window__dot terminal-chat-window__dot--yellow" onClick={() => setIsMinimized(!isMinimized)} />
                <span className="terminal-chat-window__dot terminal-chat-window__dot--green" />
              </div>
              <span className="terminal-chat-window__title font-mono">reza@pens:~/ai-agent-cli</span>
              <div className="terminal-chat-window__actions">
                <button className="terminal-chat-window__action-btn" onClick={() => setIsMinimized(!isMinimized)}>
                  <Minimize2 size={12} />
                </button>
                <button className="terminal-chat-window__action-btn" onClick={() => setIsOpen(false)}>
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Window Content */}
            {!isMinimized && (
              <div className="terminal-chat-window__body">
                {/* Scrollable history */}
                <div className="terminal-chat-window__history" ref={listRef}>
                  {history.map((msg, i) => (
                    <div key={i} className={`terminal-chat-msg ${msg.type}`}>
                      {msg.type === 'user' && (
                        <span className="terminal-chat-msg__prompt font-mono">reza-agent $ </span>
                      )}
                      <pre className="terminal-chat-msg__text font-mono">{msg.text}</pre>
                    </div>
                  ))}

                  {/* Typing simulator */}
                  {isTyping && (
                    <div className="terminal-chat-msg bot typing">
                      <span className="terminal-chat-msg__prompt font-mono">Analyzing databases...</span>
                      <span className="terminal-chat-msg__blink font-mono">_</span>
                    </div>
                  )}
                </div>

                {/* Quick actions row */}
                <div className="terminal-chat-window__quick-actions">
                  {['help', 'profile', 'skills', 'projects', 'clear'].map(cmd => (
                    <button
                      key={cmd}
                      className="terminal-chat-window__quick-btn font-mono"
                      onClick={() => handleCommand(cmd)}
                    >
                      {cmd}
                    </button>
                  ))}
                </div>

                {/* Input box */}
                <form
                  className="terminal-chat-window__input-area"
                  onSubmit={e => {
                    e.preventDefault()
                    if (!inputVal) return
                    handleCommand(inputVal)
                  }}
                >
                  <span className="terminal-chat-window__prompt font-mono">reza-agent $ </span>
                  <input
                    ref={inputRef}
                    type="text"
                    className="terminal-chat-window__input font-mono"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="Ask a question..."
                  />
                  <button type="submit" className="terminal-chat-window__send-btn">
                    <Send size={14} />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
