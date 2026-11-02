// Public, non-secret Supabase config plus URL helpers.
// Kept separate from the client so public pages do not pull the Supabase SDK
// into the initial bundle just to build storage URLs or read the media table.
const rawUrl = import.meta.env.VITE_SUPABASE_URL ?? ''

export const SUPABASE_URL = rawUrl.replace(/\/+$/, '')
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
export const MEDIA_BUCKET = 'media'

export const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export function getPublicUrl(path) {
  if (!path) return null
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`
}

export function brandingUrl(file) {
  if (!file) return null
  return getPublicUrl(`branding/${file}`)
}
