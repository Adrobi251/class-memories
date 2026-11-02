import { Lock } from 'lucide-react'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer id="tentang" className="scroll-mt-16 border-t border-ink bg-paper">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Tentang arsip
            </p>
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-ink-soft">
              Class Memories adalah arsip digital kelas: foto dan video yang dikurasi
              admin agar setiap momen tetap bisa dilihat kembali. Publik hanya bisa
              membaca; unggah dan hapus khusus admin.
            </p>
          </div>

          <div className="md:col-span-5 md:text-right">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Sistem
            </p>
            <ul className="mt-3 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
              <li>React + Vite</li>
              <li>Supabase / PostgreSQL</li>
              <li>Deploy Vercel</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {YEAR} Class Memories</p>
          <p className="flex items-center gap-2">
            <Lock className="size-3" aria-hidden="true" />
            Area admin terlindungi
          </p>
        </div>
      </div>
    </footer>
  )
}
