import { FileVideo, Image as ImageIcon } from 'lucide-react'

const OPTIONS = [
  { value: 'foto', label: 'Foto', icon: ImageIcon },
  { value: 'video', label: 'Video', icon: FileVideo },
]

export default function MediaTypeToggle({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        Jenis media
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map(({ value: optionValue, label, icon: Icon }) => (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            aria-pressed={value === optionValue}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-200 ${
              value === optionValue
                ? 'border-ink bg-ink text-paper'
                : 'border-line bg-paper text-muted hover:border-ink hover:text-ink'
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
