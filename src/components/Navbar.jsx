import { useEffect, useState } from 'react'
import { LogOut, Menu, Upload, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Beranda', href: '#beranda', id: 'beranda' },
  { label: 'Galeri', href: '#galeri', id: 'galeri' },
  { label: 'Tentang', href: '#tentang', id: 'tentang' },
]

export default function Navbar({ onLoginClick, onUploadClick }) {
  const { isAdmin, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('beranda')

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  function close() {
    setOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-line bg-paper">
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <a href="#beranda" className="flex items-center gap-3" onClick={() => setActive('beranda')}>
          <span className="grid size-9 place-items-center rounded-lg bg-signal font-mono text-[11px] font-medium tracking-[0.12em] text-white">
            CM
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-bold uppercase tracking-[0.18em]">Class Memories</span>
            <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
              Arsip kelas / 2026
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={active === link.id ? 'true' : undefined}
                className={`border-b-2 pb-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                  active === link.id
                    ? 'border-signal text-signal'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onUploadClick}
                className="flex items-center gap-2 rounded-lg bg-signal px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark active:translate-y-0"
              >
                <Upload className="size-3.5" aria-hidden="true" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="flex items-center gap-2 rounded-lg border-[1.5px] border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white"
              >
                <LogOut className="size-3.5" aria-hidden="true" />
                Keluar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="rounded-lg bg-signal px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark active:translate-y-0"
            >
              Login Admin
            </button>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg border border-line p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-paper px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActive(link.id)
                  close()
                }}
                aria-current={active === link.id ? 'true' : undefined}
                className={`font-mono text-[11px] uppercase tracking-[0.14em] ${
                  active === link.id ? 'text-signal' : 'text-muted'
                }`}
              >
                {link.label}
              </a>
            ))}

            {isAdmin ? (
              <div className="flex flex-col gap-2 border-t border-line pt-5">
                <button
                  type="button"
                  onClick={() => {
                    close()
                    onUploadClick()
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg bg-signal px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white"
                >
                  <Upload className="size-4" aria-hidden="true" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    close()
                    signOut()
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border-[1.5px] border-line px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em]"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Keluar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  close()
                  onLoginClick()
                }}
                className="rounded-lg bg-signal px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white"
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
