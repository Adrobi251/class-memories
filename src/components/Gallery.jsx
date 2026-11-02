import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RefreshCw } from 'lucide-react'
import Modal from './Modal'
import ConfirmDialog from './ConfirmDialog'
import GalleryCard from './GalleryCard'
import GalleryEmpty from './GalleryEmpty'
import GalleryFilterEmpty from './GalleryFilterEmpty'
import GallerySkeleton from './GallerySkeleton'
import GalleryStrip from './GalleryStrip'
import GalleryToolbar from './GalleryToolbar'
import MediaPreview from './MediaPreview'
import { MEDIA_BUCKET, supabase } from '../lib/supabase'

export default function Gallery({
  media,
  loading,
  error,
  isAdmin,
  onDeleted,
  onUploadClick,
  onRetry,
}) {
  const [filter, setFilter] = useState('semua')
  const [selectedId, setSelectedId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const gridRef = useRef(null)
  const refocusAfterDelete = useRef(null)

  const counts = useMemo(() => {
    const foto = media.filter((item) => item.media_type === 'foto').length
    return { semua: media.length, foto, video: media.length - foto }
  }, [media])

  const filtered = useMemo(
    () =>
      filter === 'semua'
        ? media
        : media.filter((item) => item.media_type === filter),
    [filter, media],
  )

  const selectedIndex = filtered.findIndex((item) => item.id === selectedId)
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
      document.getElementById('galeri-title')
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
      setDeleteError(err.message ?? 'Gagal menghapus dokumentasi.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <GallerySkeleton />

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-4 rounded-lg border border-signal bg-paper px-6 py-8"
      >
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
            Galeri gagal dimuat
          </p>
          <p className="mt-1 max-w-[52ch] text-sm text-muted">{error.message}</p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border-[1.5px] border-ink px-4 text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-200 hover:bg-ink hover:text-white"
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
      <GalleryStrip
        media={media}
        onOpen={(item) => {
          setFilter('semua')
          setSelectedId(item.id)
        }}
      />

      <GalleryToolbar
        filter={filter}
        onChange={setFilter}
        counts={counts}
        visible={filtered.length}
        total={media.length}
      />

      {filtered.length === 0 ? (
        <GalleryFilterEmpty filter={filter} onReset={() => setFilter('semua')} />
      ) : (
        <motion.div ref={gridRef} layout className="grid gap-4 md:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
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
          </AnimatePresence>
        </motion.div>
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

