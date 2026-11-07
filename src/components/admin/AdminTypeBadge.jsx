import { Play } from 'lucide-react'

const LABEL = { foto: 'Foto', video: 'Video' }

export default function AdminTypeBadge({ type, className = '' }) {
  const video = type === 'video'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md ${
        video
          ? 'border-accent-soft/40 bg-black/40 text-accent-soft'
          : 'border-white/20 bg-black/35 text-white/80'
      } ${className}`}
    >
      {video && <Play className="size-2.5 fill-current" aria-hidden="true" />}
      {LABEL[type] ?? 'Media'}
    </span>
  )
}
