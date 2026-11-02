import { Images, LayoutGrid, Play, Sparkles } from 'lucide-react'

const GALLERY_FILTERS = [
  { value: 'semua', label: 'Semua', icon: LayoutGrid },
  { value: 'momen', label: 'Momen', icon: Sparkles },
  { value: 'foto', label: 'Foto', icon: Images },
  { value: 'video', label: 'Video', icon: Play },
]

function Counter({ visible, total, className = '' }) {
  return (
    <p
      className={`text-[10px] uppercase tracking-[0.22em] text-muted ${className}`}
      aria-live="polite"
    >
      Tampil{' '}
      <span className="tabular-nums text-ink">{String(visible).padStart(2, '0')}</span> /{' '}
      <span className="tabular-nums">{String(total).padStart(2, '0')}</span>
    </p>
  )
}

export default function GalleryToolbar({ filter, onChange, counts, visible, total }) {
  return (
    <div className="mb-8 flex flex-col gap-3 border-y border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="group"
        aria-label="Filter jenis dokumentasi"
        className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center"
      >
        {GALLERY_FILTERS.map(({ value, label, icon: Icon }) => {
          const active = filter === value
          const count = counts[value] ?? 0

          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              aria-pressed={active}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                active
                  ? 'border-accent-soft bg-accent-soft text-paper'
                  : 'border-white/15 bg-white/[0.03] text-ink/65 hover:border-white/35 hover:text-ink'
              }`}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
              <span className={`tabular-nums ${active ? 'text-paper/60' : 'text-muted'}`}>
                {String(count).padStart(2, '0')}
              </span>
            </button>
          )
        })}
      </div>

      <Counter visible={visible} total={total} className="sm:text-right" />
    </div>
  )
}
