import { useId, useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import Modal from './Modal'
import MediaTypeToggle from './MediaTypeToggle'
import FileDropzone from './FileDropzone'
import { supabase, MEDIA_BUCKET } from '../lib/supabase'

const MAX_PHOTO_MB = 10
const MAX_VIDEO_MB = 50

const inputClass =
  'w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted transition-colors duration-200 focus:border-signal'

const labelClass = 'mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted'

function safeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function UploadModal({ open, onClose, onUploaded }) {
  const fileId = useId()
  const thumbnailId = useId()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('foto')
  const [file, setFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function reset() {
    setTitle('')
    setDescription('')
    setType('foto')
    setFile(null)
    setThumbnail(null)
    setError('')
  }

  function handleClose() {
    if (loading) return
    reset()
    onClose()
  }

  function handleTypeChange(nextType) {
    setType(nextType)
    setFile(null)
    setThumbnail(null)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!file) {
      setError('Pilih file foto atau video dulu.')
      return
    }

    const maxMb = type === 'foto' ? MAX_PHOTO_MB : MAX_VIDEO_MB
    if (file.size > maxMb * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxMb} MB.`)
      return
    }

    setError('')
    setLoading(true)

    try {
      const stamp = Date.now()
      const path = `${type}/${stamp}-${safeName(file.name)}`

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadError) throw uploadError

      let thumbnailPath = null
      if (type === 'video' && thumbnail) {
        const thumbPath = `thumbnails/${stamp}-${safeName(thumbnail.name)}`
        const { error: thumbError } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(thumbPath, thumbnail, { cacheControl: '3600', upsert: false })
        if (thumbError) throw thumbError
        thumbnailPath = thumbPath
      }

      const { error: insertError } = await supabase.from('media').insert({
        title: title.trim(),
        description: description.trim() || null,
        media_type: type,
        storage_path: path,
        thumbnail_path: thumbnailPath,
      })
      if (insertError) throw insertError

      reset()
      onUploaded?.()
      onClose()
    } catch (err) {
      setError(err.message ?? 'Upload gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Upload Dokumentasi">
      <form onSubmit={handleSubmit} className="space-y-4">
        <MediaTypeToggle value={type} onChange={handleTypeChange} />

        <label className="block">
          <span className={labelClass}>Judul</span>
          <input
            type="text"
            required
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Contoh: Study Tour Bandung"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className={labelClass}>Deskripsi (opsional)</span>
          <textarea
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ceritakan momennya..."
            className={`${inputClass} resize-none`}
          />
        </label>

        <FileDropzone
          id={fileId}
          accept={type === 'foto' ? 'image/*' : 'video/*'}
          file={file}
          label={`Pilih file ${type}`}
          hint={`Maks ${type === 'foto' ? MAX_PHOTO_MB : MAX_VIDEO_MB} MB`}
          onChange={(nextFile) => {
            setFile(nextFile)
            setError('')
          }}
        />

        {type === 'video' && (
          <FileDropzone
            id={thumbnailId}
            accept="image/*"
            file={thumbnail}
            label="Thumbnail video (opsional)"
            hint="JPG atau PNG"
            icon={ImageIcon}
            surface="paper"
            onChange={setThumbnail}
          />
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-signal bg-paper px-3 py-2 text-sm text-signal"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="min-h-11 w-full rounded-lg bg-signal text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark active:translate-y-0 disabled:translate-y-0 disabled:opacity-60"
        >
          {loading ? 'Mengunggah...' : 'Upload'}
        </button>
      </form>
    </Modal>
  )
}
