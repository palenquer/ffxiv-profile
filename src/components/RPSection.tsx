'use client'

import FadeIn from './FadeIn'
import SectionDivider from './SectionDivider'
import type { CharacterData } from '@/types'

export default function RPSection({ data, label = 'Character' }: { data: Pick<CharacterData, 'rp'>; label?: string }) {
  const { rp } = data
  if (!rp) return null

  return (
    <section
      id="rp"
      className="relative py-24 md:py-32"
      style={{ backgroundColor: 'var(--color-ffxiv-darker)' }}
    >
      <SectionDivider position="top" />

      <div className="max-w-6xl mx-auto px-6 space-y-10">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark))' }} />
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: 'var(--color-ffxiv-gold)', fontFamily: 'var(--font-cinzel, serif)' }}
              >
                Roleplay
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ fontFamily: 'var(--font-cinzel, serif)', color: 'var(--color-ffxiv-gold)', textShadow: 'var(--ffxiv-title-shadow)' }}
              >
                {label}
              </h2>
            </div>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, var(--color-ffxiv-gold-dark), transparent)' }} />
          </div>
        </FadeIn>

        {/* Tags grid */}
        {rp.tags && rp.tags.length > 0 && (
          <FadeIn delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {rp.tags.map((tag, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1.5 p-4 rounded-sm"
                  style={{
                    backgroundColor: 'var(--color-ffxiv-surface)',
                    border: '1px solid var(--color-ffxiv-border)',
                  }}
                >
                  <span
                    className="text-xs tracking-widest uppercase"
                    style={{ color: 'var(--color-ffxiv-muted)' }}
                  >
                    {tag.label}
                  </span>
                  <span
                    className="text-sm font-semibold leading-snug"
                    style={{ color: 'var(--color-ffxiv-gold)' }}
                  >
                    {tag.value}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Hooks */}
        {rp.hooks && rp.hooks.length > 0 && (
          <FadeIn delay={200}>
            <div className="space-y-3">
              <h3
                className="text-xs tracking-widest uppercase"
                style={{ color: 'var(--color-ffxiv-muted)' }}
              >
                RP Hooks
              </h3>
              <div className="flex flex-wrap gap-2">
                {rp.hooks.map((hook, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-sm text-xs tracking-wide cursor-default"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-ffxiv-gold) 10%, var(--color-ffxiv-surface))',
                      border: '1px solid var(--color-ffxiv-gold-dark)',
                      color: 'var(--color-ffxiv-gold)',
                      transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-ffxiv-gold) 20%, var(--color-ffxiv-surface))'
                      e.currentTarget.style.boxShadow = '0 0 10px var(--color-ffxiv-gold-dark)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-ffxiv-gold) 10%, var(--color-ffxiv-surface))'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    #{hook}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* OOC Note */}
        {rp.oocNote && (
          <FadeIn delay={300}>
            <div
              className="relative p-5 rounded-sm"
              style={{
                backgroundColor: 'var(--color-ffxiv-surface)',
                border: '1px solid var(--color-ffxiv-border)',
              }}
            >
              <span
                className="absolute -top-2.5 left-4 px-2 text-xs tracking-widest uppercase"
                style={{
                  backgroundColor: 'var(--color-ffxiv-darker)',
                  color: 'var(--color-ffxiv-muted)',
                }}
              >
                OOC
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ffxiv-text)' }}>
                {rp.oocNote}
              </p>
            </div>
          </FadeIn>
        )}
      </div>

      <SectionDivider position="bottom" />
    </section>
  )
}
