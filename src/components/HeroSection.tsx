'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import type { CharacterData } from '@/types'
import ShootingStars from './ShootingStars'

interface HeroSectionProps {
  data: Pick<CharacterData, 'name' | 'title' | 'mainJob' | 'mainJobIcon' | 'server' | 'datacenter' | 'race' | 'clan' | 'heroImage' | 'heroImageAlt' | 'heroBgImage' | 'theme'> & { pronouns?: string }
}

export default function HeroSection({ data }: HeroSectionProps) {
  const { name, title, mainJob, server, datacenter, race, clan, heroImage, heroImageAlt, heroBgImage, theme, pronouns } = data
  const bgImage = heroBgImage || heroImage
  const bgOpacity = theme?.background?.overlayOpacity ?? 0.35
  const bgBlur = theme?.background?.blur ? 'blur(8px)' : 'none'
  const bgPosition = theme?.background?.position ?? 'top'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const appear = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  })

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--color-ffxiv-darker)' }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={heroImageAlt}
          fill
          priority
          className="object-cover"
          style={{ opacity: bgOpacity, filter: bgBlur, objectPosition: bgPosition }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-ffxiv-darker) 20%, transparent) 0%, color-mix(in srgb, var(--color-ffxiv-darker) 50%, transparent) 60%, var(--color-ffxiv-darker) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 70% 50%, transparent 30%, color-mix(in srgb, var(--color-ffxiv-darker) 80%, transparent) 100%)',
          }}
        />
      </div>

      {/* Shooting stars canvas */}
      <ShootingStars />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 40%, color-mix(in srgb, var(--color-ffxiv-gold) 6%, transparent) 0%, transparent 70%)',
          animation: 'pulse-glow 5s ease-in-out infinite',
        }}
      />

      {/* Corner ornaments */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 w-full flex flex-col items-center gap-8 pt-24 pb-8">
        {/* Avatar */}
        <div
          className="flex shrink-0 relative items-center justify-center w-52 h-52 md:w-60 md:h-60"
          style={appear(0)}
        >
          {/* Outer pulsing ring */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: '1px solid var(--color-ffxiv-gold-dark)',
              opacity: 0.3,
              animation: 'pulse-glow 5s ease-in-out infinite',
            }}
          />
          {/* Middle static ring */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: '10px',
              border: '1px solid var(--color-ffxiv-gold)',
              opacity: 0.15,
            }}
          />
          {/* Avatar circle */}
          <div
            className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden"
            style={{
              border: '2px solid var(--color-ffxiv-gold)',
              boxShadow: '0 0 40px color-mix(in srgb, var(--color-ffxiv-gold) 25%, transparent), 0 0 80px color-mix(in srgb, var(--color-ffxiv-gold) 10%, transparent)',
            }}
          >
            <Image
              src={heroImage}
              alt={heroImageAlt}
              fill
              className="object-cover object-top"
            />
          </div>
          {/* Diamond ornament */}
          <span
            className="absolute -bottom-1 text-sm"
            style={{ color: 'var(--color-ffxiv-gold)', opacity: 0.6 }}
          >
            ✦
          </span>
        </div>

        {/* Text block */}
        <div className="text-center w-full">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 justify-center" style={appear(150)}>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-ffxiv-gold-dark)' }} />
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: 'var(--color-ffxiv-gold)', fontFamily: 'var(--font-cinzel, serif)' }}
            >
              {race} · {clan}
            </span>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-ffxiv-gold-dark)' }} />
          </div>

          {/* Name */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none tracking-tight mb-4"
            style={{
              fontFamily: 'var(--font-cinzel, serif)',
              background: 'linear-gradient(90deg, var(--color-ffxiv-gold-dark), var(--color-ffxiv-gold-light), var(--color-ffxiv-gold), var(--color-ffxiv-gold-light), var(--color-ffxiv-gold-dark))',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 7s linear infinite',
              ...appear(250),
            }}
          >
            {name}
          </h1>

          {/* Title */}
          <p
            className="text-base sm:text-lg tracking-widest uppercase mb-8"
            style={{ color: 'var(--color-ffxiv-text)', fontFamily: 'var(--font-cinzel, serif)', ...appear(350) }}
          >
            {title}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8 justify-center" style={appear(450)}>
            <div
              className="h-px flex-1 max-w-20"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark))' }}
            />
            <span style={{ color: 'var(--color-ffxiv-gold)' }}>✦</span>
            <div
              className="h-px flex-1 max-w-20"
              style={{ background: 'linear-gradient(90deg, var(--color-ffxiv-gold-dark), transparent)' }}
            />
          </div>

          {/* Meta tags */}
          <div className="flex flex-wrap justify-center" style={{ ...appear(550), alignItems: 'center', lineHeight: 1 }}>
            {[
              { label: 'Job', value: mainJob },
              { label: 'Server', value: server },
              { label: 'DC', value: datacenter },
              ...(pronouns ? [{ label: 'Pronouns', value: pronouns }] : []),
            ].map((item, i) => (
              <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                {i > 0 && (
                  <span style={{ color: 'var(--color-ffxiv-muted)', opacity: 0.4, fontSize: '0.85rem', margin: '0 0.625rem', lineHeight: 1 }}>·</span>
                )}
                <span style={{ color: 'var(--color-ffxiv-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: 1 }}>
                  {item.label}
                </span>
                <span style={{ color: 'var(--color-ffxiv-gold)', fontSize: '0.6rem', opacity: 0.6, lineHeight: 1 }}>✦</span>
                <span style={{ color: 'var(--color-ffxiv-gold)', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1 }}>
                  {item.value}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault()
          document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group cursor-pointer"
        aria-label="Scroll to About"
        style={appear(800)}
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: 'var(--color-ffxiv-muted)' }}
        >
          Scroll
        </span>
        <ChevronDown
          size={16}
          className="animate-bounce"
          style={{ color: 'var(--color-ffxiv-gold)' }}
        />
      </a>
    </section>
  )
}


function CornerOrnament({ position }: { position: string }) {
  const posMap: Record<string, string> = {
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6 rotate-90',
    'bottom-left': 'bottom-6 left-6 -rotate-90',
    'bottom-right': 'bottom-6 right-6 rotate-180',
  }
  return (
    <div
      className={`absolute ${posMap[position]} z-10 w-8 h-8 opacity-40`}
      style={{ color: 'var(--color-ffxiv-gold)' }}
    >
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z" fill="currentColor" />
        <path d="M0 0 L0 16 L1 16 L1 1 L16 1 L16 0 Z" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  )
}

