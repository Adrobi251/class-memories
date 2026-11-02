import { motion } from 'motion/react'
import { Camera, Image as ImageIcon, Play, Sparkles, Upload, Video } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Hero({ onUploadClick }) {
  const { isAdmin } = useAuth()

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
          {isAdmin && (
            <button
              type="button"
              onClick={onUploadClick}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5 sm:w-auto"
            >
              <Upload className="size-4" />
              Upload Dokumentasi
            </button>
          )}
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
