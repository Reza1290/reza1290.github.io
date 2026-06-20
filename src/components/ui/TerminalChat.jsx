import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, X, Minimize2, Send, Play } from 'lucide-react'
import { useDomainSound } from '../../hooks/useSound'
import './TerminalChat.css'

// Stopwords to filter out for basic NLP processing
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have',
  'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt',
  'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such',
  'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres',
  'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent',
  'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom',
  'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve',
  'your', 'yours', 'yourself', 'yourselves', 'reza', 'rezam'
])

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
          text: `Initializing Reza AI Agent CLI v1.1.0...
[OK] Loading profile database (GPA: 3.94, Experience: 3+ years)
[OK] Indexing skills vector database (${skills.length || 22} keys)
[OK] Connecting NLP semantic analyzer...
`
        },
        {
          type: 'bot',
          text: `Welcome! I am Reza's NLP-simulated AI agent CLI, fed with his complete professional dossier.
Type 'help' to see list of terminal commands, or ask me any question in plain English!
(e.g., 'What is his GPA?', 'Tell me about Mufko App', 'What is Procspy?')`
        }
      ])
    }
  }, [skills])

  // Dictionary of intents and synonym keywords
  const getIntents = () => ({
    gpa: {
      keywords: ['gpa', 'grade', 'score', 'pens', 'college', 'university', 'study', 'education', 'transcript', 'academic', 'degrees', 'marks', 'politeknik'],
      response: `[AI INTEL] Category: EDUCATION
Reza graduated with an Associate Degree in Informatics Engineering from PENS (Politeknik Elektronika Negeri Surabaya). He finished top of his class with a GPA of 3.94 / 4.00.`
    },
    mufko: {
      keywords: ['mufko', 'mutio', 'aws', 'app', 'application', 'daily', 'active', 'users', 'backend', 'devops', 'paragon'],
      response: `[AI INTEL] Category: PROJECT
Mufko App (formerly Mutio App) is a production application serving 4,100 daily active users. Reza maintained the Backend & DevOps using Laravel and managed infrastructure optimization on AWS.`
    },
    procspy: {
      keywords: ['procspy', 'proctoring', 'anti-cheating', 'webrtc', 'mediasoup', 'extension', 'graduation', 'project', 'exam'],
      response: `[AI INTEL] Category: PROJECT
Procspy is an open-source anti-cheating proctoring system that Reza built as his final graduation project at PENS. It uses Mediasoup + WebRTC to stream secure exam sessions, achieving high efficiency (30 concurrent users using only 20% CPU on dual-core hardware).`
    },
    paragon: {
      keywords: ['paragon', 'wms', 'warehouse', 'sap', 'batch', 'inventory', 'logistics', 'pt paragon'],
      response: `[AI INTEL] Category: WORK
At PT Paragon × Sobat Kreasi, Reza worked as a Backend & DevOps engineer, leading a complex Batch Management migration across 24+ active warehouses and designing real-time SAP integration modules.`
    },
    cvevaluator: {
      keywords: ['cv', 'resume', 'evaluator', 'ai', 'langchain', 'openai', 'pinecone', 'semantic', 'vector', 'parsing'],
      response: `[AI INTEL] Category: PROJECT
CV Evaluator is an AI-powered resume analysis app built with Next.js, OpenAI, LangChain, and Pinecone vector search for semantic resume scoring and job-role matching.`
    },
    exzam: {
      keywords: ['exzam', 'exam', 'tenant', 'saas', 'laravel', 'school', 'teacher', 'online'],
      response: `[AI INTEL] Category: PROJECT
Exzam.id is a multi-tenant online exam SaaS Reza built using React and Laravel, engineered to handle 120+ concurrent exam users with custom proctoring features.`
    },
    budgetin: {
      keywords: ['budgetin', 'finance', 'flutter', 'play store', 'scrum', 'agile', 'personal', 'budget'],
      response: `[AI INTEL] Category: PROJECT
BudgetIn is a personal finance Flutter app currently live on the Google Play Store with a 4.8★ user rating. Reza led the development lifecycle as both Product Owner and lead Flutter developer.`
    },
    toefl: {
      keywords: ['toefl', 'mytoefl', 'quiz', 'duolingo', 'leveling', 'game', 'prep'],
      response: `[AI INTEL] Category: PROJECT
Pens MyToefl is a gamified preparation app with 50ms API response times running on Dockerized microservices.`
    },
    skills: {
      keywords: ['skills', 'tech', 'language', 'backend', 'frontend', 'framework', 'database', 'tools', 'languages', 'proficient', 'know', 'expert', 'abilities'],
      response: `[AI INTEL] Category: TECHNICAL ABILITIES
Reza is proficient in:
- Languages: JavaScript, TypeScript, PHP, Python, Go, Java, C
- Frameworks: React, Next.js, Laravel, Node.js, Flutter, Remix
- Infrastructure: Docker, AWS, GCP, CI/CD, PostgreSQL, MongoDB, WebRTC`
    },
    contact: {
      keywords: ['contact', 'email', 'mail', 'hire', 'phone', 'linkedin', 'reach', 'social', 'github', 'address', 'send', 'message'],
      response: `[AI INTEL] Category: CONTACT CHANNELS
You can contact Reza directly at:
- Email: reza.muktasib@gmail.com
- LinkedIn: linkedin.com/in/m-rezamuktasib
- GitHub: github.com/reza1290
Or use the open transmission form in the CONTACT section at the bottom of the page.`
    },
    experience: {
      keywords: ['experience', 'years', 'career', 'work', 'job', 'history', 'professional', 'long', 'freelance'],
      response: `[AI INTEL] Category: WORK EXPERIENCE
Reza has over 3 years of professional software engineering and full-stack development experience, specializing in React, Next.js, Laravel, Go, Docker, and AWS cloud infrastructure. His history includes PT Paragon, Mufko App, and 10+ freelance projects.`
    },
    profile: {
      keywords: ['who', 'reza', 'profile', 'bio', 'about', 'him', 'name', 'muktasib', 'muhamad'],
      response: `[AI INTEL] Category: PROFILE SUMMARY
Reza (Muhamad Reza Muktasib) is a Fullstack & Software Engineer. He graduated from PENS, has 3+ years of experience building secure SaaS products (like Exzam.id and Mufko App), and loves writing clean, high-performance code.`
    }
  })

  // Lite NLP Intent Classifier
  const resolveIntent = (queryText) => {
    // 1. Lowercase and clean input
    const cleanQuery = queryText.toLowerCase().replace(/[^a-z0-9\s]/g, '')
    // 2. Tokenize and filter out stopwords
    const tokens = cleanQuery
      .split(/\s+/)
      .map(t => t.trim())
      .filter(t => t.length > 0 && !STOPWORDS.has(t))

    if (tokens.length === 0) return null

    const intents = getIntents()
    let bestIntent = null
    let maxScore = 0

    // 3. Compute score for each intent category
    Object.keys(intents).forEach(intentKey => {
      let score = 0
      const intent = intents[intentKey]

      tokens.forEach(token => {
        intent.keywords.forEach(kw => {
          if (token === kw) {
            score += 2.0 // exact keyword match
          } else if (token.length > 3 && kw.startsWith(token)) {
            score += 1.0 // partial starts-with
          } else if (kw.length > 3 && token.startsWith(kw)) {
            score += 1.0 // partial starts-with reverse
          }
        })
      })

      if (score > maxScore) {
        maxScore = score
        bestIntent = intentKey
      }
    })

    // Return the matched intent if score passes threshold
    return maxScore > 0.5 ? intents[bestIntent] : null
  }

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
      
      // Check for exact shell commands first
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
        const intents = getIntents()
        reply = intents.profile.response
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
      // Call Lite NLP Intent Classifier for natural language
      else {
        const match = resolveIntent(query)
        if (match) {
          reply = match.response
        } else {
          reply = `[NLP ERROR] Query: "${cmdText}"
Analyzing semantic vectors... Intent resolved with low confidence (< 10%).

Suggested commands: 'profile', 'skills', 'projects', 'experience'.
Try asking: 'What did he do at PT Paragon?' or 'Tell me about Procspy'.`
        }
      }

      setHistory(prev => [...prev, { type: 'bot', text: reply }])
      setIsTyping(false)
      playTick()
    }, 600)
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
