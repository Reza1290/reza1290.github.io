import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useSupabase'
import { LogIn, LogOut, Save, Plus, Trash2, BookOpen } from 'lucide-react'
import './Admin.css'

function LoginForm({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="admin-login">
      <div className="admin-login__box">
        <div className="admin-login__logo">
          <BookOpen size={32} />
          <span>Admin</span>
        </div>
        <h1 className="admin-login__title">Portfolio CMS</h1>
        <p className="admin-login__subtitle">Sign in to manage your content</p>

        <form onSubmit={handleSubmit} className="admin-login__form" id="admin-login-form">
          <input
            type="email"
            className="contact__input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            id="admin-email"
            required
          />
          <input
            type="password"
            className="contact__input"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            id="admin-password"
            required
          />
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="btn btn-primary admin-login__btn" disabled={loading} id="admin-login-btn">
            <LogIn size={16} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const { session, loading } = useAuth()

  const handleLogout = () => supabase.auth.signOut()

  if (loading) return (
    <div className="admin-loading">
      <BookOpen size={40} className="admin-loading__icon" />
    </div>
  )

  if (!session) return <LoginForm />

  return (
    <div className="admin">
      <div className="admin__header">
        <div className="admin__header-logo">
          <BookOpen size={24} />
          <span className="font-display">Portfolio CMS</span>
        </div>
        <div className="admin__header-actions">
          <a href="/" className="btn btn-secondary">View Portfolio</a>
          <button onClick={handleLogout} className="btn btn-secondary" id="admin-logout">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="admin__content container">
        <h2 className="admin__welcome">
          Welcome back! 👋
        </h2>
        <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>
          Manage your portfolio content below. Changes are saved directly to Supabase.
        </p>

        <div className="admin__cards">
          {[
            { label: 'Profile',  table: 'profile',  desc: 'Edit your name, bio, and contact links' },
            { label: 'Skills',   table: 'skills',   desc: 'Manage your skills and proficiency levels' },
            { label: 'Journey',  table: 'journey',  desc: 'Add or edit your career timeline entries' },
            { label: 'Projects', table: 'projects', desc: 'Showcase your work and projects' },
          ].map(({ label, table, desc }) => (
            <a
              key={table}
              href={`https://supabase.com/dashboard/project/_/editor?schema=public&table=${table}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card admin__table-card"
              id={`admin-card-${table}`}
            >
              <h3 className="admin__table-title">{label}</h3>
              <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>{desc}</p>
              <span className="admin__table-link text-violet">Open in Supabase →</span>
            </a>
          ))}
        </div>

        <div className="admin__tip">
          <strong>💡 Tip:</strong> Edit your data directly in the Supabase dashboard, then refresh your portfolio to see the changes live.
        </div>
      </div>
    </div>
  )
}
