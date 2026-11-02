import { useState } from 'react'
import { ImageOff, Play } from 'lucide-react'
import { getPublicUrl } from '../lib/supabase'

export default function MediaThumbnail({ item }) {
  const [thumbFailed, setThumbFailed] = useState(false)
  const [mediaFailed, setMediaFailed] = useState(false)
  const thumb = getPublicUrl(item.thumbnail_path)
  const src = getPublicUrl(item.storage_path)

  if (item.media_type === 'video') {
    return thumb && !thumbFailed ? (
      <img
        src={thumb}
        alt={`Thumbnail video: ${item.title}`}
        className="size-full object-cover"
        loading="lazy"
        decoding="async"
        onError={() => setThumbFailed(true)}
      />
    ) : (
      <span className="grid size-full place-items-center bg-deep-blue">
        <Play className="size-10 text-white" aria-hidden="true" />
      </span>
    )
  }

  if (mediaFailed) {
    return (
      <span className="grid size-full place-items-center bg-paper-soft">
        <ImageOff className="size-7 text-muted" aria-hidden="true" />
        <span className="sr-only">Foto tidak dapat dimuat</span>
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={item.title}
      className="size-full object-cover"
      loading="lazy"
      decoding="async"
      onError={() => setMediaFailed(true)}
    />
  )
}
