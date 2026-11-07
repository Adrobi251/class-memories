export const TYPE_LABEL = { foto: 'Foto', video: 'Video' }

const CACHE_CONTROL = '31536000'

export function formatMediaDate(value) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatMediaError(err, fallback = 'Terjadi kesalahan. Coba lagi.') {
  if (!err) return fallback
  const message = typeof err === 'string' ? err : err.message || ''

  if (/row-level security|permission denied|violates rls/i.test(message)) {
    return 'Akses ditolak: hanya admin yang berhak mengubah arsip. Pastikan sesi login masih aktif.'
  }
  if (/jwt expired|invalid token|unauthorized|not authenticated|401/i.test(message)) {
    return 'Sesi login admin telah berakhir. Silakan login kembali.'
  }
  if (/failed to fetch|networkerror|network request failed|load failed/i.test(message)) {
    return 'Koneksi terputus. Periksa internet lalu coba lagi.'
  }
  if (/bucket.*not found/i.test(message)) {
    return 'Bucket penyimpanan Supabase belum siap atau tidak ditemukan.'
  }
  if (/payload too large|entity too large|413/i.test(message)) {
    return 'Ukuran file melebihi batas upload yang diizinkan.'
  }

  return message || fallback
}

async function client() {
  return import('./supabase')
}

function safeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function deleteMediaItems(items) {
  if (!items?.length) return

  const { supabase, MEDIA_BUCKET } = await client()
  const paths = [
    ...new Set(
      items
        .flatMap((item) => [item.storage_path, item.thumbnail_path])
        .filter(Boolean),
    ),
  ]

  if (paths.length) {
    const { error: storageError } = await supabase.storage.from(MEDIA_BUCKET).remove(paths)
    if (storageError) throw storageError
  }

  const { error: rowError } = await supabase
    .from('media')
    .delete()
    .in(
      'id',
      items.map((item) => item.id),
    )
  if (rowError) throw rowError
}

export async function saveMediaItem(item, { title, description, poster }) {
  const { supabase, MEDIA_BUCKET } = await client()
  let posterPath = item.thumbnail_path

  if (poster) {
    const extension = poster.type?.startsWith('image/')
      ? poster.type.split('/')[1]?.replace('jpeg', 'jpg')
      : 'webp'
    posterPath = `thumbnails/${Date.now()}-${safeName(
      poster.name || `poster.${extension || 'webp'}`,
    )}`

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(posterPath, poster, { cacheControl: CACHE_CONTROL, upsert: false })
    if (uploadError) throw uploadError
  }

  const { error: updateError } = await supabase
    .from('media')
    .update({
      title,
      description: description || null,
      ...(poster ? { thumbnail_path: posterPath } : {}),
    })
    .eq('id', item.id)

  if (updateError) {
    if (poster) {
      await supabase.storage.from(MEDIA_BUCKET).remove([posterPath]).catch(() => {})
    }
    throw updateError
  }

  if (poster && item.thumbnail_path) {
    await supabase.storage.from(MEDIA_BUCKET).remove([item.thumbnail_path]).catch(() => {})
  }

  return posterPath
}
