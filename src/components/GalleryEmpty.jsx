import { ImageOff, Upload } from 'lucide-react'

export default function GalleryEmpty({ isAdmin, onUploadClick }) {
  return (
    <div
      role="status"
      className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-paper-soft px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-signal">
          <ImageOff className="size-5 text-white" aria-hidden="true" />
        </span>
        <div>
          <p className="text-base font-semibold">Arsip masih kosong.</p>
          <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-muted">
            {isAdmin
              ? 'Mulai dokumentasi dengan mengunggah foto atau video pertama.'
              : 'Admin belum mengunggah foto atau video. Cek lagi nanti.'}
          </p>
        </div>
      </div>

      {isAdmin && (
        <button
          type="button"
          onClick={onUploadClick}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-signal px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-bright active:translate-y-0"
        >
          <Upload className="size-4" aria-hidden="true" />
          Upload
        </button>
      )}
    </div>
  )
}
