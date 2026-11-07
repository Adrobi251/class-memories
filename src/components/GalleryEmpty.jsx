import { ImageOff } from 'lucide-react'

export default function GalleryEmpty() {
  return (
    <div
      role="status"
      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-paper-soft px-6 py-8 md:px-8"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-signal">
        <ImageOff className="size-5 text-white" aria-hidden="true" />
      </span>
      <div>
        <p className="text-base font-semibold">Arsip masih kosong.</p>
        <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-muted">
          Admin belum mengunggah foto atau video. Cek lagi nanti.
        </p>
      </div>
    </div>
  )
}
