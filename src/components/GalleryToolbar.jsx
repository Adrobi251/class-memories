import { Image as ImageIcon, LayoutGrid, Video } from 'lucide-react'

const FILTERS = [
  { value: 'semua', label: 'Semua', icon: LayoutGrid },
  { value: 'foto', label: 'Foto', icon: ImageIcon },
  { value: 'video', label: 'Video', icon: Video },
]

function Counter({ visible, total, className = '' }) {
  return (
    <p
      className={`font-mono text-[11px] uppercase tracking-[0.14em] text-muted ${className}`}
      aria-live="polite"
    >
      Menampilkan{' '}
      <span className="tabular-nums text-ink">{String(visible).padStart(2, '0')}</span> /{' '}
      <span className="tabular-nums">{String(total).padStart(2, '0')}</span>
    </p>
  )
}

export default function GalleryToolbar({ filter, onChange, counts, visible, total }) {
  return (
    <div className="mb-6 border-y border-line py-3">
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Filter
        </span>
        <Counter visible={visible} total={total} />
      </div>

      <div className="mt-2 flex items-center gap-2 sm:mt-0">
        <span className="mr-1 hidden font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:inline">
          Filter
        </span>

        <div
          role="group"
          aria-label="Filter jenis media"
          className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center"
        >
          {FILTERS.map(({ value, label, icon: Icon }) => {
            const active = filter === value
            const count = counts[value] ?? 0

            return (
              <button
                key={value}
                type="button"
                onClick={() => onChange(value)}
                aria-pressed={active}
                className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border px-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 sm:px-3 ${
                  active
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-paper text-muted hover:border-ink hover:text-ink'
                }`}
              >
                <Icon className="hidden size-3.5 sm:block" aria-hidden="true" />
                {label}
                <span className={`tabular-nums ${active ? 'text-white/70' : 'text-muted'}`}>
                  {String(count).padStart(2, '0')}
                </span>
              </button>
            )
          })}
        </div>

        <Counter visible={visible} total={total} className="ml-auto hidden shrink-0 sm:block" />
      </div>
    </div>
  )
}
