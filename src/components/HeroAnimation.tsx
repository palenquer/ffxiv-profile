'use client'

import { useEffect, useRef } from 'react'

export type AnimationType = 'shooting-stars' | 'fireflies' | 'sakura' | 'glitter' | 'snow' | 'aurora' | 'bubbles'

function getAccentRgb(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--color-ffxiv-gold').trim()
  const hex = /^#[0-9a-f]{6}$/i.test(raw) ? raw : '#c8a84b'
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

// ─── Shooting Stars ────────────────────────────────────────────────────────────
function animShootingStars(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, [r, g, b]: [number, number, number]): () => void {
  const rgb = `${r},${g},${b}`
  interface Streak { x: number; y: number; vx: number; vy: number; len: number; opacity: number; life: number; maxLife: number }
  const streaks: Streak[] = []
  let lastSpawn = 0
  let animId: number

  function spawn() {
    const deg = Math.random() * 15 + 8
    const rad = (deg * Math.PI) / 180
    const speed = Math.random() * 2.5 + 2
    streaks.push({
      x: -20,
      y: Math.random() * cvs.height * 0.85,
      vx: Math.cos(rad) * speed,
      vy: Math.sin(rad) * speed,
      len: Math.random() * 100 + 60,
      opacity: 0,
      life: 0,
      maxLife: Math.floor(cvs.width / (Math.cos(rad) * speed)) + 20,
    })
  }

  function frame(ts: number) {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    if (ts - lastSpawn > 700 + Math.random() * 800) {
      spawn()
      if (Math.random() > 0.6) spawn()
      lastSpawn = ts
    }
    for (let i = streaks.length - 1; i >= 0; i--) {
      const s = streaks[i]
      s.life++; s.x += s.vx; s.y += s.vy
      const t = s.life / s.maxLife
      s.opacity = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1
      if (s.x > cvs.width + 20 || s.life >= s.maxLife) { streaks.splice(i, 1); continue }
      const mag = Math.hypot(s.vx, s.vy)
      const tx = s.x - (s.vx / mag) * s.len * s.opacity
      const ty = s.y - (s.vy / mag) * s.len * s.opacity
      const grad = ctx.createLinearGradient(tx, ty, s.x, s.y)
      grad.addColorStop(0, `rgba(${rgb},0)`)
      grad.addColorStop(1, `rgba(${rgb},${s.opacity * 0.85})`)
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y)
      ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.beginPath(); ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${rgb},${s.opacity})`; ctx.fill()
    }
    animId = requestAnimationFrame(frame)
  }
  animId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(animId)
}

// ─── Fireflies ─────────────────────────────────────────────────────────────────
function animFireflies(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, [r, g, b]: [number, number, number]): () => void {
  const rgb = `${r},${g},${b}`
  interface Firefly { x: number; y: number; vx: number; vy: number; phase: number; speed: number; size: number }
  const COUNT = 28
  let animId: number

  const flies: Firefly[] = Array.from({ length: COUNT }, () => ({
    x: Math.random() * cvs.width,
    y: Math.random() * cvs.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.018 + 0.008,
    size: Math.random() * 2 + 1.5,
  }))

  function frame() {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    flies.forEach((f) => {
      f.phase += f.speed
      f.vx += (Math.random() - 0.5) * 0.025
      f.vy += (Math.random() - 0.5) * 0.025
      f.vx = Math.max(-0.7, Math.min(0.7, f.vx))
      f.vy = Math.max(-0.7, Math.min(0.7, f.vy))
      f.x = (f.x + f.vx + cvs.width) % cvs.width
      f.y = (f.y + f.vy + cvs.height) % cvs.height
      const opacity = (Math.sin(f.phase) + 1) / 2
      if (opacity < 0.04) return
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 5)
      grd.addColorStop(0, `rgba(${rgb},${opacity * 0.8})`)
      grd.addColorStop(1, `rgba(${rgb},0)`)
      ctx.beginPath(); ctx.arc(f.x, f.y, f.size * 5, 0, Math.PI * 2)
      ctx.fillStyle = grd; ctx.fill()
      ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${rgb},${opacity})`; ctx.fill()
    })
    animId = requestAnimationFrame(frame)
  }
  animId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(animId)
}

