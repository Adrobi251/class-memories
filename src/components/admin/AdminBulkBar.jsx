import { Trash2 } from 'lucide-react'

export default function AdminBulkBar({ count, busy, onDelete, onClear }) {
  if (!count) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[250] border-t border-white/10 bg-surface/95 backdrop-blur-xl lg:left-64">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p role="status" aria-live="polite" className="text-sm text-ink">
          <span className="font-semibold tabular-nums">{count}</span> dokumentasi dipilih
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClear}
            disabled={busy}
            className="min-h-11 flex-1 rounded-full border border-line px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:border-ink disabled:opacity-60 sm:flex-none"
          >
            Batal pilih
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            aria-busy={busy}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-signal px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-signal-dark disabled:opacity-60 sm:flex-none"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            {busy ? 'Menghapus...' : 'Hapus terpilih'}
          </button>
        </div>
      </div>
    </div>
  )
}
