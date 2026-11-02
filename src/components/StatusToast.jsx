import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, X } from 'lucide-react'

export default function StatusToast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return

    const timer = window.setTimeout(onDismiss, 4000)
    return () => window.clearTimeout(timer)
  }, [message, onDismiss])

  return (
    <div className="fixed bottom-6 left-1/2 z-[500] w-[calc(100%-3rem)] max-w-md -translate-x-1/2">
      <AnimatePresence>
        {message && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-3 rounded-lg border border-ink bg-paper px-4 py-2 shadow-card"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-signal">
              <Check className="size-4 text-white" aria-hidden="true" />
            </span>
            <p className="min-w-0 flex-1 text-sm text-ink">{message}</p>
            <button
              type="button"
              onClick={onDismiss}
              className="grid size-11 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white"
              aria-label="Tutup notifikasi"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
