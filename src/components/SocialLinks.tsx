'use client'

import type { CharacterData, SocialLink } from '@/types'
import FadeIn from './FadeIn'

interface SocialLinksSectionProps {
  data: Pick<CharacterData, 'socialLinks' | 'name'>
}

const platformIcons: Record<SocialLink['platform'], string> = {
  discord: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.133 18.114a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  twitch: 'M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z',
  carrd: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z',
  bluesky: 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
}

const platformColors: Record<SocialLink['platform'], string> = {
  discord: '#5865F2',
  twitter: '#1DA1F2',
  twitch: '#9146FF',
  carrd: '#c8a84b',
  bluesky: '#0085FF',
  instagram: '#E1306C',
}

function SocialRow({ link, isLast }: { link: SocialLink; isLast: boolean }) {
  const color = platformColors[link.platform]
  const iconPath = platformIcons[link.platform]

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 py-4 focus:outline-none"
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--color-ffxiv-border)',
        textDecoration: 'none',
        transition: 'padding-left 0.2s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = '10px' }}
      onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '0px' }}
    >
      {/* Icon */}
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" style={{ fill: color, opacity: 0.8 }}>
        <path d={iconPath} />
      </svg>

      {/* Text */}
      <div className="flex-1 min-w-0 flex items-baseline gap-2.5">
        <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--color-ffxiv-text)' }}>
          {link.label}
        </span>
        {link.username && (
          <span className="text-xs truncate" style={{ color: 'var(--color-ffxiv-muted)' }}>
            {link.username}
          </span>
        )}
      </div>

      {/* Arrow */}
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        style={{ color }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
      </svg>
    </a>
  )
}

export default function SocialLinksSection({ data, label = 'Social' }: SocialLinksSectionProps & { label?: string }) {
  const { socialLinks, name } = data

  return (
    <section
      id="social"
      className="relative py-24 md:py-32"
      style={{ backgroundColor: 'var(--color-ffxiv-surface)' }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark), var(--color-ffxiv-gold), var(--color-ffxiv-gold-dark), transparent)' }}
      />

      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="h-px flex-1"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark))' }}
            />
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: 'var(--color-ffxiv-gold)', fontFamily: 'var(--font-cinzel, serif)' }}
              >
                Find Me
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ fontFamily: 'var(--font-cinzel, serif)', color: 'var(--color-ffxiv-gold)', textShadow: 'var(--ffxiv-title-shadow)' }}
              >
                {label}
              </h2>
            </div>
            <div
              className="h-px flex-1"
              style={{ background: 'linear-gradient(90deg, var(--color-ffxiv-gold-dark), transparent)' }}
            />
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--color-ffxiv-muted)' }}>
            Come say hi — {name} is always open to new adventures.
          </p>
        </FadeIn>

        {/* Rows */}
        <div style={{ borderTop: '1px solid var(--color-ffxiv-border)' }}>
          {socialLinks.map((link, index) => (
            <FadeIn key={link.platform} delay={index * 80 + 150}>
              <SocialRow link={link} isLast={index === socialLinks.length - 1} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
