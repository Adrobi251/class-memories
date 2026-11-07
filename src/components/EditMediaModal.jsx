import { useId, useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import Modal from './Modal'
import FileDropzone from './FileDropzone'
import { TYPE_LABEL, formatMediaError, saveMediaItem } from '../lib/media'
import { getPublicUrl } from '../lib/supabaseConfig'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted transition-colors duration-200 focus:border-signal'

const labelClass = 'mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted'

export default function EditMediaModal({ open, item, onClose, onSaved }) {
  const posterId = useId()
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description ?? '')
  const [poster, setPoster] = useState(null)
  const [posterBroken, setPosterBroken] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const nextTitle = title.trim()
  const nextDescription = description.trim()
  const changed =
    nextTitle !== item.title ||
    nextDescription !== (item.description ?? '') ||
    Boolean(poster)

  const posterUrl = getPublicUrl(item.thumbnail_path)

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving) return

    if (!nextTitle) {
      setError('Judul dokumentasi wajib diisi.')
      return
    }
    if (nextTitle.length > 120) {
      setError('Judul maksimal 120 karakter.')
      return
    }
    if (!changed) return

    setSaving(true)
    setError('')

    try {
      await saveMediaItem(item, {
        title: nextTitle,
        description: nextDescription,
        poster,
      })
      onSaved?.()
    } catch (err) {
      setError(formatMediaError(err, 'Gagal menyimpan perubahan.'))
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    if (saving) return
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Edit dokumentasi">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-line bg-paper-soft px-3.5 py-3">
          <span className="shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/70">
            {TYPE_LABEL[item.media_type] ?? 'Media'}
          </span>
          <p className="min-w-0 text-xs leading-relaxed text-muted">
            Perubahan langsung tampil di galeri publik setelah disimpan.
          </p>
        </div>

        <label className="block">
          <span className={labelClass}>Judul</span>
          <input
            type="text"
            required
            maxLength={120}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setError('')
            }}
            placeholder="Contoh: Study Tour Bandung"
            className={inputClass}
          />
          <span className="mt-1 block text-right text-[10px] tabular-nums text-muted">
            {title.length}/120
          </span>
        </label>

        <label className="block">
          <span className={labelClass}>Deskripsi (opsional)</span>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value)
              setError('')
            }}
            placeholder="Ceritakan momennya..."
            className={`${inputClass} resize-none`}
          />
        </label>

        {item.media_type === 'video' && (
          <div className="space-y-2">
            <span className={labelClass}>Poster video</span>

            <div className="flex items-center gap-3 rounded-xl border border-line bg-paper-soft px-3 py-3">
              {posterUrl && !posterBroken ? (
                <img
                  src={posterUrl}
                  alt={`Poster saat ini: ${item.title}`}
                  onError={() => setPosterBroken(true)}
                  className="h-16 w-24 shrink-0 rounded-lg border border-white/10 object-cover"
                />
              ) : (
                <span className="grid h-16 w-24 shrink-0 place-items-center rounded-lg border border-white/10 bg-paper text-muted">
                  <ImageIcon className="size-5" aria-hidden="true" />
                </span>
              )}
              <p className="min-w-0 text-xs leading-relaxed text-muted">
                Poster saat ini. Unggah gambar baru untuk menggantinya; file lama akan
                dibersihkan otomatis.
              </p>
            </div>

            <FileDropzone
              id={posterId}
              accept="image/*"
              file={poster}
              label="Ganti thumbnail video"
              hint="JPG, PNG, atau WebP"
              icon={ImageIcon}
              surface="paper"
              onChange={(next) => {
                setPoster(next)
                setError('')
              }}
            />
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-signal-bright/60 bg-signal/10 px-3 py-2 text-sm text-signal-bright"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="min-h-11 rounded-full border-[1.5px] border-line px-5 text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving || !changed}
            aria-busy={saving}
            className="min-h-11 rounded-full bg-signal px-5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-signal-dark disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Simpan perubahan'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
