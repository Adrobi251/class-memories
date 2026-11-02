import { useCallback, useEffect, useState } from 'react'
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  hasSupabaseConfig,
} from '../lib/supabaseConfig'

const MEDIA_ENDPOINT = `${SUPABASE_URL}/rest/v1/media?select=*&order=created_at.desc&limit=500`

export function useMedia() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)

    try {
      if (!hasSupabaseConfig) {
        throw new Error(
          'Missing Supabase env vars. Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        )
      }

      // Public read through the REST endpoint: same RLS rules as the SDK, but
      // keeps @supabase/supabase-js out of the initial JS bundle.
      const response = await fetch(MEDIA_ENDPOINT, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(
          payload?.message ?? `Galeri gagal dimuat (HTTP ${response.status}).`,
        )
      }

      const data = await response.json()
      setError(null)
      setMedia(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Galeri gagal dimuat.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { media, loading, error, refresh }
}
