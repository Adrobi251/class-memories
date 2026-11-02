import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  Camera,
  GraduationCap,
  Image as ImageIcon,
  Lock,
  Menu,
  Play,
  Sparkles,
  Upload,
  Video,
  X,
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Tentang', href: '#tentang' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#beranda" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-violet-600">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-base font-bold tracking-tight">Class Memories</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500"
          >
            <Lock className="size-4" />
            Admin
          </button>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-slate-300"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold"
            >
              <Lock className="size-4" />
              Login Admin
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="beranda" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300"
        >
          <Sparkles className="size-3.5" />
          Dokumentasi kelas dalam satu tempat
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl"
        >
          Kenangan kelas,
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            {' '}abadi selamanya
          </span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-base text-slate-400 sm:text-lg"
        >
          Kumpulan foto dan video momen kebersamaan kelas. Dikurasi oleh admin,
          bisa dinikmati semua orang.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#galeri"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold transition hover:bg-violet-500 sm:w-auto"
          >
            <ImageIcon className="size-4" />
            Lihat Galeri
          </a>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5 sm:w-auto"
          >
            <Upload className="size-4" />
            Upload (Admin)
          </button>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.35 }}
          className="mt-16 grid grid-cols-3 gap-4 text-center sm:mx-auto sm:max-w-md"
        >
          {[
            { icon: Camera, label: 'Foto' },
            { icon: Video, label: 'Video' },
            { icon: Play, label: 'Momen' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <Icon className="mx-auto mb-2 size-5 text-violet-400" />
              <p className="text-sm font-medium text-slate-300">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section id="galeri" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Galeri Kenangan</h2>
          <p className="mt-2 text-sm text-slate-400">
            Belum ada dokumentasi. Admin bisa mulai upload foto & video.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="group relative aspect-[4/3] animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <div className="absolute inset-0 grid place-items-center">
              <ImageIcon className="size-10 text-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="tentang" className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} Class Memories. Dibuat dengan React + Supabase.</p>
        <div className="flex items-center gap-2">
          <Lock className="size-3.5" />
          <span>Area admin terlindungi</span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main>
        <Hero />
        <Gallery />
      </main>
      <Footer />
    </div>
  )
}
