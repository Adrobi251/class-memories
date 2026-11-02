import { useState } from 'react'
import { FileVideo, Image as ImageIcon, Loader2, UploadCloud } from 'lucide-react'
import Modal from './Modal'
import { supabase, MEDIA_BUCKET } from '../lib/supabase'

const MAX_PHOTO_MB = 10
const MAX_VIDEO_MB = 50

function safeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function UploadModal({ open, onClose, onUploaded }) {
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

  async function handleSubmit(e) {
    e.preventDefault()
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
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'foto', label: 'Foto', icon: ImageIcon },
            { value: 'video', label: 'Video', icon: FileVideo },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setType(value)
                setFile(null)
                setThumbnail(null)
              }}
              className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition ${
                type === value
                  ? 'border-violet-500 bg-violet-500/15 text-violet-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-300">Judul</span>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Study Tour Bandung"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-violet-500"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-300">
            Deskripsi <span className="text-slate-600">(opsional)</span>
          </span>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ceritakan momennya..."
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-violet-500"
          />
        </label>

        <label className="block cursor-pointer rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-center transition hover:border-violet-500/60 hover:bg-white/10">
          <UploadCloud className="mx-auto mb-2 size-6 text-violet-400" />
          <span className="block text-sm font-medium text-slate-300">
            {file ? file.name : `Pilih file ${type}`}
          </span>
          <span className="mt-1 block text-xs text-slate-500">
            Maks {type === 'foto' ? MAX_PHOTO_MB : MAX_VIDEO_MB} MB
          </span>
          <input
            type="file"
            required
            accept={type === 'foto' ? 'image/*' : 'video/*'}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </label>

        {type === 'video' && (
          <label className="block cursor-pointer rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-4 text-center transition hover:border-violet-500/60">
            <ImageIcon className="mx-auto mb-1.5 size-5 text-slate-400" />
            <span className="block text-sm text-slate-300">
              {thumbnail ? thumbnail.name : 'Thumbnail video (opsional)'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </label>
        )}

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold transition hover:bg-violet-500 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Mengupload...' : 'Upload'}
        </button>
      </form>
    </Modal>
  )
}
