'use client'

import { useEffect, useRef } from 'react'

export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cvs = canvas
    const resize = () => {
      cvs.width = cvs.offsetWidth
      cvs.height = cvs.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-ffxiv-gold').trim()
    const hex = /^#[0-9a-f]{6}$/i.test(raw) ? raw : '#c8a84b'
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const rgb = `${r},${g},${b}`

    interface Streak {
      x: number; y: number; vx: number; vy: number
      len: number; opacity: number; life: number; maxLife: number
    }

    const streaks: Streak[] = []

    function spawn() {
      const deg = Math.random() * 15 + 8  // 8-23° — shallow diagonal from left
      const rad = (deg * Math.PI) / 180
      const speed = Math.random() * 2.5 + 2
      streaks.push({
        x: -20,
        y: Math.random() * canvas.height * 0.85,
        vx: Math.cos(rad) * speed,
        vy: Math.sin(rad) * speed,
        len: Math.random() * 100 + 60,
        opacity: 0,
        life: 0,
        maxLife: Math.floor(cvs.width / (Math.cos(rad) * speed)) + 20,
      })
    }

    let lastSpawn = 0
    let animId: number

    function frame(ts: number) {
      ctx.clearRect(0, 0, cvs.width, cvs.height)

      if (ts - lastSpawn > 700 + Math.random() * 800) {
        spawn()
        if (Math.random() > 0.6) spawn()
        lastSpawn = ts
      }

      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i]
        s.life++
        s.x += s.vx
        s.y += s.vy

        const t = s.life / s.maxLife
        s.opacity = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1

        if (s.x > cvs.width + 20 || s.life >= s.maxLife) { streaks.splice(i, 1); continue }

        const mag = Math.hypot(s.vx, s.vy)
        const tx = s.x - (s.vx / mag) * s.len * s.opacity
        const ty = s.y - (s.vy / mag) * s.len * s.opacity

        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y)
        grad.addColorStop(0, `rgba(${rgb},0)`)
        grad.addColorStop(1, `rgba(${rgb},${s.opacity * 0.85})`)

        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${s.opacity})`
        ctx.fill()
      }

      animId = requestAnimationFrame(frame)
    }

    animId = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
