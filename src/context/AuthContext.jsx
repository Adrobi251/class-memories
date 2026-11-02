import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

// The SDK is only needed for auth and admin writes. Importing it lazily keeps
// ~55 kB gzip off the critical path for public visitors.
function loadClient() {
  return import('../lib/supabase').then((mod) => mod.supabase)
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let subscription = null
    let idleId = null
    let timer = null

    async function connect() {
      try {
        const supabase = await loadClient()
        if (!mounted) return

        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        setSession(data.session)
        setLoading(false)

        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, nextSession) => {
            setSession(nextSession)
            setLoading(false)
          },
        )
        subscription = listener.subscription
      } catch {
        if (mounted) setLoading(false)
      }
    }

    // Public visitors never need the auth SDK; only the admin does. Waiting for
    // load/idle keeps it out of the LCP path, and signIn/signOut still load it on
    // demand if an admin acts before the deferred check runs.
    function schedule() {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(connect, { timeout: 3000 })
      } else {
        timer = window.setTimeout(connect, 1200)
      }
    }

    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      mounted = false
      window.removeEventListener('load', schedule)
      if (idleId !== null) window.cancelIdleCallback?.(idleId)
      if (timer !== null) window.clearTimeout(timer)
      subscription?.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin: Boolean(session?.user),
      loading,
      signIn: async (email, password) => {
        const supabase = await loadClient()
        const result = await supabase.auth.signInWithPassword({ email, password })
        if (result.data?.session) {
          setSession(result.data.session)
          setLoading(false)
        }
        return result
      },
      signOut: async () => {
        const supabase = await loadClient()
        const result = await supabase.auth.signOut()
        if (!result.error) {
          setSession(null)
          setLoading(false)
        }
        return result
      },
    }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
