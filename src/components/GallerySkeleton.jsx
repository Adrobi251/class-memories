import { galleryLayout } from '../lib/galleryLayout'

const PLACEHOLDERS = [0, 1, 2, 3]

export default function GallerySkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Memuat galeri"
      className="grid gap-4 md:grid-cols-12"
    >
      <span className="sr-only">Memuat galeri...</span>
      {PLACEHOLDERS.map((index) => {
        const { span, ratio } = galleryLayout(index)
        return (
          <div
            key={index}
            className={`${span} overflow-hidden rounded-2xl border border-white/10 bg-paper-soft`}
          >
            <div className={`skeleton w-full ${ratio}`} />
          </div>
        )
      })}
    </div>
  )
}
