import { useEffect, useState } from 'react'

function readRoute() {
  const raw = window.location.hash.replace(/^#\/?/, '')
  return raw.split('?')[0]
}

export function useHashRoute() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    function handleHashChange() {
      setRoute(readRoute())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return route
}