// ─── Sakura ────────────────────────────────────────────────────────────────────
function animSakura(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, [r, g, b]: [number, number, number]): () => void {
  // Lighten the accent color toward white for a petal look
  const pr = Math.round(r + (255 - r) * 0.55)
  const pg = Math.round(g + (255 - g) * 0.55)
  const pb = Math.round(b + (255 - b) * 0.55)
  const petalRgb = `${pr},${pg},${pb}`

  interface Petal { x: number; y: number; vx: number; vy: number; rot: number; rotV: number; size: number; opacity: number; wobble: number; wobbleV: number }
  const MAX = 30
  let animId: number
  let lastSpawn = 0

  function makePetal(spreadY = false): Petal {
    return {
      x: Math.random() * cvs.width * 1.3 - cvs.width * 0.15,
      y: spreadY ? Math.random() * cvs.height : -20,
      vx: (Math.random() - 0.45) * 0.7,
      vy: Math.random() * 1.2 + 0.6,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.035,
      size: Math.random() * 5 + 4,
      opacity: Math.random() * 0.45 + 0.3,
      wobble: Math.random() * Math.PI * 2,
      wobbleV: Math.random() * 0.02 + 0.008,
    }
  }

  function drawPetal(size: number) {
    ctx.beginPath()
    ctx.moveTo(0, -size)
    ctx.bezierCurveTo(size * 0.9, -size * 0.4, size * 0.9, size * 0.4, 0, size)
    ctx.bezierCurveTo(-size * 0.9, size * 0.4, -size * 0.9, -size * 0.4, 0, -size)
    ctx.closePath()
  }

  const petals: Petal[] = Array.from({ length: MAX }, () => makePetal(true))

  function frame(ts: number) {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    if (petals.length < MAX && ts - lastSpawn > 350) {
      petals.push(makePetal())
      lastSpawn = ts
    }
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i]
      p.wobble += p.wobbleV
      p.x += p.vx + Math.sin(p.wobble) * 0.4
      p.y += p.vy
      p.rot += p.rotV
      if (p.y > cvs.height + 30) { petals.splice(i, 1); continue }
      ctx.save()
      ctx.globalAlpha = p.opacity
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      drawPetal(p.size)
      ctx.fillStyle = `rgba(${petalRgb},0.75)`
      ctx.fill()
      // Highlight
      ctx.beginPath()
      ctx.ellipse(-p.size * 0.15, -p.size * 0.2, p.size * 0.45, p.size * 0.25, -0.4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fill()
      ctx.restore()
    }
    animId = requestAnimationFrame(frame)
  }
  animId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(animId)
}

// ─── Glitter ───────────────────────────────────────────────────────────────────
function animGlitter(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, [r, g, b]: [number, number, number]): () => void {
  const rgb = `${r},${g},${b}`
  interface Sparkle { x: number; y: number; size: number; life: number; maxLife: number; rot: number }
  const MAX = 70
  let animId: number

  function makeSpark(): Sparkle {
    return {
      x: Math.random() * cvs.width,
      y: Math.random() * cvs.height,
      size: Math.random() * 3.5 + 1,
      life: Math.floor(Math.random() * 80),
      maxLife: Math.floor(Math.random() * 80 + 70),
      rot: Math.random() * Math.PI,
    }
  }

  const sparks: Sparkle[] = Array.from({ length: MAX }, makeSpark)

  function drawStar(x: number, y: number, size: number, rot: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.beginPath()
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4
      const radius = i % 2 === 0 ? size : size * 0.18
      if (i === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
      else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
    }
    ctx.closePath()
    ctx.restore()
  }

  function frame() {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    sparks.forEach((s, i) => {
      s.life++
      if (s.life >= s.maxLife) { sparks[i] = makeSpark(); return }
      const t = s.life / s.maxLife
      const opacity = t < 0.2 ? t / 0.2 : t > 0.75 ? (1 - t) / 0.25 : 1
      if (opacity < 0.02) return
      // Glow
      const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5)
      grd.addColorStop(0, `rgba(${rgb},${opacity * 0.35})`)
      grd.addColorStop(1, `rgba(${rgb},0)`)
      ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2)
      ctx.fillStyle = grd; ctx.fill()
      // Star
      ctx.globalAlpha = opacity
      ctx.fillStyle = `rgba(${rgb},1)`
      drawStar(s.x, s.y, s.size, s.rot)
      ctx.fill()
      ctx.globalAlpha = 1
    })
    animId = requestAnimationFrame(frame)
  }
  animId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(animId)
}

