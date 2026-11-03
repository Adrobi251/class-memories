import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownRight, RefreshCw } from 'lucide-react'
import Modal from './Modal'
import ConfirmDialog from './ConfirmDialog'
import GalleryCard from './GalleryCard'
import GalleryEmpty from './GalleryEmpty'
import GalleryFilterEmpty from './GalleryFilterEmpty'
import GallerySkeleton from './GallerySkeleton'
import GalleryToolbar from './GalleryToolbar'
import MediaPreview from './MediaPreview'

const PAGE_SIZE = 9
const LOAD_STEP = 6

function formatDeleteError(err) {
  if (!err) return 'Gagal menghapus dokumentasi. Coba lagi.'
  const msg = typeof err === 'string' ? err : err.message || ''
  if (/row-level security|permission denied|violates rls/i.test(msg)) {
    return 'Akses ditolak: Hanya admin yang berhak menghapus file. Pastikan sesi login masih aktif.'
  }
  if (/failed to fetch|networkerror/i.test(msg)) {
    return 'Koneksi terputus saat mencoba menghapus file. Periksa koneksi internet Anda.'
  }
  return msg || 'Gagal menghapus dokumentasi.'
}

export default function Gallery({
  media,
  loading,
  error,
  isAdmin,
  onDeleted,
  onUploadClick,
  onRetry,
  filter,
  onFilterChange,
}) {
  const [selectedId, setSelectedId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [limitState, setLimitState] = useState({ filter, limit: PAGE_SIZE })
  const gridRef = useRef(null)
  const refocusAfterDelete = useRef(null)

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

  useEffect(() => {
    const pending = refocusAfterDelete.current
    if (!pending || loading) return
    if (!error && media.some((item) => item.id === pending.id)) return

    refocusAfterDelete.current = null
    const target =
      gridRef.current?.querySelector('article button') ??
      document.getElementById('gallery-title')
    target?.focus()
  }, [error, loading, media])

  function showRelative(offset) {
    if (!filtered.length) return
    const nextIndex = (selectedIndex + offset + filtered.length) % filtered.length
    setSelectedId(filtered[nextIndex].id)
  }

  function requestDelete(item) {
    setDeleteError('')
    setPendingDelete(item)
  }

  async function confirmDelete() {
    if (!pendingDelete || deleting) return

    setDeleting(pendingDelete.id)
    setDeleteError('')

    try {
      const { MEDIA_BUCKET, supabase } = await import('../lib/supabase')
      const paths = [pendingDelete.storage_path, pendingDelete.thumbnail_path].filter(Boolean)
      if (paths.length) {
        await supabase.storage.from(MEDIA_BUCKET).remove(paths)
      }
      const { error: removeError } = await supabase
        .from('media')
        .delete()
        .eq('id', pendingDelete.id)
      if (removeError) throw removeError

      refocusAfterDelete.current = { id: pendingDelete.id }
      setPendingDelete(null)
      onDeleted?.()
    } catch (err) {
      setDeleteError(formatDeleteError(err))
    } finally {
      setDeleting(null)
    }
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
    return <GalleryEmpty isAdmin={isAdmin} onUploadClick={onUploadClick} />
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
          <div ref={gridRef} className="grid gap-4 md:grid-cols-12">
            {visible.map((item, index) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={index}
                isAdmin={isAdmin}
                deleting={deleting === item.id}
                onOpen={(next) => setSelectedId(next.id)}
                onDelete={requestDelete}
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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        item={pendingDelete}
        busy={Boolean(deleting)}
        error={deleteError}
        onClose={() => {
          if (deleting) return
          setPendingDelete(null)
          setDeleteError('')
        }}
        onConfirm={confirmDelete}
      />
    </>
  )
}
