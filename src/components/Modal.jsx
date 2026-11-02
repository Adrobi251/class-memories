import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, wide = false }) {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const previous = document.activeElement
    const panel = panelRef.current

    const getFocusable = () =>
      Array.from(
        panel?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => element.offsetParent !== null)

    panel?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const items = getFocusable()
      if (!items.length) {
        event.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      const inside = panel?.contains(active)

      if (!inside) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
        return
      }

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[300] flex animate-fade-in items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative max-h-[90vh] w-full animate-dialog-in overflow-y-auto rounded-2xl border border-white/10 bg-paper p-6 shadow-card outline-none ${
          wide ? 'max-w-3xl' : 'max-w-md'
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-serif text-xl leading-tight tracking-[-0.01em]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 text-muted transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper"
            aria-label="Tutup"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
