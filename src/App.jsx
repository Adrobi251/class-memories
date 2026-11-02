import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Footer from './components/Footer'
import AdminLoginModal from './components/AdminLoginModal'
import UploadModal from './components/UploadModal'
import { useAuth } from './context/AuthContext'
import { useMedia } from './hooks/useMedia'

export default function App() {
  const { isAdmin } = useAuth()
  const { media, loading, error, refresh } = useMedia()
  const [loginOpen, setLoginOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <div className="min-h-[100dvh] bg-paper-soft">
      <Navbar
        onLoginClick={() => setLoginOpen(true)}
        onUploadClick={() => setUploadOpen(true)}
      />

      <main>
        <Hero count={media.length} onUploadClick={() => setUploadOpen(true)} />

        <section id="galeri" className="scroll-mt-16 bg-paper-soft py-16 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="mb-10 grid gap-4 border-b border-ink pb-4 md:grid-cols-12 sm:items-end">
              <div className="md:col-span-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  02 - Galeri
                </p>
                <h2 className="mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                  Galeri kenangan
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted md:col-span-4 md:text-right">
                {isAdmin
                  ? 'Kamu masuk sebagai admin. Unggah atau hapus dokumentasi lewat tombol di setiap kartu.'
                  : 'Dokumentasi foto dan video kelas yang diunggah oleh admin.'}
              </p>
            </div>

            <Gallery
              media={media}
              loading={loading}
              error={error}
              isAdmin={isAdmin}
              onChanged={refresh}
              onUploadClick={() => setUploadOpen(true)}
            />
          </div>
        </section>
      </main>

      <Footer />

      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={refresh}
      />
    </div>
  )
}


