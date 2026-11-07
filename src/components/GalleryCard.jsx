import { Play } from 'lucide-react'
import MediaThumbnail from './MediaThumbnail'

function formatDate(value) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const TYPE_LABEL = { foto: 'Foto', video: 'Video' }

export default function GalleryCard({ item, onOpen }) {
  return (
    <article className="group relative mb-4 w-full break-inside-avoid animate-card-in overflow-hidden rounded-2xl border border-white/10 bg-paper-soft">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="relative block w-full text-left focus-visible:outline-offset-4"
        aria-label={`Buka ${item.media_type}: ${item.title}`}
        aria-haspopup="dialog"
      >
        <span className="relative block w-full overflow-hidden">
          <span className="block transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <MediaThumbnail item={item} natural />
          </span>

          <span aria-hidden="true" className="photo-scrim absolute inset-0" />

          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            {item.media_type === 'video' && (
              <Play className="size-2.5 fill-current" aria-hidden="true" />
            )}
            {TYPE_LABEL[item.media_type] ?? 'Media'}
          </span>

          {item.media_type === 'video' && (
            <span className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="grid size-14 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                <Play className="ml-0.5 size-5 fill-white text-white" aria-hidden="true" />
              </span>
            </span>
          )}

          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.22em] text-white/60">
                {formatDate(item.created_at)}
              </span>
              <span
                className="mt-1 block truncate text-sm font-semibold text-white sm:text-base"
                title={item.title}
              >
                {item.title}
              </span>
            </span>
          </span>
        </span>
      </button>
    </article>
  )
}
