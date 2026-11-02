import { useEffect, useRef, useState } from 'react'

// Scroll reveal without an animation library. These blocks are below the fold and
// only exist after React mounts, so starting hidden cannot hide real content from
// a no-JS reader. Reduced-motion users are un-hidden immediately.
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
  ...props
}) {
  const ref = useRef(null)
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return 'idle'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return reduced || !('IntersectionObserver' in window) ? 'revealed' : 'pending'
  })

  useEffect(() => {
    const element = ref.current
    if (!element || state !== 'pending') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setState('revealed')
        observer.disconnect()
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [state])

  return (
    <Tag
      ref={ref}
      data-reveal={state}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  )
}
