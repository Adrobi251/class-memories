import { useEffect, useRef } from 'react'
import {
  ArrowDownWideNarrow,
  ChevronDown,
  Images,
  LayoutGrid,
  List,
  Play,
  Search,
  X,
} from 'lucide-react'

const FILTERS = [
  { value: 'semua', label: 'Semua', icon: LayoutGrid },
  { value: 'foto', label: 'Foto', icon: Images },
  { value: 'video', label: 'Video', icon: Play },
]

const SORTS = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'terlama', label: 'Terlama' },
  { value: 'judul', label: 'Judul A-Z' },
]

function SelectAll({ checked, indeterminate, disabled, onChange }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="size-4 cursor-pointer accent-[#bbd5da] disabled:cursor-not-allowed disabled:opacity-50"
      />
      Pilih semua
    </label>
  )
}

export default function AdminMediaToolbar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  counts,
  sort,
  onSortChange,
  view,
  onViewChange,
  visible,
  total,
  allSelected,
  someSelected,
  onToggleSelectAll,
}) {
  return (
    <div className="space-y-4 border-y border-white/10 py-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Cari dokumentasi</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Cari judul atau deskripsi..."
            className="h-12 w-full rounded-full border border-white/15 bg-white/[0.03] pl-11 pr-12 text-sm text-ink placeholder:text-muted transition-colors duration-200 focus:border-accent-soft"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Hapus pencarian"
              className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-white/10 hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Urutkan dokumentasi</span>
            <ArrowDownWideNarrow
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <select
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
              className="h-12 appearance-none rounded-full border border-white/15 bg-white/[0.03] pl-11 pr-9 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 focus:border-accent-soft"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value} className="bg-paper text-ink">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
          </label>

          <div
            role="group"
            aria-label="Tampilan daftar"
            className="flex h-12 items-center gap-1 rounded-full border border-white/15 bg-white/[0.03] p-1"
          >
            <button
              type="button"
              onClick={() => onViewChange('grid')}
              aria-pressed={view === 'grid'}
              aria-label="Tampilan grid"
              className={`grid size-10 place-items-center rounded-full transition-colors duration-200 ${
                view === 'grid' ? 'bg-accent-soft text-paper' : 'text-muted hover:text-ink'
              }`}
            >
              <LayoutGrid className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange('list')}
              aria-pressed={view === 'list'}
              aria-label="Tampilan daftar"
              className={`grid size-10 place-items-center rounded-full transition-colors duration-200 ${
                view === 'list' ? 'bg-accent-soft text-paper' : 'text-muted hover:text-ink'
              }`}
            >
              <List className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter jenis dokumentasi" className="flex flex-wrap gap-2">
          {FILTERS.map(({ value, label, icon: Icon }) => {
            const active = filter === value
            const count = counts[value] ?? 0

            return (
              <button
                key={value}
                type="button"
                onClick={() => onFilterChange(value)}
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

        <div className="flex flex-wrap items-center gap-4 sm:justify-end">
          <SelectAll
            checked={allSelected}
            indeterminate={someSelected}
            disabled={total === 0}
            onChange={onToggleSelectAll}
          />
          <p
            aria-live="polite"
            className="text-[10px] uppercase tracking-[0.2em] text-muted"
          >
            Tampil{' '}
            <span className="tabular-nums text-ink">{String(visible).padStart(2, '0')}</span> /{' '}
            <span className="tabular-nums">{String(total).padStart(2, '0')}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
