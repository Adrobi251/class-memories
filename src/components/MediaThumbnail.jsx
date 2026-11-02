import { useState } from 'react'
import { ImageOff, Play } from 'lucide-react'
import { getPublicUrl } from '../lib/supabaseConfig'

export default function MediaThumbnail({ item, priority = false }) {
  const [failed, setFailed] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  const thumb = getPublicUrl(item.thumbnail_path)
  const original = getPublicUrl(item.storage_path)
  const isVideo = item.media_type === 'video'

  const src = isVideo ? thumb : thumb && !useFallback ? thumb : original
  const loading = priority ? 'eager' : 'lazy'

  if (!src || failed) {
    return (
      <span
        className={`grid size-full place-items-center ${isVideo ? 'bg-deep-blue' : 'bg-paper-soft'}`}
      >
        {isVideo ? (
          <Play className="size-10 text-white" aria-hidden="true" />
        ) : (
          <ImageOff className="size-7 text-muted" aria-hidden="true" />
        )}
        <span className="sr-only">
          {isVideo ? 'Thumbnail video tidak dapat dimuat' : 'Foto tidak dapat dimuat'}
        </span>
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={isVideo ? `Thumbnail video: ${item.title}` : item.title}
      className="size-full object-cover"
      loading={loading}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      onError={() => {
        if (!isVideo && thumb && !useFallback) setUseFallback(true)
        else setFailed(true)
      }}
    />
  )
}
