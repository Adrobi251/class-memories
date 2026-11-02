import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Modal from './Modal'
import GalleryCard from './GalleryCard'
import GalleryEmpty from './GalleryEmpty'
import GallerySkeleton from './GallerySkeleton'
import MediaPreview from './MediaPreview'
import { MEDIA_BUCKET, supabase } from '../lib/supabase'

export default function Gallery({ media, loading, error, isAdmin, onDeleted, onUploadClick }) {
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(null)

  async function handleDelete(item) {
    if (!window.confirm(`Hapus "${item.title}"? Tindakan ini tidak bisa dibatalkan.`)) return

    setDeleting(item.id)
    try {
      const paths = [item.storage_path, item.thumbnail_path].filter(Boolean)
      if (paths.length) {
        await supabase.storage.from(MEDIA_BUCKET).remove(paths)
      }
      const { error: deleteError } = await supabase.from('media').delete().eq('id', item.id)
      if (deleteError) throw deleteError
      onDeleted?.()
    } catch (err) {
      window.alert(err.message ?? 'Gagal menghapus dokumentasi.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <GallerySkeleton />

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-signal bg-paper p-6 text-sm text-signal"
      >
        Gagal memuat galeri: {error.message}
      </div>
    )
  }

  if (!media.length) {
    return <GalleryEmpty isAdmin={isAdmin} onUploadClick={onUploadClick} />
  }

  return (
    <>
      <motion.div layout className="grid gap-4 md:grid-cols-12">
        <AnimatePresence mode="popLayout">
          {media.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              isAdmin={isAdmin}
              deleting={deleting === item.id}
              onOpen={setSelected}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title ?? 'Arsip'}
        wide
      >
        {selected && <MediaPreview item={selected} />}
      </Modal>
    </>
  )
}
