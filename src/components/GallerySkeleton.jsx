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
            className={`${span} overflow-hidden rounded-lg border border-line bg-paper`}
          >
            <div className={`skeleton w-full ${ratio}`} />
            <div className="border-t border-line px-4 py-3">
              <div className="skeleton h-2.5 w-20" />
              <div className="skeleton mt-2 h-4 w-3/4" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
