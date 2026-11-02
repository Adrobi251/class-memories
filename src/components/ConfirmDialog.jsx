import { AlertTriangle, Trash2 } from 'lucide-react'
import Modal from './Modal'

const TYPE_LABEL = {
  foto: 'Foto',
  video: 'Video',
}

export default function ConfirmDialog({ open, item, busy, error, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Hapus dokumentasi?">
      <div className="space-y-4">
        <p className="flex items-start gap-2 border-l-2 border-signal bg-paper-soft px-3 py-2 text-sm text-muted">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-signal-bright" aria-hidden="true" />
          Tindakan ini permanen. File dan data dokumentasi akan dihapus dari arsip.
        </p>

        {item && (
          <div className="rounded-xl border border-line bg-paper px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {TYPE_LABEL[item.media_type] ?? 'Media'}
            </p>
            <p className="mt-1 break-words text-sm font-semibold text-ink">{item.title}</p>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-signal-bright/60 bg-signal/10 px-3 py-2 text-sm text-signal-bright"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="min-h-11 rounded-full border-[1.5px] border-line px-5 text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            aria-busy={busy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-signal px-5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-signal-dark disabled:opacity-60"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            {busy ? 'Menghapus...' : 'Hapus permanen'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
