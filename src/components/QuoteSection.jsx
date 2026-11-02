export default function QuoteSection() {
  return (
    <section
      id="kutipan"
      aria-labelledby="kutipan-title"
      className="scroll-mt-16 border-y border-ink bg-paper py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              03 - Catatan
            </p>
            <h2 id="kutipan-title" className="sr-only">
              Kutipan arsip kelas
            </h2>

            <blockquote className="mt-6 border-l-2 border-signal pl-5 sm:pl-8">
              <p className="max-w-[24ch] text-[clamp(1.8rem,4.2vw,3.4rem)] font-bold leading-[1.08] tracking-tight text-ink sm:max-w-[30ch]">
                &ldquo;Arsip kelas adalah cara kita menjaga cerita tetap utuh, bukan untuk
                berhenti di masa lalu, tetapi untuk membawanya ke hari ini.&rdquo;
              </p>
            </blockquote>
          </div>

          <div className="md:col-span-4 md:border-l md:border-line md:pl-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Dari arsip kelas
            </p>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-ink-soft">
              Satu tahun ajaran, banyak cerita. Setiap foto dan video di sini adalah
              potongan kecil dari waktu yang pernah kita lewati bersama.
            </p>

            <dl className="mt-8 space-y-4 border-t border-line pt-4">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Atribusi
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  Tim Class Memories Web 3
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Tanggal
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">2026</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
