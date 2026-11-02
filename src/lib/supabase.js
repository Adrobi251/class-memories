import { createClient } from '@supabase/supabase-js'
import {
  MEDIA_BUCKET,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  getPublicUrl,
} from './supabaseConfig'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export { MEDIA_BUCKET, getPublicUrl }