// ─── Snow ──────────────────────────────────────────────────────────────────────
function animSnow(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, [r, g, b]: [number, number, number]): () => void {
  const rgb = `${r},${g},${b}`
  interface Flake { x: number; y: number; vy: number; vx: number; size: number; opacity: number; wobble: number; wobbleV: number }
  const COUNT = 60
  let animId: number

  function makeFlake(spreadY = false): Flake {
    return {
      x: Math.random() * cvs.width,
      y: spreadY ? Math.random() * cvs.height : -10,
      vy: Math.random() * 0.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 3 + 1.5,
      opacity: Math.random() * 0.5 + 0.3,
      wobble: Math.random() * Math.PI * 2,
      wobbleV: Math.random() * 0.015 + 0.005,
    }
  }

  const flakes: Flake[] = Array.from({ length: COUNT }, () => makeFlake(true))

  function frame() {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    flakes.forEach((f, i) => {
      f.wobble += f.wobbleV
      f.x += f.vx + Math.sin(f.wobble) * 0.35
      f.y += f.vy
      if (f.y > cvs.height + 10) { flakes[i] = makeFlake(); return }
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 2.5)
      grd.addColorStop(0, `rgba(${rgb},${f.opacity})`)
      grd.addColorStop(0.5, `rgba(${rgb},${f.opacity * 0.5})`)
      grd.addColorStop(1, `rgba(${rgb},0)`)
      ctx.beginPath(); ctx.arc(f.x, f.y, f.size * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = grd; ctx.fill()
      ctx.beginPath(); ctx.arc(f.x, f.y, f.size * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${f.opacity * 0.9})`; ctx.fill()
    })
    animId = requestAnimationFrame(frame)
  }
  animId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(animId)
}

// ─── Aurora ────────────────────────────────────────────────────────────────────
function animAurora(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, [r, g, b]: [number, number, number]): () => void {
  let animId: number
  let t = 0

  // Complementary hue shift for the second band
  const r2 = Math.round(b * 0.6 + 80)
  const g2 = Math.round(r * 0.3 + 120)
  const b2 = Math.round(g * 0.5 + 180)

  function frame() {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    t += 0.004

    const bands = [
      { phase: 0, amp: 0.12, yBase: 0.22, width: 0.32, cr: r, cg: g, cb: b },
      { phase: 1.8, amp: 0.09, yBase: 0.30, width: 0.25, cr: r2, cg: g2, cb: b2 },
      { phase: 3.5, amp: 0.11, yBase: 0.18, width: 0.20, cr: Math.round((r + r2) / 2), cg: Math.round((g + g2) / 2), cb: Math.round((b + b2) / 2) },
    ]

    bands.forEach(({ phase, amp, yBase, width, cr, cg, cb }) => {
      const points: [number, number][] = []
      const steps = 80
      for (let i = 0; i <= steps; i++) {
        const px = (i / steps) * cvs.width
        const wave = Math.sin(t * 0.9 + phase + (i / steps) * Math.PI * 3) * amp
             + Math.sin(t * 1.4 + phase * 1.3 + (i / steps) * Math.PI * 5) * amp * 0.4
        const py = (yBase + wave) * cvs.height
        points.push([px, py])
      }

      const bandH = width * cvs.height
      const topY = points[0][1] - bandH / 2
      const grd = ctx.createLinearGradient(0, topY, 0, topY + bandH)
      grd.addColorStop(0, `rgba(${cr},${cg},${cb},0)`)
      grd.addColorStop(0.35, `rgba(${cr},${cg},${cb},0.18)`)
      grd.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.28)`)
      grd.addColorStop(0.65, `rgba(${cr},${cg},${cb},0.18)`)
      grd.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)

      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1] - bandH / 2)
      points.forEach(([px, py]) => ctx.lineTo(px, py - bandH / 2))
      points.slice().reverse().forEach(([px, py]) => ctx.lineTo(px, py + bandH / 2))
      ctx.closePath()
      ctx.fillStyle = grd; ctx.fill()
    })

    animId = requestAnimationFrame(frame)
  }
  animId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(animId)
}

