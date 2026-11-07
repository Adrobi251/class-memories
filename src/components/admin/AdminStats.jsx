import { Calendar, Images, Layers, Play } from 'lucide-react'

const STATS = [
  { key: 'total', label: 'Total media', hint: 'Semua dokumentasi', icon: Layers },
  { key: 'foto', label: 'Foto', hint: 'Gambar di galeri', icon: Images },
  { key: 'video', label: 'Video', hint: 'Siap diputar', icon: Play },
  { key: 'month', label: 'Bulan ini', hint: 'Baru ditambahkan', icon: Calendar },
]

// Snapshot taken once per page load; the dashboard is a short-lived workspace.
const NOW = new Date()
const THIS_MONTH = NOW.getMonth()
const THIS_YEAR = NOW.getFullYear()

export default function AdminStats({ media, loading }) {
  const foto = media.filter((item) => item.media_type === 'foto').length
  const month = media.filter((item) => {
    const date = new Date(item.created_at)
    return date.getMonth() === THIS_MONTH && date.getFullYear() === THIS_YEAR
  }).length

  const values = {
    total: media.length,
    foto,
    video: media.length - foto,
    month,
  }

  return (
    <section aria-label="Ringkasan media" className="mt-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map(({ key, label, hint, icon: Icon }) => (
          <div
            key={key}
            className="rounded-2xl border border-white/10 bg-paper-soft px-5 py-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                {label}
              </p>
              <Icon className="size-4 text-accent-soft/70" aria-hidden="true" />
            </div>
            <p className="mt-4 font-serif text-4xl leading-none tabular-nums text-ink">
              {loading ? '—' : String(values[key]).padStart(2, '0')}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted">{hint}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
