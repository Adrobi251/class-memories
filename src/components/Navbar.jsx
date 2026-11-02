import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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
  const toggleRef = useRef(null)

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

  useEffect(() => {
    if (!open) return

    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onResize() {
      if (window.innerWidth >= 768) setOpen(false)
    }

    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  function close() {
    setOpen(false)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            aria-hidden="true"
            className="fixed inset-0 z-[90] bg-ink/40 md:hidden"
          />
        )}
      </AnimatePresence>

      <header className="fixed inset-x-0 top-0 z-[100] border-b border-line bg-paper">
        <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
          <a
            href="#beranda"
            aria-label="Class Memories Web 3 - Beranda"
            className="flex min-h-11 items-center gap-3"
            onClick={() => setActive('beranda')}
          >
            <span className="grid size-9 place-items-center rounded-lg bg-signal font-mono text-[11px] font-medium tracking-[0.12em] text-white">
              CM
            </span>
            <span className="hidden sm:block">
              <span className="block whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em]">
                Class Memories Web 3
              </span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Arsip kelas / 2026
              </span>
            </span>
            <span className="sm:hidden">
              <span className="block whitespace-nowrap text-[13px] font-bold uppercase leading-tight tracking-[0.12em]">
                Class Memories
              </span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase leading-tight tracking-[0.16em] text-muted">
                Web 3
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active === link.id ? 'location' : undefined}
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
                  className="flex min-h-11 items-center gap-2 rounded-lg bg-signal px-4 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark active:translate-y-0"
                >
                  <Upload className="size-3.5" aria-hidden="true" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="flex min-h-11 items-center gap-2 rounded-lg border-[1.5px] border-line px-4 text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white"
                >
                  <LogOut className="size-3.5" aria-hidden="true" />
                  Keluar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="min-h-11 rounded-lg bg-signal px-4 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark active:translate-y-0"
              >
                Login Admin
              </button>
            )}
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-lg border border-line md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="border-t border-line bg-paper px-6 py-5 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setActive(link.id)
                      close()
                    }}
                    aria-current={active === link.id ? 'location' : undefined}
                    className={`flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.14em] ${
                      active === link.id ? 'text-signal' : 'text-muted'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}

                {isAdmin ? (
                  <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        close()
                        toggleRef.current?.focus()
                        onUploadClick()
                      }}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-signal px-4 text-xs font-semibold uppercase tracking-[0.1em] text-white"
                    >
                      <Upload className="size-4" aria-hidden="true" />
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        close()
                        toggleRef.current?.focus()
                        signOut()
                      }}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-lg border-[1.5px] border-line px-4 text-xs font-semibold uppercase tracking-[0.1em]"
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
                      toggleRef.current?.focus()
                      onLoginClick()
                    }}
                    className="mt-2 flex min-h-11 items-center justify-center rounded-lg bg-signal px-4 text-xs font-semibold uppercase tracking-[0.1em] text-white"
                  >
                    Login Admin
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
