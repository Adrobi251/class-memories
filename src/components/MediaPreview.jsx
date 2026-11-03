import { useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { getPublicUrl } from '../lib/supabaseConfig'

export default function MediaPreview({
  item,
  position = 1,
  total = 1,
  onPrev,
  onNext,
}) {
  const [failed, setFailed] = useState(false)
  const src = getPublicUrl(item.storage_path)
  const poster = getPublicUrl(item.thumbnail_path)
  const showNav = total > 1 && typeof onPrev === 'function' && typeof onNext === 'function'
  const date = new Date(item.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-line bg-paper-soft">
        {item.media_type === 'video' ? (
          <video
            src={src}
            poster={poster ?? undefined}
            controls
            preload="metadata"
            className="max-h-[65vh] w-full bg-black"
          />
        ) : failed ? (
          <div className="grid aspect-[4/3] place-items-center gap-2 bg-paper-soft p-6 text-center">
            <ImageOff className="size-7 text-muted" aria-hidden="true" />
            <p className="text-sm text-muted">Foto tidak dapat dimuat.</p>
          </div>
        ) : (
          <img
            src={src}
            alt={item.title}
            onError={() => setFailed(true)}
            className="max-h-[65vh] w-full object-contain"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {item.media_type === 'video' ? 'Video' : 'Foto'} / {date}
        </span>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper"
        >
          Resolusi asli
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>

      {item.description && (
        <p className="text-sm leading-relaxed text-muted">{item.description}</p>
      )}

      {showNav && (
        <div className="flex items-center justify-between gap-2 border-t border-line pt-3">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Dokumentasi sebelumnya"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <span
            aria-live="polite"
            aria-atomic="true"
            className="font-mono text-[11px] tabular-nums uppercase tracking-[0.14em] text-muted"
          >
            {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={onNext}
            aria-label="Dokumentasi berikutnya"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
