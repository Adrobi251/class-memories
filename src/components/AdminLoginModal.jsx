import { useState } from 'react'
import { Lock } from 'lucide-react'
import Modal from './Modal'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-cool transition-colors duration-200 focus:border-signal'

const labelClass = 'mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted'

export default function AdminLoginModal({ open, onClose }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const { error: authError } = await signIn(email.trim(), password)
    setLoading(false)

    if (authError) {
      setError('Email atau password salah.')
      return
    }

    setEmail('')
    setPassword('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Login Admin">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="flex items-start gap-2 border-l-2 border-signal bg-paper-soft px-3 py-2 text-sm text-muted">
          <Lock className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden="true" />
          Hanya admin kelas yang bisa mengunggah dokumentasi.
        </p>

        <label className="block">
          <span className={labelClass}>Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@kelas.com"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className={labelClass}>Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
            className={inputClass}
          />
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-signal bg-paper px-3 py-2 text-sm text-signal"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full rounded-lg bg-signal py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark active:translate-y-0 disabled:translate-y-0 disabled:opacity-60"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </Modal>
  )
}
