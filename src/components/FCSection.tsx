'use client'

import Image from 'next/image'
import FadeIn from './FadeIn'
import type { CharacterData } from '@/types'

export default function FCSection({ data, label = 'Free Company' }: { data: Pick<CharacterData, 'freeCompany'>; label?: string }) {
  const { freeCompany: fc } = data
  if (!fc) return null

  return (
    <section
      id="fc"
      className="relative py-24 md:py-32"
      style={{ backgroundColor: 'var(--color-ffxiv-surface)' }}
    >

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark))' }} />
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: 'var(--color-ffxiv-gold)', fontFamily: 'var(--font-cinzel, serif)' }}
              >
                Guild
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

        {/* FC Card */}
        <FadeIn delay={100}>
          <div
            className="max-w-2xl mx-auto p-px rounded-sm"
            style={{
              background: 'linear-gradient(135deg, var(--color-ffxiv-gold-dark) 0%, var(--color-ffxiv-border) 35%, var(--color-ffxiv-border) 65%, var(--color-ffxiv-gold-dark) 100%)',
              boxShadow: 'var(--ffxiv-card-shadow)',
            }}
          >
          <div
            className="relative p-8 rounded-sm space-y-6"
            style={{
              backgroundColor: 'var(--color-ffxiv-surface-2)',
            }}
          >

            {/* Crest + name row */}
            <div className="flex items-center gap-5">
              {fc.crestImages && fc.crestImages.length > 0 && (
                <div className="relative w-14 h-14 shrink-0">
                  {fc.crestImages.map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt={i === 0 ? `${fc.name} crest` : ''}
                      fill
                      className="object-contain"
                      style={{ zIndex: i }}
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-0.5 min-w-0">
                {fc.tag && (
                  <span
                    className="text-sm font-bold tracking-wider"
                    style={{ color: 'var(--color-ffxiv-gold)', fontFamily: 'var(--font-cinzel, serif)' }}
                  >
                    «{fc.tag}»
                  </span>
                )}
                <h3
                  className="text-2xl sm:text-3xl font-bold leading-tight"
                  style={{ color: 'var(--color-ffxiv-text)', fontFamily: 'var(--font-cinzel, serif)' }}
                >
                  {fc.name}
                </h3>
              </div>
            </div>

            {/* Metadata */}
            {(fc.rank || fc.server) && (
              <div className="flex flex-wrap gap-3">
                {fc.rank && (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm"
                    style={{
                      backgroundColor: 'var(--color-ffxiv-surface)',
                      border: '1px solid var(--color-ffxiv-border)',
                    }}
                  >
                    <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-ffxiv-muted)' }}>
                      Rank
                    </span>
                    <span style={{ color: 'var(--color-ffxiv-gold)' }}>{fc.rank}</span>
                  </div>
                )}
                {fc.server && (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm"
                    style={{
                      backgroundColor: 'var(--color-ffxiv-surface)',
                      border: '1px solid var(--color-ffxiv-border)',
                    }}
                  >
                    <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-ffxiv-muted)' }}>
                      Server
                    </span>
                    <span style={{ color: 'var(--color-ffxiv-gold)' }}>
                      {fc.server}{fc.datacenter ? ` [${fc.datacenter}]` : ''}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {fc.description && (
              <>
                <div className="h-px" style={{ backgroundColor: 'var(--color-ffxiv-border)' }} />
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ffxiv-text)' }}>
                  {fc.description}
                </p>
              </>
            )}
          </div>
          </div>
        </FadeIn>
      </div>

    </section>
  )
}
