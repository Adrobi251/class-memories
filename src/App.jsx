import { Suspense, lazy } from 'react'
import PublicSite from './PublicSite'
import { useHashRoute } from './hooks/useHashRoute'
import { site } from './lib/site'

const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))

function DashboardBoot() {
  return (
    <div
      className="grid min-h-[100dvh] place-items-center bg-paper px-6 text-ink"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid size-12 place-items-center rounded-xl bg-signal text-sm font-bold tracking-[0.08em] text-white">
          {site.mark}
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
            Admin
          </p>
          <p className="mt-2 text-sm text-muted">Menyiapkan dashboard...</p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const route = useHashRoute()

  if (route === 'admin') {
    return (
      <Suspense fallback={<DashboardBoot />}>
        <AdminDashboard />
      </Suspense>
    )
  }

  return <PublicSite />
}
