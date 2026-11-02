import { ArrowUpRight, Play } from 'lucide-react'
import MediaThumbnail from './MediaThumbnail'

const TYPE_LABEL = { foto: 'Foto', video: 'Video' }

function formatDate(value) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function GalleryStrip({ media = [], onOpen }) {
  const items = media.slice(0, 4)
  if (!items.length) return null

  return (
    <section aria-labelledby="sorotan-title" className="mb-8">
      <div className="mb-4 flex items-end justify-between gap-4 border-t border-line pt-4">
        <div className="flex items-center gap-3">
          <span className="size-2 shrink-0 bg-signal" aria-hidden="true" />
          <h3
            id="sorotan-title"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink"
          >
            Sorotan terbaru
          </h3>
        </div>
        <p className="font-mono text-[11px] tabular-nums uppercase tracking-[0.14em] text-muted">
          {String(items.length).padStart(2, '0')} / {String(media.length).padStart(2, '0')}
        </p>
      </div>

      <ul className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <button
              type="button"
              onClick={() => onOpen?.(item)}
              className="group block w-full text-left"
              aria-label={`Buka ${item.media_type}: ${item.title}`}
              aria-haspopup="dialog"
            >
              <span className="relative block aspect-[3/4] overflow-hidden rounded-lg border border-line bg-paper-soft shadow-card">
                <MediaThumbnail item={item} />
                {item.media_type === 'video' && (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-11 place-items-center rounded-lg bg-signal transition-transform duration-200 group-hover:scale-105">
                      <Play
                        className="ml-0.5 size-4 fill-white text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                )}
              </span>

              <span className="mt-3 flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {TYPE_LABEL[item.media_type] ?? 'Media'} / {formatDate(item.created_at)}
                  </span>
                  <span className="mt-1 block truncate text-sm font-semibold text-ink">
                    {item.title}
                  </span>
                </span>
                <ArrowUpRight
                  className="mt-0.5 size-4 shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
