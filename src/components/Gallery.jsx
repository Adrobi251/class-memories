import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ImageOff, Loader2, Play, Trash2 } from 'lucide-react'
import Modal from './Modal'
import { getPublicUrl, MEDIA_BUCKET, supabase } from '../lib/supabase'

function Thumbnail({ item }) {
  const thumb = getPublicUrl(item.thumbnail_path)
  const src = getPublicUrl(item.storage_path)

  if (item.media_type === 'video') {
    return thumb ? (
      <img src={thumb} alt={item.title} className="size-full object-cover" loading="lazy" />
    ) : (
      <div className="grid size-full place-items-center bg-gradient-to-br from-slate-800 to-slate-900">
        <Play className="size-10 text-violet-400" />
      </div>
    )
  }

  return <img src={src} alt={item.title} className="size-full object-cover" loading="lazy" />
}

export default function Gallery({ media, loading, error, isAdmin, onChanged }) {
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
      onChanged?.()
    } catch (err) {
      window.alert(err.message ?? 'Gagal menghapus.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-20 text-slate-500">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-400">
        Gagal memuat galeri: {error.message}
      </div>
    )
  }

  if (!media.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
        <ImageOff className="mx-auto mb-3 size-8 text-slate-700" />
        <p className="text-sm text-slate-400">Belum ada dokumentasi.</p>
        <p className="mt-1 text-xs text-slate-600">
          {isAdmin
            ? 'Klik tombol Upload untuk menambahkan foto atau video pertama.'
            : 'Admin belum mengupload foto atau video.'}
        </p>
      </div>
    )
  }

  return (
    <>
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {media.map((item) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <button
                type="button"
                onClick={() => setSelected(item)}
                className="absolute inset-0"
                aria-label={`Lihat ${item.title}`}
              >
                <Thumbnail item={item} />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
                {item.media_type === 'video' && (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-12 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:scale-110 group-hover:bg-violet-600">
                      <Play className="ml-0.5 size-5 fill-white" />
                    </span>
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 p-4 text-left">
                  <span className="block truncate text-sm font-semibold text-white">
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="mt-0.5 block truncate text-xs text-slate-300">
                      {item.description}
                    </span>
                  )}
                </span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                  className="absolute right-3 top-3 rounded-full bg-slate-950/70 p-2 text-slate-300 opacity-0 backdrop-blur transition hover:bg-red-600 hover:text-white focus:opacity-100 group-hover:opacity-100"
                  aria-label={`Hapus ${item.title}`}
                >
                  {deleting === item.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title ?? 'Preview'}
        wide
      >
        {selected && (
          <div className="space-y-3">
            {selected.media_type === 'video' ? (
              <video
                src={getPublicUrl(selected.storage_path)}
                controls
                autoPlay
                className="max-h-[70vh] w-full rounded-xl bg-black"
              />
            ) : (
              <img
                src={getPublicUrl(selected.storage_path)}
                alt={selected.title}
                className="max-h-[70vh] w-full rounded-xl object-contain"
              />
            )}
            {selected.description && (
              <p className="text-sm text-slate-400">{selected.description}</p>
            )}
            <p className="text-xs text-slate-600">
              Diupload {new Date(selected.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}
