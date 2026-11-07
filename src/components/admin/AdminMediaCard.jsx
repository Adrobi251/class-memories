import { Eye, Pencil, Play, Trash2 } from 'lucide-react'
import AdminTypeBadge from './AdminTypeBadge'
import MediaThumbnail from '../MediaThumbnail'
import { formatMediaDate } from '../../lib/media'

function ActionButton({ label, onClick, danger = false, children }) {
  const tone = danger
    ? 'hover:border-signal hover:bg-signal hover:text-white'
    : 'hover:border-accent-soft hover:bg-accent-soft hover:text-paper'

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      aria-label={label}
      title={label}
      className={`grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-muted transition-colors duration-200 ${tone}`}
    >
      {children}
    </button>
  )
}

export default function AdminMediaCard({
  item,
  selected,
  onToggleSelect,
  onPreview,
  onEdit,
  onDelete,
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-paper-soft transition-colors duration-200 ${
        selected ? 'border-accent-soft/70' : 'border-white/10'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <button
          type="button"
          onClick={onPreview}
          aria-label={`Pratinjau ${item.title}`}
          className="relative block size-full text-left"
        >
          <span className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <MediaThumbnail item={item} />
          </span>
          <span aria-hidden="true" className="photo-scrim absolute inset-0" />

          {item.media_type === 'video' && (
            <span className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="grid size-12 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md">
                <Play className="ml-0.5 size-4 fill-white text-white" aria-hidden="true" />
              </span>
            </span>
          )}
        </button>

        <label className="absolute left-3 top-3 z-20 grid size-9 cursor-pointer place-items-center rounded-lg border border-white/25 bg-black/40 backdrop-blur-md">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            aria-label={`Pilih ${item.title}`}
            className="size-4 cursor-pointer rounded accent-[#bbd5da]"
          />
        </label>

        <span className="absolute right-3 top-3 z-20">
          <AdminTypeBadge type={item.media_type} />
        </span>
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-ink" title={item.title}>
          {item.title}
        </h3>
        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted">
          {formatMediaDate(item.created_at)}
        </p>
        {item.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
            {item.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-1.5 border-t border-white/10 pt-3">
          <ActionButton label={`Pratinjau ${item.title}`} onClick={onPreview}>
            <Eye className="size-4" aria-hidden="true" />
          </ActionButton>
          <ActionButton label={`Edit ${item.title}`} onClick={onEdit}>
            <Pencil className="size-4" aria-hidden="true" />
          </ActionButton>
          <ActionButton label={`Hapus ${item.title}`} onClick={onDelete} danger>
            <Trash2 className="size-4" aria-hidden="true" />
          </ActionButton>
        </div>
      </div>
    </article>
  )
}
