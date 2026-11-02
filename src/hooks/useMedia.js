import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useMedia() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) setError(fetchError)
    else {
      setError(null)
      setMedia(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { media, loading, error, refresh }
}
