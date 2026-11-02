import { motion } from 'motion/react'
import { ArrowRight, ImageOff, Play, Upload } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import MediaThumbnail from './MediaThumbnail'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: 'easeOut', delay },
  }),
}

const TYPE_LABEL = { foto: 'Foto', video: 'Video' }

function formatDate(value) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatMonth(value) {
  return new Date(value).toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  })
}

export default function Hero({ media = [], onUploadClick }) {
  const { isAdmin } = useAuth()
  const featured = media[0]
  const updated = featured?.created_at

  const meta = [
    { label: 'Tahun ajaran', value: '2025 / 2026' },
    { label: 'Akses', value: 'Publik baca' },
    { label: 'Dokumen', value: String(media.length).padStart(2, '0') },
    { label: 'Diperbarui', value: updated ? formatMonth(updated) : 'Belum ada' },
  ]

  return (
    <section
      id="beranda"
      className="scroll-mt-16 border-b border-line bg-paper pb-16 pt-32 sm:pb-24 sm:pt-40"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
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
              className="mt-6 text-[clamp(2.75rem,7vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-tight"
            >
              <span className="block">Arsip kelas</span>
              <span className="block text-signal">Web 3</span>
            </motion.h1>
          </div>

          <motion.div
            variants={fadeUp}
            custom={0.16}
            initial="hidden"
            animate="show"
            className="lg:col-span-4 lg:border-l lg:border-line lg:pl-10"
          >
            <p className="max-w-[46ch] text-sm leading-relaxed text-muted">
              Kumpulan foto dan video momen kebersamaan kelas. Dikelola oleh admin,
              terbuka untuk semua yang pernah menjadi bagian dari kelas ini.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#galeri"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-signal px-5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark active:translate-y-0"
              >
                Lihat galeri
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              {isAdmin && (
                <button
                  type="button"
                  onClick={onUploadClick}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-[1.5px] border-ink px-5 text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-200 hover:bg-ink hover:text-white"
                >
                  <Upload className="size-4" aria-hidden="true" />
                  Upload
                </button>
              )}
            </div>
          </motion.div>
        </div>

        <motion.dl
          variants={fadeUp}
          custom={0.24}
          initial="hidden"
          animate="show"
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4"
        >
          {meta.map((item) => (
            <div key={item.label} className="bg-paper px-4 py-3.5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.div
          variants={fadeUp}
          custom={0.32}
          initial="hidden"
          animate="show"
          className="mt-8"
        >
          {featured ? (
            <a
              href="#galeri"
              className="group block overflow-hidden rounded-lg border border-line bg-paper shadow-card"
              aria-label={`Buka galeri, dokumentasi terbaru: ${featured.title}`}
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden bg-paper-soft sm:aspect-[21/9]">
                <MediaThumbnail item={featured} priority />
                {featured.media_type === 'video' && (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-12 place-items-center rounded-lg bg-signal transition-transform duration-200 group-hover:scale-105">
                      <Play className="ml-0.5 size-5 fill-white text-white" aria-hidden="true" />
                    </span>
                  </span>
                )}
              </span>

              <span className="flex flex-col gap-3 border-t border-ink bg-ink px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
                    {TYPE_LABEL[featured.media_type] ?? 'Media'} /{' '}
                    {formatDate(featured.created_at)}
                  </span>
                  <span className="mt-1 block truncate text-base font-semibold">
                    {featured.title}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white">
                  Buka galeri
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </a>
          ) : (
            <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-lg bg-ink px-6 text-center sm:aspect-[21/9]">
              <span className="absolute inset-x-0 top-0 h-1 bg-signal" aria-hidden="true" />
              <ImageOff className="size-7 text-white/50" aria-hidden="true" />
              <p className="text-lg font-semibold text-white">Belum ada dokumentasi</p>
              <p className="max-w-[42ch] text-sm leading-relaxed text-white/60">
                Foto dan video kelas akan tampil di sini setelah admin mengunggahnya.
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={onUploadClick}
                  className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-lg bg-signal px-4 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-signal-dark"
                >
                  <Upload className="size-4" aria-hidden="true" />
                  Upload dokumentasi
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
