import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ImageOff, Play, Trash2, Upload } from 'lucide-react'
import Modal from './Modal'
import { getPublicUrl, MEDIA_BUCKET, supabase } from '../lib/supabase'

const SPANS = [
  'md:col-span-7',
  'md:col-span-5',
  'md:col-span-5',
  'md:col-span-7',
  'md:col-span-4',
  'md:col-span-8',
]

const RATIOS = [
  'aspect-[4/3]',
  'aspect-[4/3]',
  'aspect-[4/3]',
  'aspect-[4/3]',
  'aspect-[3/4]',
  'aspect-[16/9]',
]

function Thumbnail({ item }) {
  const thumb = getPublicUrl(item.thumbnail_path)
  const src = getPublicUrl(item.storage_path)

  if (item.media_type === 'video') {
    return thumb ? (
      <img src={thumb} alt={item.title} className="size-full object-cover" loading="lazy" />
    ) : (
      <span className="grid size-full place-items-center bg-deep-blue">
        <Play className="size-10 text-white" aria-hidden="true" />
      </span>
    )
  }

  return <img src={src} alt={item.title} className="size-full object-cover" loading="lazy" />
}

export default function Gallery({ media, loading, error, isAdmin, onChanged, onUploadClick }) {
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
      window.alert(err.message ?? 'Gagal menghapus dokumentasi.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div
        className="grid gap-4 md:grid-cols-12"
        aria-busy="true"
        aria-label="Memuat galeri"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`${SPANS[index % SPANS.length]} overflow-hidden rounded-lg border border-line bg-paper`}
          >
            <div className={`skeleton w-full ${RATIOS[index % RATIOS.length]}`} />
            <div className="border-t border-line px-4 py-3">
              <div className="skeleton h-2.5 w-20" />
              <div className="skeleton mt-2 h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

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
    return (
      <div className="flex flex-col items-start gap-5 rounded-lg border border-line bg-paper px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-signal">
            <ImageOff className="size-5 text-white" aria-hidden="true" />
          </span>
          <div>
            <p className="text-base font-semibold">Arsip masih kosong.</p>
            <p className="mt-1 max-w-[46ch] text-sm text-muted">
              {isAdmin
                ? 'Mulai dokumentasi dengan mengunggah foto atau video pertama.'
                : 'Admin belum mengunggah foto atau video. Cek lagi nanti.'}
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={onUploadClick}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-signal px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark"
          >
            <Upload className="size-4" aria-hidden="true" />
            Upload
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <motion.div layout className="grid gap-4 md:grid-cols-12">
        <AnimatePresence mode="popLayout">
          {media.map((item, index) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`${SPANS[index % SPANS.length]} group relative overflow-hidden rounded-lg border border-line bg-paper shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:-translate-y-0.5`}
            >
              <button
                type="button"
                onClick={() => setSelected(item)}
                className="block w-full text-left"
                aria-label={`Buka ${item.media_type}: ${item.title}`}
              >
                <span className={`relative block w-full overflow-hidden ${RATIOS[index % RATIOS.length]}`}>
                  <Thumbnail item={item} />
                  {item.media_type === 'video' && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-12 place-items-center rounded-lg bg-signal transition-transform duration-200 group-hover:scale-105">
                        <Play className="ml-0.5 size-5 fill-white text-white" aria-hidden="true" />
                      </span>
                    </span>
                  )}
                </span>

                <span className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                      {item.media_type === 'video' ? 'Video' : 'Foto'} /{' '}
                      {new Date(item.created_at).getFullYear()}
                    </span>
                    <span className="mt-1 block truncate text-sm font-semibold">
                      {item.title}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                  className="absolute right-3 top-3 z-10 rounded-lg border border-line bg-paper p-2 text-ink transition-colors duration-200 hover:border-signal hover:bg-signal hover:text-white disabled:opacity-60"
                  aria-label={`Hapus ${item.title}`}
                  aria-busy={deleting === item.id}
                >
                  {deleting === item.id ? (
                    <span className="block size-3 animate-pulse bg-signal" aria-hidden="true" />
                  ) : (
                    <Trash2 className="size-4" aria-hidden="true" />
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
        title={selected?.title ?? 'Arsip'}
        wide
      >
        {selected && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-line bg-paper-soft">
              {selected.media_type === 'video' ? (
                <video
                  src={getPublicUrl(selected.storage_path)}
                  controls
                  autoPlay
                  className="max-h-[65vh] w-full bg-ink"
                />
              ) : (
                <img
                  src={getPublicUrl(selected.storage_path)}
                  alt={selected.title}
                  className="max-h-[65vh] w-full object-contain"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <span>{selected.media_type}</span>
              <span>
                {new Date(selected.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            {selected.description && (
              <p className="text-sm leading-relaxed text-muted">{selected.description}</p>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}


