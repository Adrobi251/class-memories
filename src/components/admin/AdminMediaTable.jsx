import { useEffect, useRef } from 'react'
import { Eye, Pencil, Play, Trash2 } from 'lucide-react'
import AdminTypeBadge from './AdminTypeBadge'
import MediaThumbnail from '../MediaThumbnail'
import { formatMediaDate } from '../../lib/media'

function HeaderCheckbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label="Pilih semua dokumentasi"
      className="size-4 cursor-pointer rounded accent-[#bbd5da]"
    />
  )
}

function RowAction({ label, onClick, danger = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-muted transition-colors duration-200 ${
        danger
          ? 'hover:border-signal hover:bg-signal hover:text-white'
          : 'hover:border-accent-soft hover:bg-accent-soft hover:text-paper'
      }`}
    >
      {children}
    </button>
  )
}

export default function AdminMediaTable({
  items,
  selectedIds,
  onToggleSelect,
  allSelected,
  someSelected,
  onToggleSelectAll,
  onPreview,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-paper-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr className="text-[10px] uppercase tracking-[0.18em] text-muted">
              <th className="w-12 px-4 py-3">
                <HeaderCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={onToggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 font-semibold">Dokumentasi</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">Jenis</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">Tanggal</th>
              <th className="px-4 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const selected = selectedIds.has(item.id)

              return (
                <tr
                  key={item.id}
                  className={`border-b border-white/[0.06] last:border-0 transition-colors ${
                    selected ? 'bg-accent-soft/[0.06]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleSelect(item.id)}
                      aria-label={`Pilih ${item.title}`}
                      className="size-4 cursor-pointer rounded accent-[#bbd5da]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onPreview(item)}
                      className="flex min-w-0 items-center gap-3 text-left"
                    >
                      <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-paper">
                        <MediaThumbnail item={item} />
                        {item.media_type === 'video' && (
                          <span className="absolute inset-0 grid place-items-center bg-black/20">
                            <Play
                              className="size-4 fill-white text-white"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-ink">
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {item.description}
                          </span>
                        )}
                      </span>
                    </button>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <AdminTypeBadge type={item.media_type} />
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-muted md:table-cell">
                    {formatMediaDate(item.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <RowAction
                        label={`Pratinjau ${item.title}`}
                        onClick={() => onPreview(item)}
                      >
                        <Eye className="size-4" aria-hidden="true" />
                      </RowAction>
                      <RowAction label={`Edit ${item.title}`} onClick={() => onEdit(item)}>
                        <Pencil className="size-4" aria-hidden="true" />
                      </RowAction>
                      <RowAction
                        label={`Hapus ${item.title}`}
                        onClick={() => onDelete(item)}
                        danger
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </RowAction>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
