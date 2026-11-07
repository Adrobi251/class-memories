import { useEffect, useState } from 'react'
import { Images, LayoutDashboard, Menu, X } from 'lucide-react'
import { NAV_LINKS, site } from '../lib/site'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
      if (window.innerWidth >= 1024) setOpen(false)
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
      {open && (
        <div
          onClick={close}
          aria-hidden="true"
          className="fixed inset-0 z-[90] animate-fade-in bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <header
        className={`fixed inset-x-0 top-0 z-[100] border-b transition-colors duration-300 ${
          scrolled
            ? 'border-white/10 bg-paper/80 backdrop-blur-xl'
            : 'border-transparent bg-paper/55 backdrop-blur-md'
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8">
          <a
            href="#home"
            aria-label={`${site.name} - Beranda`}
            className="flex min-h-11 min-w-0 items-center gap-2.5 sm:gap-3"
            onClick={() => setActive('home')}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-signal font-sans text-[13px] font-bold tracking-[0.08em] text-white">
              {site.mark}
            </span>
            <span className="block min-w-0">
              <span className="hidden whitespace-nowrap text-sm font-bold uppercase leading-tight tracking-[0.16em] sm:block">
                {site.name}
              </span>
              <span className="block whitespace-nowrap text-[11px] font-bold uppercase leading-tight tracking-[0.1em] sm:hidden">
                {site.shortName}
              </span>
              <span className="mt-0.5 block text-[10px] uppercase leading-tight tracking-[0.2em] text-muted sm:tracking-[0.28em]">
                {site.subtitle}
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={active === link.id ? 'location' : undefined}
                className={`relative py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200 ${
                  active === link.id
                    ? 'text-accent-soft'
                    : 'text-ink/60 hover:text-ink'
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-px bg-accent-soft transition-opacity duration-200 ${
                    active === link.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#gallery"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-signal px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-bright active:translate-y-0 sm:px-5"
            >
              <Images className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Jelajahi</span>
            </a>

            <span aria-hidden="true" className="mx-1 hidden h-6 w-px bg-line sm:block" />

            <a
              href="#/admin"
              className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45 transition-colors duration-200 hover:text-ink lg:inline-flex"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Dashboard
            </a>

            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-line text-ink lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
            >
              {open ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobile-menu"
            className="animate-menu-in border-t border-white/10 bg-paper/95 px-5 py-6 backdrop-blur-xl sm:px-8 lg:hidden"
          >
            <div className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setActive(link.id)
                    close()
                  }}
                  aria-current={active === link.id ? 'location' : undefined}
                  className={`flex min-h-12 items-center justify-between border-b border-line/60 text-sm font-semibold uppercase tracking-[0.18em] ${
                    active === link.id ? 'text-accent-soft' : 'text-ink/70'
                  }`}
                >
                  {link.label}
                  <span className="text-[10px] tracking-[0.2em] text-muted">
                    {String(NAV_LINKS.indexOf(link) + 1).padStart(2, '0')}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <a
                href="#/admin"
                onClick={close}
                className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink"
              >
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dashboard
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
