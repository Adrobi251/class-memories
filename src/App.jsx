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
    <div className="min-h-screen font-sans">
      <Navbar
        onLoginClick={() => setLoginOpen(true)}
        onUploadClick={() => setUploadOpen(true)}
      />
      <main>
        <Hero onUploadClick={() => setUploadOpen(true)} />

        <section id="galeri" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Galeri Kenangan</h2>
            <p className="mt-2 text-sm text-slate-400">
              {isAdmin
                ? 'Kamu login sebagai admin. Kamu bisa upload dan menghapus dokumentasi.'
                : 'Dokumentasi foto dan video kelas yang diupload oleh admin.'}
            </p>
          </div>

          <Gallery
            media={media}
            loading={loading}
            error={error}
            isAdmin={isAdmin}
            onChanged={refresh}
          />
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
