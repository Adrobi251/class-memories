import { useState } from 'react'
import { ArrowLeft, Check, Lock } from 'lucide-react'
import AdminLoginModal from '../AdminLoginModal'
import { useAuth } from '../../context/AuthContext'
import { site } from '../../lib/site'

const CAPABILITIES = [
  'Menyunting judul dan deskripsi dokumentasi.',
  'Mengganti poster video agar galeri tetap rapi.',
  'Menghapus satu atau banyak media sekaligus.',
]

export default function AdminGate() {
  const { loading } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)

  if (loading) {
    return (
      <div
        className="grid min-h-[100dvh] place-items-center bg-paper px-6 text-center"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="grid size-12 place-items-center rounded-xl bg-signal text-sm font-bold tracking-[0.08em] text-white">
            {site.mark}
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
            Memeriksa sesi admin...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1280px] flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between gap-3">
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-signal text-[13px] font-bold tracking-[0.08em] text-white">
              {site.mark}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold uppercase tracking-[0.16em]">
                {site.name}
              </span>
              <span className="mt-0.5 block text-[10px] uppercase tracking-[0.28em] text-muted">
                Admin
              </span>
            </span>
          </a>
          <a
            href="#home"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors duration-200 hover:border-ink hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Lihat situs</span>
          </a>
        </header>

        <main className="flex flex-1 items-center py-16">
          <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent-soft">
                <span aria-hidden="true" className="h-px w-8 bg-accent-soft/60" />
                Akses terbatas
              </p>
              <h1 className="mt-5 max-w-[16ch] font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.02em] text-balance">
                Ruang kerja untuk merawat kenangan.
              </h1>
              <p className="mt-6 max-w-[50ch] text-sm leading-relaxed text-muted sm:text-base">
                Dashboard ini khusus admin. Masuk untuk mengelola foto dan video yang sudah
                tayang di galeri publik.
              </p>
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-signal px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark active:translate-y-0"
              >
                <Lock className="size-4" aria-hidden="true" />
                Login admin
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-paper-soft/70 p-6 shadow-card">
              <p className="font-serif text-xl">Yang bisa dilakukan admin</p>
              <ul className="mt-5 space-y-4">
                {CAPABILITIES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-accent-soft/40 text-accent-soft">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-muted">
                Pengunjung publik tetap bisa melihat seluruh galeri tanpa perlu akun.
              </p>
            </div>
          </div>
        </main>
      </div>

      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  )
}
