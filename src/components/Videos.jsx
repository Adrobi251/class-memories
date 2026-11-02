import { useMemo, useState } from 'react'
import { ArrowRight, Clapperboard, Play } from 'lucide-react'
import MediaThumbnail from './MediaThumbnail'
import MediaPreview from './MediaPreview'
import Modal from './Modal'
import Reveal from './Reveal'

const MAX_ITEMS = 6

function formatDate(value) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function Videos({ media = [], loading, onShowAll }) {
  const [selectedId, setSelectedId] = useState(null)

  const videos = useMemo(
    () => media.filter((item) => item.media_type === 'video'),
    [media],
  )

  const shown = videos.slice(0, MAX_ITEMS)
  const selectedIndex = videos.findIndex((item) => item.id === selectedId)
  const selected = selectedIndex >= 0 ? videos[selectedIndex] : null

  function showRelative(offset) {
    if (!videos.length) return
    const nextIndex = (selectedIndex + offset + videos.length) % videos.length
    setSelectedId(videos[nextIndex].id)
  }

  return (
    <section
      id="videos"
      aria-labelledby="videos-title"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/10 bg-paper-soft py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 size-[420px] rounded-full bg-accent-soft/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent-soft">
              <span aria-hidden="true" className="h-px w-8 bg-accent-soft/60" />
              Galeri video
            </p>
            <h2
              id="videos-title"
              tabIndex={-1}
              className="mt-4 max-w-[18ch] font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.015em]"
            >
              Gerak yang tidak bisa difoto.
            </h2>
          </div>

          <p className="max-w-[38ch] text-sm leading-relaxed text-muted">
            Rekaman singkat dari hari-hari yang ingin kita ingat lagi. Semua video
            diunggah dan dikurasi oleh admin.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/10 bg-paper"
              >
                <div className="skeleton aspect-video w-full" />
              </div>
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div
            role="status"
            className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-paper px-6 py-10"
          >
            <span className="grid size-12 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
              <Clapperboard className="size-5 text-muted" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold">Belum ada video di arsip.</p>
              <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-muted">
                Video pertama akan muncul di sini setelah admin mengunggahnya.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`mt-12 grid gap-4 sm:grid-cols-2 ${
                shown.length < 3 ? '' : 'lg:grid-cols-3'
              }`}
            >
              {shown.map((item, index) => (
                <Reveal
                  as="article"
                  key={item.id}
                  delay={index * 40}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-paper"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-label={`Putar video: ${item.title}`}
                    aria-haspopup="dialog"
                    className="relative block aspect-video w-full"
                  >
                    <span className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                      <MediaThumbnail item={item} />
                    </span>
                    <span aria-hidden="true" className="photo-scrim absolute inset-0" />
                    <span className="pointer-events-none absolute inset-0 grid place-items-center">
                      <span className="grid size-14 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                        <Play
                          className="ml-0.5 size-5 fill-white text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </button>

                  <div className="flex items-end justify-between gap-3 px-4 py-4">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
                        {formatDate(item.created_at)}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold" title={item.title}>
                        {item.title}
                      </p>
                    </div>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </Reveal>
              ))}
            </div>

            {videos.length > MAX_ITEMS && onShowAll && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={onShowAll}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
                >
                  Lihat semua video
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected?.title ?? 'Video'}
        wide
      >
        {selected && (
          <MediaPreview
            key={selected.id}
            item={selected}
            position={selectedIndex + 1}
            total={videos.length}
            onPrev={() => showRelative(-1)}
            onNext={() => showRelative(1)}
          />
        )}
      </Modal>
    </section>
  )
}
