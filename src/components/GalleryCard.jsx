import { motion } from 'motion/react'
import { ArrowUpRight, Play, Trash2 } from 'lucide-react'
import MediaThumbnail from './MediaThumbnail'
import { galleryLayout } from '../lib/galleryLayout'

function formatDate(value) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function GalleryCard({ item, index, isAdmin, deleting, onOpen, onDelete }) {
  const { span, ratio } = galleryLayout(index)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`${span} group relative self-start overflow-hidden rounded-lg border border-line bg-paper shadow-card transition-transform duration-200 hover:-translate-y-0.5`}
    >
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="block w-full text-left"
        aria-label={`Buka ${item.media_type}: ${item.title}`}
        aria-haspopup="dialog"
      >
        <span className={`relative block w-full overflow-hidden ${ratio}`}>
          <MediaThumbnail item={item} />
          {item.media_type === 'video' && (
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-12 place-items-center rounded-lg bg-signal transition-transform duration-200 group-hover:scale-105">
                <Play className="ml-0.5 size-5 fill-white text-white" aria-hidden="true" />
              </span>
            </span>
          )}
        </span>

        <span className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
          <span className="min-w-0">
            <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              {item.media_type === 'video' ? 'Video' : 'Foto'} / {formatDate(item.created_at)}
            </span>
            <span className="mt-1 block truncate text-sm font-semibold" title={item.title}>
              {item.title}
            </span>
          </span>
          <ArrowUpRight
            className="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </button>

      {isAdmin && (
        <button
          type="button"
          onClick={() => onDelete(item)}
          disabled={deleting}
          aria-label={`Hapus ${item.title}`}
          aria-haspopup="dialog"
          aria-busy={deleting}
          className="absolute right-2 top-2 z-10 grid size-11 place-items-center rounded-lg border border-line bg-paper text-ink transition-colors duration-200 hover:border-signal hover:bg-signal hover:text-white disabled:opacity-60"
        >
          {deleting ? (
            <span className="block size-3 animate-pulse bg-signal" aria-hidden="true" />
          ) : (
            <Trash2 className="size-4" aria-hidden="true" />
          )}
        </button>
      )}
    </motion.article>
  )
}
