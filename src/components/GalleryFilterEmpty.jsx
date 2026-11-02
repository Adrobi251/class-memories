import { ImageOff, RotateCcw } from 'lucide-react'

export default function GalleryFilterEmpty({ filter, onReset }) {
  return (
    <div
      role="status"
      className="flex flex-col items-start gap-4 rounded-lg border border-line bg-paper px-6 py-10"
    >
      <span className="grid size-12 place-items-center rounded-lg bg-paper-soft">
        <ImageOff className="size-5 text-muted" aria-hidden="true" />
      </span>
      <div>
        <p className="text-base font-semibold">
          {filter === 'video' ? 'Belum ada video di arsip.' : 'Belum ada foto di arsip.'}
        </p>
        <p className="mt-1 max-w-[46ch] text-sm text-muted">
          Coba tampilkan semua dokumentasi atau pilih jenis media lain.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border-[1.5px] border-ink px-4 text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-200 hover:bg-ink hover:text-white"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Tampilkan semua
      </button>
    </div>
  )
}
