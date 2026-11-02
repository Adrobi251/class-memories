import { ArrowUpRight, ImageOff, Play } from 'lucide-react'
import MediaThumbnail from './MediaThumbnail'

const TYPE_LABEL = { foto: 'Foto', video: 'Video' }

function formatMonth(value) {
  return new Date(value).toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  })
}

function TypeChip({ type }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-ink/85 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white">
      {type === 'video' && <Play className="size-2.5 fill-white" aria-hidden="true" />}
      {TYPE_LABEL[type] ?? 'Media'}
    </span>
  )
}

export default function HeroArchivePanel({ media = [] }) {
  const [featured, ...rest] = media
  const sideItems = rest.slice(0, 2)
  const photos = media.filter((item) => item.media_type === 'foto').length
  const videos = media.length - photos
  const updated = media[0]?.created_at

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
        <div className="h-1.5 bg-signal" aria-hidden="true" />

        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Arsip terbaru
          </p>
          <span className="rounded bg-ink px-2 py-1 font-mono text-[10px] tabular-nums uppercase tracking-[0.12em] text-white">
            {String(media.length).padStart(2, '0')} dokumen
          </span>
        </div>

        {featured ? (
          <div className="p-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-paper-soft">
              <MediaThumbnail item={featured} />
              <span className="absolute bottom-2 left-2">
                <TypeChip type={featured.media_type} />
              </span>
            </div>

            {sideItems.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {sideItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-square overflow-hidden rounded-lg bg-paper-soft"
                  >
                    <MediaThumbnail item={item} />
                    <span className="absolute bottom-1.5 left-1.5">
                      <TypeChip type={item.media_type} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="m-2 flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-cool bg-paper-soft px-6 text-center">
            <ImageOff className="size-6 text-muted" aria-hidden="true" />
            <p className="text-sm font-semibold text-ink">Belum ada dokumentasi</p>
            <p className="text-xs leading-relaxed text-muted">
              Pratinjau akan muncul setelah admin mengunggah foto atau video.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            <span className="tabular-nums text-ink">{String(photos).padStart(2, '0')}</span>{' '}
            foto /{' '}
            <span className="tabular-nums text-ink">{String(videos).padStart(2, '0')}</span>{' '}
            video
          </p>
          <a
            href="#galeri"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white"
          >
            Buka galeri
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <dl className="mt-3 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        <div className="bg-paper px-4 py-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Tahun ajaran
          </dt>
          <dd className="mt-1 text-sm font-semibold text-ink">2025 / 2026</dd>
        </div>
        <div className="bg-paper px-4 py-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Akses
          </dt>
          <dd className="mt-1 text-sm font-semibold text-ink">Publik baca</dd>
        </div>
        <div className="bg-paper px-4 py-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Diperbarui
          </dt>
          <dd className="mt-1 text-sm font-semibold text-ink">
            {updated ? formatMonth(updated) : 'Belum ada'}
          </dd>
        </div>
      </dl>
    </div>
  )
}
