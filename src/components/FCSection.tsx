'use client'

import Image from 'next/image'
import { useState } from 'react'
import FadeIn from './FadeIn'
import type { CharacterData } from '@/types'

export default function FCSection({ data, label = 'Free Company' }: { data: Pick<CharacterData, 'freeCompany'>; label?: string }) {
  const { freeCompany: fc } = data
  const [crestFailed, setCrestFailed] = useState(false)
  if (!fc) return null

  const meta = [
    fc.rank   ? { label: 'Rank',       value: fc.rank }                                    : null,
    fc.server ? { label: 'Server',     value: fc.server }                                  : null,
    fc.datacenter ? { label: 'DC',     value: fc.datacenter }                              : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <section
      id="fc"
      className="relative py-24 md:py-32"
      style={{ backgroundColor: 'var(--color-ffxiv-surface)' }}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
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

        {/* FC Banner Card */}
        <FadeIn delay={100}>
          <div
            className="max-w-3xl mx-auto rounded-sm overflow-hidden"
            style={{
              boxShadow: 'var(--ffxiv-card-shadow)',
              border: '1px solid var(--color-ffxiv-border)',
            }}
          >
            {/* Gold top bar */}
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold), var(--color-ffxiv-gold-light), var(--color-ffxiv-gold), transparent)' }}
            />

            <div
              className="flex flex-col sm:flex-row gap-0"
              style={{ backgroundColor: 'var(--color-ffxiv-surface-2)' }}
            >
              {/* Top/Left: crest column */}
              <div
                className="flex items-center justify-center shrink-0 px-8 py-6 sm:py-8 border-b sm:border-b-0 sm:border-r"
                style={{
                  borderColor: 'var(--color-ffxiv-border)',
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-ffxiv-gold) 6%, var(--color-ffxiv-surface-2)) 0%, var(--color-ffxiv-surface-2) 100%)',
                }}
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg">
                  {fc.crestImages && fc.crestImages.length > 0 && !crestFailed ? (
                    fc.crestImages.map((src, i) => (
                      <Image
                        key={i}
                        src={src}
                        alt={i === 0 ? `${fc.name} FC crest` : ''}
                        fill
                        className="object-contain"
                        style={{ zIndex: i }}
                        onError={() => setCrestFailed(true)}
                      />
                    ))
                  ) : (
                    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-35">
                      <path d="M40 8 L68 20 L68 44 C68 58 40 72 40 72 C40 72 12 58 12 44 L12 20 Z"
                            stroke="var(--color-ffxiv-gold)" strokeWidth="1.5" fill="none"/>
                      <path d="M40 16 L60 26 L60 44 C60 54 40 64 40 64 C40 64 20 54 20 44 L20 26 Z"
                            stroke="var(--color-ffxiv-gold)" strokeWidth="0.8" fill="none"/>
                      <line x1="40" y1="24" x2="40" y2="56" stroke="var(--color-ffxiv-gold)" strokeWidth="1"/>
                      <line x1="26" y1="38" x2="54" y2="38" stroke="var(--color-ffxiv-gold)" strokeWidth="1"/>
                      <circle cx="40" cy="38" r="3" stroke="var(--color-ffxiv-gold)" strokeWidth="1" fill="none"/>
                    </svg>
                  )}
                </div>
              </div>

              {/* Bottom/Right: info column */}
              <div className="flex flex-col justify-center gap-3 px-6 py-6 sm:px-8 sm:py-7 min-w-0 flex-1">
                {/* Tag + Name */}
                <div className="flex flex-col gap-1">
                  {fc.tag && (
                    <span
                      className="text-xs tracking-[0.25em] uppercase"
                      style={{ color: 'var(--color-ffxiv-gold)', fontFamily: 'var(--font-cinzel, serif)', opacity: 0.8 }}
                    >
                      «{fc.tag}»
                    </span>
                  )}
                  <h3
                    className="text-2xl sm:text-3xl font-bold leading-tight"
                    style={{ fontFamily: 'var(--font-cinzel, serif)', color: 'var(--color-ffxiv-text)' }}
                  >
                    {fc.name}
                  </h3>
                </div>

                {/* Divider */}
                <div
                  className="h-px"
                  style={{ background: 'linear-gradient(90deg, var(--color-ffxiv-gold-dark), transparent)', opacity: 0.5 }}
                />

                {/* Meta inline */}
                {meta.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2" style={{ lineHeight: 1 }}>
                    {meta.map((item) => (
                      <span key={item.label} className="inline-flex items-center gap-1.5 whitespace-nowrap" style={{ lineHeight: 1 }}>
                        <span style={{ color: 'var(--color-ffxiv-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: 1 }}>
                          {item.label}
                        </span>
                        <span style={{ color: 'var(--color-ffxiv-gold)', fontSize: '0.5rem', opacity: 0.6, lineHeight: 1 }}>✦</span>
                        <span style={{ color: 'var(--color-ffxiv-gold)', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1 }}>
                          {item.value}
                        </span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {fc.description && (
                  <>
                    <div className="h-px" style={{ backgroundColor: 'var(--color-ffxiv-border)', opacity: 0.6 }} />
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ffxiv-muted)' }}>
                      {fc.description}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Gold bottom bar */}
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark), transparent)', opacity: 0.5 }}
            />
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
