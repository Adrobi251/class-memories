import { Suspense, lazy, useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Footer from './components/Footer'
import StatusToast from './components/StatusToast'
import { useAuth } from './context/AuthContext'
import { useMedia } from './hooks/useMedia'

// Admin-only UI stays out of the public bundle until it is opened.
const AdminLoginModal = lazy(() => import('./components/AdminLoginModal'))
const UploadModal = lazy(() => import('./components/UploadModal'))

export default function App() {
  const { isAdmin } = useAuth()
  const { media, loading, error, refresh } = useMedia()
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginMounted, setLoginMounted] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadMounted, setUploadMounted] = useState(false)
  const [notice, setNotice] = useState('')

  const dismissNotice = useCallback(() => setNotice(''), [])

  const openLogin = useCallback(() => {
    setLoginMounted(true)
    setLoginOpen(true)
  }, [])

  const closeLogin = useCallback(() => setLoginOpen(false), [])

  const openUpload = useCallback(() => {
    setUploadMounted(true)
    setUploadOpen(true)
  }, [])

  const closeUpload = useCallback(() => setUploadOpen(false), [])

  function handleUploaded() {
    refresh()
    setNotice('Dokumentasi berhasil diunggah.')
  }

  function handleDeleted() {
    refresh()
    setNotice('Dokumentasi berhasil dihapus.')
  }

  return (
    <div className="min-h-[100dvh] bg-paper-soft">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[600] -translate-y-24 rounded-lg bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-transform duration-200 focus:translate-y-0 motion-reduce:transition-none"
      >
        Lewati ke konten
      </a>

      <Navbar onLoginClick={openLogin} onUploadClick={openUpload} />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero media={media} onUploadClick={openUpload} />

        <section id="galeri" className="scroll-mt-16 bg-paper-soft py-16 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="mb-10 grid gap-4 border-b border-ink pb-4 sm:items-end md:grid-cols-12">
              <div className="md:col-span-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  02 - Galeri
                </p>
                <h2 id="galeri-title" tabIndex={-1} className="mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
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
              onDeleted={handleDeleted}
              onUploadClick={openUpload}
              onRetry={refresh}
            />
          </div>
        </section>
      </main>

      <Footer />

      <Suspense fallback={null}>
        {loginMounted && <AdminLoginModal open={loginOpen} onClose={closeLogin} />}
        {uploadMounted && (
          <UploadModal open={uploadOpen} onClose={closeUpload} onUploaded={handleUploaded} />
        )}
      </Suspense>

      <StatusToast message={notice} onDismiss={dismissNotice} />
    </div>
  )
}
