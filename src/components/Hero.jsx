import { motion } from 'motion/react'
import { ArrowRight, Upload } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: 'easeOut', delay },
  }),
}

export default function Hero({ count = 0, onUploadClick }) {
  const { isAdmin } = useAuth()

  return (
    <section
      id="beranda"
      className="scroll-mt-16 border-b border-line bg-paper pb-16 pt-32 sm:pb-24 sm:pt-40"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <motion.p
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="show"
              className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
            >
              <span className="h-px w-10 bg-signal" aria-hidden="true" />
              01 - Dokumentasi kelas
            </motion.p>

            <motion.h1
              variants={fadeUp}
              custom={0.08}
              initial="hidden"
              animate="show"
              className="mt-6 text-[clamp(2.75rem,6vw,5rem)] font-bold uppercase leading-[0.95] tracking-tight"
            >
              Kenangan kelas,
              <br />
              <span className="text-signal">terarsip</span> rapi.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.16}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted"
            >
              Kumpulan foto dan video momen kebersamaan kelas. Dikelola oleh admin,
              terbuka untuk semua yang pernah menjadi bagian dari kelas ini.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={0.24}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#galeri"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-signal px-6 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark active:translate-y-0"
              >
                Lihat arsip
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              {isAdmin && (
                <button
                  type="button"
                  onClick={onUploadClick}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-[1.5px] border-ink px-6 text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-200 hover:bg-ink hover:text-white"
                >
                  <Upload className="size-4" aria-hidden="true" />
                  Upload dokumentasi
                </button>
              )}
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-4 lg:border-l lg:border-line lg:pl-10"
            aria-label="Status arsip"
          >
            <div className="rounded-lg bg-deep-blue p-6 text-white">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
                Status arsip
              </p>
              <p className="mt-4 font-mono text-6xl font-medium leading-none">
                {String(count).padStart(2, '0')}
              </p>
              <p className="mt-2 text-sm text-white/80">dokumen tersimpan</p>

              <dl className="mt-8 space-y-3 border-t border-white/30 pt-4 font-mono text-[11px] uppercase tracking-[0.12em]">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-white/60">Tahun ajaran</dt>
                  <dd>2025 / 2026</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-white/60">Akses</dt>
                  <dd>Publik / Admin</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-white/60">Format</dt>
                  <dd>JPG - MP4</dd>
                </div>
              </dl>
            </div>

            <div className="mt-3 flex gap-3" aria-hidden="true">
              <div className="h-14 flex-1 bg-signal" />
              <div className="h-14 w-14 border border-ink" />
              <div className="h-14 w-14 border border-line bg-paper" />
            </div>
          </motion.aside>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-y border-line py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Foto - dokumentasi harian</span>
          <span>Video - momen bersama</span>
          <span className="sm:text-right">Dirawat oleh admin kelas</span>
        </div>
      </div>
    </section>
  )
}
