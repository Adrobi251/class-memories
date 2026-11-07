import { ArrowLeft, Images, LogOut, Upload } from 'lucide-react'
import { site } from '../../lib/site'

export default function AdminSidebar({ user, onUpload, onSignOut }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-paper-soft/50 backdrop-blur-xl lg:flex">
      <div className="border-b border-white/10 px-6 py-6">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-signal text-[13px] font-bold tracking-[0.08em] text-white">
            {site.mark}
          </span>
          <span>
            <span className="block text-sm font-bold uppercase tracking-[0.16em] text-ink">
              {site.shortName}
            </span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.28em] text-muted">
              Arsip studio
            </span>
          </span>
        </a>
      </div>

      <nav className="flex-1 px-4 py-6" aria-label="Navigasi dashboard">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
          Ruang kerja
        </p>
        <div className="mt-3 space-y-1">
          <span
            aria-current="page"
            className="flex min-h-11 items-center gap-3 rounded-xl border border-accent-soft/30 bg-accent-soft/10 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-soft"
          >
            <Images className="size-4" aria-hidden="true" />
            Galeri
          </span>
          <button
            type="button"
            onClick={onUpload}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/60 transition-colors duration-200 hover:bg-white/[0.04] hover:text-ink"
          >
            <Upload className="size-4" aria-hidden="true" />
            Unggah media
          </button>
        </div>

        <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
          Situs publik
        </p>
        <a
          href="#home"
          className="mt-3 flex min-h-11 items-center gap-3 rounded-xl px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/60 transition-colors duration-200 hover:bg-white/[0.04] hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Lihat situs
        </a>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Masuk sebagai</p>
          <p className="mt-1 truncate text-xs text-ink" title={user?.email}>
            {user?.email ?? 'Admin'}
          </p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-line text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:border-signal hover:bg-signal hover:text-white"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
