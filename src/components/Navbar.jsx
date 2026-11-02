import { useState } from 'react'
import { GraduationCap, LogOut, Menu, Upload, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Tentang', href: '#tentang' },
]

export default function Navbar({ onLoginClick, onUploadClick }) {
  const { isAdmin, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  function close() {
    setOpen(false)
  }

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

          {isAdmin ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onUploadClick}
                className="flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500"
              >
                <Upload className="size-4" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
              >
                <LogOut className="size-4" />
                Keluar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500"
            >
              Login Admin
            </button>
          )}
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
                onClick={close}
                className="text-sm text-slate-300"
              >
                {link.label}
              </a>
            ))}
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    close()
                    onUploadClick()
                  }}
                  className="flex items-center justify-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold"
                >
                  <Upload className="size-4" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    close()
                    signOut()
                  }}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-300"
                >
                  <LogOut className="size-4" />
                  Keluar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  close()
                  onLoginClick()
                }}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold"
              >
                Login Admin
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
