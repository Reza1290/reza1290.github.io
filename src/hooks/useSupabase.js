import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Generic hook for fetching a single table from Supabase.
 * Falls back to `fallbackData` while Supabase is unconfigured.
 *
 * @param {string}   table        - Supabase table name
 * @param {object}   options      - { orderBy, ascending, fallbackData }
 */
export function useSupabaseTable(table, options = {}) {
  const { orderBy = 'sort_order', ascending = true, fallbackData = [] } = options
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      try {
        let query = supabase.from(table).select('*')
        if (orderBy) query = query.order(orderBy, { ascending })

        const { data: rows, error: err } = await query

        if (cancelled) return
        if (err) throw err
        setData(rows?.length ? rows : fallbackData)
      } catch (err) {
        if (!cancelled) {
          console.warn(`[useSupabaseTable] Error fetching "${table}":`, err.message)
          setError(err)
          setData(fallbackData)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [table])

  return { data: data ?? fallbackData, loading, error }
}

/**
 * Hook for fetching a single row (profile table).
 */
export function useSupabaseSingle(table, fallback = {}) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      setLoading(true)
      try {
        const { data: rows, error: err } = await supabase
          .from(table)
          .select('*')
          .limit(1)
          .single()

        if (cancelled) return
        if (err) throw err
        setData(rows)
      } catch (err) {
        if (!cancelled) {
          setError(err)
          setData(fallback)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [table])

  return { data: data ?? fallback, loading, error }
}

/**
 * Hook for Supabase Auth session.
 */
export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )
    return () => subscription.unsubscribe()
  }, [])

  return { session, loading }
}
