'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'none'
  className?: string
}

export default function FadeIn({ children, delay = 0, direction = 'up', className = '' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : direction === 'up' ? 'translateY(28px)' : 'none',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
