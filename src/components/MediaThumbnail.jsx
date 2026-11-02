import { Play } from 'lucide-react'
import { getPublicUrl } from '../lib/supabase'

export default function MediaThumbnail({ item }) {
  const thumb = getPublicUrl(item.thumbnail_path)
  const src = getPublicUrl(item.storage_path)

  if (item.media_type === 'video') {
    return thumb ? (
      <img
        src={thumb}
        alt={`Thumbnail video: ${item.title}`}
        className="size-full object-cover"
        loading="lazy"
        decoding="async"
      />
    ) : (
      <span className="grid size-full place-items-center bg-deep-blue">
        <Play className="size-10 text-white" aria-hidden="true" />
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
    />
  )
}
