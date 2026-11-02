import { useEffect, useMemo, useState } from 'react'
import { FileVideo, UploadCloud, X } from 'lucide-react'

function formatSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileDropzone({
  id,
  accept,
  file,
  label,
  hint,
  icon: Icon = UploadCloud,
  surface = 'soft',
  onChange,
}) {
  const [dragging, setDragging] = useState(false)
  const [brokenPreview, setBrokenPreview] = useState('')
  const [dropError, setDropError] = useState('')

  const preview = useMemo(() => {
    if (!file || !file.type.startsWith('image/')) return ''
    return URL.createObjectURL(file)
  }, [file])

  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  function acceptsFile(candidate) {
    if (!candidate) return false
    if (accept === 'image/*') return candidate.type.startsWith('image/')
    if (accept === 'video/*') return candidate.type.startsWith('video/')
    return true
  }

  function commitFile(next) {
    if (!next) return

    if (!acceptsFile(next)) {
      setDropError(accept === 'video/*' ? 'File harus berupa video.' : 'File harus berupa gambar.')
      return
    }

    setDropError('')
    onChange(next)
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    commitFile(event.dataTransfer.files?.[0])
  }

  const isImage = Boolean(file && file.type.startsWith('image/'))
  const PreviewIcon = file && file.type.startsWith('video/') ? FileVideo : Icon
  const surfaceClass = dragging
    ? 'bg-signal/5'
    : surface === 'soft'
      ? 'bg-paper-soft'
      : 'bg-paper'

  return (
    <div
      onDragEnter={() => setDragging(true)}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return
        setDragging(false)
      }}
      onDrop={handleDrop}
      className={`rounded-xl border border-dashed transition-colors duration-200 focus-within:border-signal focus-within:ring-2 focus-within:ring-signal/25 ${
        dragging ? 'border-signal ring-2 ring-signal/25' : 'border-cool hover:border-ink'
      } ${surfaceClass}`}
    >
      {file ? (
        <div className="flex items-center gap-3 px-3 py-3">
          <label htmlFor={id} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
            {isImage && preview && brokenPreview !== preview ? (
              <img
                src={preview}
                alt=""
                className="size-14 shrink-0 rounded-lg border border-line object-cover"
                onError={() => setBrokenPreview(preview)}
              />
            ) : (
              <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-paper text-muted">
                <PreviewIcon className="size-6" aria-hidden="true" />
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">{file.name}</span>
              <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                {formatSize(file.size)} / Klik untuk ganti
              </span>
            </span>
          </label>
          <button
            type="button"
            onClick={() => {
              setDropError('')
              onChange(null)
            }}
            aria-label={`Hapus file ${file.name}`}
            className="grid size-11 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`block cursor-pointer px-4 text-center ${surface === 'soft' ? 'py-6' : 'py-4'}`}
        >
          <Icon
            className={`mx-auto text-ink ${surface === 'soft' ? 'mb-2 size-6' : 'mb-1.5 size-5 text-muted'}`}
            aria-hidden="true"
          />
          <span className="block text-sm font-medium text-ink">{label}</span>
          {hint && (
            <span
              id={`${id}-hint`}
              className="mt-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted"
            >
              {hint}
            </span>
          )}
          <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            atau seret file ke sini
          </span>
        </label>
      )}

      <input
        id={id}
        type="file"
        accept={accept}
        onChange={(event) => {
          const next = event.target.files?.[0] ?? null
          event.target.value = ''
          if (next) commitFile(next)
        }}
        aria-describedby={!file && hint ? `${id}-hint` : undefined}
        className="sr-only"
      />

      {dropError && (
        <p role="alert" className="border-t border-signal-bright/30 px-3 py-2 text-xs text-signal-bright">
          {dropError}
        </p>
      )}
    </div>
  )
}

