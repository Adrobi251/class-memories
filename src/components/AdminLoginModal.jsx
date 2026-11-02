import { useState } from 'react'
import { Loader2, Lock, Mail, KeyRound } from 'lucide-react'
import Modal from './Modal'
import { useAuth } from '../context/AuthContext'

export default function AdminLoginModal({ open, onClose }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
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
        <p className="flex items-center gap-2 text-sm text-slate-400">
          <Lock className="size-4 shrink-0" />
          Hanya admin kelas yang bisa upload dokumentasi.
        </p>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-300">Email</span>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 focus-within:border-violet-500">
            <Mail className="size-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kelas.com"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-600"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-300">Password</span>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 focus-within:border-violet-500">
            <KeyRound className="size-4 text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-600"
            />
          </div>
        </label>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold transition hover:bg-violet-500 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </Modal>
  )
}
