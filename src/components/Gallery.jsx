import { useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, RefreshCw } from 'lucide-react'
import Modal from './Modal'
import GalleryCard from './GalleryCard'
import GalleryEmpty from './GalleryEmpty'
import GalleryFilterEmpty from './GalleryFilterEmpty'
import GallerySkeleton from './GallerySkeleton'
import GalleryToolbar from './GalleryToolbar'
import MediaPreview from './MediaPreview'

const PAGE_SIZE = 9
const LOAD_STEP = 6

export default function Gallery({
  media,
  loading,
  error,
  onRetry,
  filter,
  onFilterChange,
}) {
  const [selectedId, setSelectedId] = useState(null)
  const [limitState, setLimitState] = useState({ filter, limit: PAGE_SIZE })

  // A new filter always starts from the top of its own result set.
  const limit = limitState.filter === filter ? limitState.limit : PAGE_SIZE

  const counts = useMemo(() => {
    const foto = media.filter((item) => item.media_type === 'foto').length
    return {
      semua: media.length,
      foto,
      video: media.length - foto,
    }
  }, [media])

  const filtered = useMemo(() => {
    if (filter === 'foto' || filter === 'video') {
      return media.filter((item) => item.media_type === filter)
    }
    return media
  }, [filter, media])

  const selectedIndex = filtered.findIndex((item) => item.id === selectedId)
  const visible = filtered.slice(0, limit)
  const remaining = Math.max(0, filtered.length - visible.length)
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null

  useEffect(() => {
    if (!selectedId || selectedIndex < 0 || filtered.length < 2) return

    function onKeyDown(event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      const offset = event.key === 'ArrowLeft' ? -1 : 1
      const nextIndex = (selectedIndex + offset + filtered.length) % filtered.length
      setSelectedId(filtered[nextIndex].id)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [filtered, selectedId, selectedIndex])

  function showRelative(offset) {
    if (!filtered.length) return
    const nextIndex = (selectedIndex + offset + filtered.length) % filtered.length
    setSelectedId(filtered[nextIndex].id)
  }

  if (loading) return <GallerySkeleton />

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-4 rounded-2xl border border-signal/60 bg-paper-soft px-6 py-8"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-signal-bright">
            Galeri gagal dimuat
          </p>
          <p className="mt-2 max-w-[52ch] text-sm text-muted">{error.message}</p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Coba lagi
          </button>
        )}
      </div>
    )
  }

  if (!media.length) {
    return <GalleryEmpty />
  }

  return (
    <>
      <GalleryToolbar
        filter={filter}
        onChange={onFilterChange}
        counts={counts}
        visible={visible.length}
        total={filtered.length}
      />

      {filtered.length === 0 ? (
        <GalleryFilterEmpty
          filter={filter}
          onReset={() => onFilterChange?.('semua')}
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-12">
            {visible.map((item, index) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={index}
                onOpen={(next) => setSelectedId(next.id)}
              />
            ))}
          </div>

          {remaining > 0 && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setLimitState({ filter, limit: limit + LOAD_STEP })
                }
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft active:translate-y-0"
              >
                Lihat Lebih Banyak
                <ArrowDownRight className="size-4" aria-hidden="true" />
              </button>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
                {remaining} dokumentasi lagi
              </p>
            </div>
          )}
        </>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected?.title ?? 'Arsip'}
        wide
      >
        {selected && (
          <MediaPreview
            key={selected.id}
            item={selected}
            position={selectedIndex + 1}
            total={filtered.length}
            onPrev={() => showRelative(-1)}
            onNext={() => showRelative(1)}
          />
        )}
      </Modal>
    </>
  )
}
