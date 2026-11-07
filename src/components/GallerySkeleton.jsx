const PLACEHOLDERS = [
  'aspect-[4/3]',
  'aspect-[3/4]',
  'aspect-square',
  'aspect-[4/3]',
  'aspect-[3/4]',
  'aspect-[16/9]',
]

export default function GallerySkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Memuat galeri"
      className="columns-1 gap-4 sm:columns-2 lg:columns-3"
    >
      <span className="sr-only">Memuat galeri...</span>
      {PLACEHOLDERS.map((ratio, index) => (
        <div
          key={index}
          className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-paper-soft"
        >
          <div className={`skeleton w-full ${ratio}`} />
        </div>
      ))}
    </div>
  )
}
