import { getPublicUrl } from '../lib/supabase'

export default function MediaPreview({ item }) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-line bg-paper-soft">
        {item.media_type === 'video' ? (
          <video
            src={getPublicUrl(item.storage_path)}
            controls
            preload="metadata"
            className="max-h-[65vh] w-full bg-ink"
          />
        ) : (
          <img
            src={getPublicUrl(item.storage_path)}
            alt={item.title}
            className="max-h-[65vh] w-full object-contain"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        <span>{item.media_type}</span>
        <span>
          {new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {item.description && (
        <p className="text-sm leading-relaxed text-muted">{item.description}</p>
      )}
    </div>
  )
}
