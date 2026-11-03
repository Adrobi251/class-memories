import { ImageOff, RotateCcw } from 'lucide-react'

const COPY = {
  foto: {
    title: 'Belum ada foto di arsip.',
    body: 'Coba tampilkan semua dokumentasi atau pilih jenis media lain.',
  },
  video: {
    title: 'Belum ada video di arsip.',
    body: 'Coba tampilkan semua dokumentasi atau pilih jenis media lain.',
  },
}

export default function GalleryFilterEmpty({ filter, onReset }) {
  const copy = COPY[filter] ?? COPY.foto

  return (
    <div
      role="status"
      className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-paper-soft px-6 py-10"
    >
      <span className="grid size-12 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
        <ImageOff className="size-5 text-muted" aria-hidden="true" />
      </span>
      <div>
        <p className="text-base font-semibold">{copy.title}</p>
        <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-muted">{copy.body}</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Tampilkan semua
      </button>
    </div>
  )
}