// ─── Bubbles ───────────────────────────────────────────────────────────────────
function animBubbles(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, [r, g, b]: [number, number, number]): () => void {
  const rgb = `${r},${g},${b}`
  interface Bubble { x: number; y: number; vy: number; size: number; opacity: number; wobble: number; wobbleV: number; wobbleAmp: number }
  const COUNT = 22
  let animId: number

  function makeBubble(spreadY = false): Bubble {
    return {
      x: Math.random() * cvs.width,
      y: spreadY ? Math.random() * cvs.height : cvs.height + 20,
      vy: -(Math.random() * 0.6 + 0.3),
      size: Math.random() * 18 + 8,
      opacity: Math.random() * 0.25 + 0.1,
      wobble: Math.random() * Math.PI * 2,
      wobbleV: Math.random() * 0.012 + 0.005,
      wobbleAmp: Math.random() * 0.5 + 0.3,
    }
  }

  const bubbles: Bubble[] = Array.from({ length: COUNT }, () => makeBubble(true))

  function frame() {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    bubbles.forEach((bu, i) => {
      bu.wobble += bu.wobbleV
      bu.x += Math.sin(bu.wobble) * bu.wobbleAmp
      bu.y += bu.vy
      if (bu.y < -bu.size * 2) { bubbles[i] = makeBubble(); return }

      // Bubble ring
      ctx.beginPath(); ctx.arc(bu.x, bu.y, bu.size, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${rgb},${bu.opacity * 1.4})`
      ctx.lineWidth = 1
      ctx.stroke()

      // Inner glow
      const grd = ctx.createRadialGradient(bu.x - bu.size * 0.3, bu.y - bu.size * 0.3, 0, bu.x, bu.y, bu.size)
      grd.addColorStop(0, `rgba(255,255,255,${bu.opacity * 0.5})`)
      grd.addColorStop(0.4, `rgba(${rgb},${bu.opacity * 0.15})`)
      grd.addColorStop(1, `rgba(${rgb},0)`)
      ctx.beginPath(); ctx.arc(bu.x, bu.y, bu.size, 0, Math.PI * 2)
      ctx.fillStyle = grd; ctx.fill()

      // Highlight specular
      ctx.beginPath(); ctx.arc(bu.x - bu.size * 0.32, bu.y - bu.size * 0.32, bu.size * 0.22, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${bu.opacity * 1.8})`; ctx.fill()
    })
    animId = requestAnimationFrame(frame)
  }
  animId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(animId)
}

// ─── Component ─────────────────────────────────────────────────────────────────
const animators: Record<AnimationType, (c: HTMLCanvasElement, x: CanvasRenderingContext2D, rgb: [number, number, number]) => () => void> = {
  'shooting-stars': animShootingStars,
  'fireflies': animFireflies,
  'sakura': animSakura,
  'glitter': animGlitter,
  'snow': animSnow,
  'aurora': animAurora,
  'bubbles': animBubbles,
}

export default function HeroAnimation({ type = 'shooting-stars' }: { type?: AnimationType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cvs = canvas
    const context = ctx

    const resize = () => { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    const rgb = getAccentRgb()
    const stop = (animators[type] ?? animators['shooting-stars'])(cvs, context, rgb)

    return () => { stop(); window.removeEventListener('resize', resize) }
  }, [type])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
