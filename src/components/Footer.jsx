import { Lock } from 'lucide-react'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer id="tentang" className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
        <p>© {YEAR} Class Memories. Dibuat dengan React + Supabase.</p>
        <div className="flex items-center gap-2">
          <Lock className="size-3.5" />
          <span>Area admin terlindungi</span>
        </div>
      </div>
    </footer>
  )
}

