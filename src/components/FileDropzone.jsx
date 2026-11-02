import { UploadCloud } from 'lucide-react'

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
  return (
    <div
      className={`rounded-lg border border-dashed border-cool transition-colors duration-200 focus-within:border-signal focus-within:ring-2 focus-within:ring-signal/25 hover:border-ink ${
        surface === 'soft' ? 'bg-paper-soft' : 'bg-paper'
      }`}
    >
      <label
        htmlFor={id}
        className={`block cursor-pointer px-4 text-center ${surface === 'soft' ? 'py-6' : 'py-4'}`}
      >
        <Icon
          className={`mx-auto text-ink ${surface === 'soft' ? 'mb-2 size-6' : 'mb-1.5 size-5 text-muted'}`}
          aria-hidden="true"
        />
        <span className="block text-sm font-medium text-ink">{file ? file.name : label}</span>
        {hint && (
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            {hint}
          </span>
        )}
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        className="sr-only"
      />
    </div>
  )
}
