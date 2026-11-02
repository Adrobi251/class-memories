import { ExternalLink, Lock } from 'lucide-react'
import { NAV_LINKS, site } from '../lib/site'

const YEAR = new Date().getFullYear()

// Brand marks are not part of lucide's icon set, so they live here as inline SVG.
function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.8.1-1.1.1-1.5.2-1.8.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.3-.2.7-.3 1.8-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.5.3 1.8.2.5.4.8.7 1.1.3.3.6.5 1.1.7.3.1.7.2 1.8.3 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.5-.2 1.8-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.3.2-.7.3-1.8.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.5-.3-1.8-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.3-.1-.7-.2-1.8-.3-1.3-.1-1.7-.1-4.8-.1Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm6.3-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0Z" />
    </svg>
  )
}

const SOCIALS = [
  { key: 'youtube', label: 'YouTube', href: site.youtube, Icon: YoutubeIcon },
  { key: 'instagram', label: 'Instagram', href: site.instagram, Icon: InstagramIcon },
  { key: 'external', label: 'Tautan eksternal', href: site.external, Icon: ExternalLink },
].filter((item) => Boolean(item.href))

export default function Footer() {
  return (
    <footer
      id="about"
      aria-labelledby="about-title"
      className="scroll-mt-20 border-t border-white/10 bg-paper"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <a
              href="#home"
              aria-label={`${site.name} - Beranda`}
              className="inline-flex items-center gap-3"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-signal text-[13px] font-bold tracking-[0.08em] text-white">
                {site.mark}
              </span>
              <span className="block">
                <span className="block text-[13px] font-bold uppercase leading-tight tracking-[0.16em]">
                  {site.name}
                </span>
                <span className="mt-0.5 block text-[10px] uppercase leading-tight tracking-[0.28em] text-muted">
                  {site.subtitle}
                </span>
              </span>
            </a>

            <h2 id="about-title" tabIndex={-1} className="sr-only">
              Tentang {site.name}
            </h2>

            <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-muted">
              {site.description} Publik hanya bisa membaca; unggah dan hapus khusus
              admin.
            </p>
          </div>

          <nav aria-label="Navigasi footer" className="lg:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
              Navigasi
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-10 items-center text-sm text-ink/70 transition-colors duration-200 hover:text-accent-soft"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
              Tagline
            </p>
            <p className="mt-4 font-serif text-xl leading-snug text-ink">
              {site.tagline}
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
            © {YEAR} {site.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            {SOCIALS.map(({ key, label, href, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-white/15 text-muted transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}

            <span className="ml-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted">
              <Lock className="size-3" aria-hidden="true" />
              Area admin terlindungi
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
