import type { CharacterData } from '@/types'
import FadeIn from './FadeIn'

interface AboutSectionProps {
  data: Pick<CharacterData, 'name' | 'about'>
  label?: string
}

export default function AboutSection({ data, label = 'About' }: AboutSectionProps) {
  const { name, about } = data

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--color-ffxiv-darker)' }}
    >

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Section header */}
        <FadeIn>
          <div className="flex items-center gap-4 mb-16">
            <div
              className="h-px flex-1"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark))' }}
            />
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: 'var(--color-ffxiv-gold)', fontFamily: 'var(--font-cinzel, serif)' }}
              >
                Lore Entry
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

        {/* Tagline */}
        <FadeIn delay={100}>
          <div
            className="relative mb-12 py-6 px-8 text-center"
            style={{
              borderTop: '1px solid var(--color-ffxiv-gold-dark)',
              borderBottom: '1px solid var(--color-ffxiv-gold-dark)',
            }}
          >
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4"
              style={{ background: 'linear-gradient(to right, transparent, var(--color-ffxiv-darker) 25%, var(--color-ffxiv-darker) 75%, transparent)', color: 'var(--color-ffxiv-gold)' }}
            >
              ✦
            </span>
            <p
              className="text-xl sm:text-2xl italic"
              style={{
                fontFamily: 'var(--font-cinzel, serif)',
                color: 'var(--color-ffxiv-gold-light)',
              }}
            >
              &ldquo;{about.tagline}&rdquo;
            </p>
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4"
              style={{ background: 'linear-gradient(to right, transparent, var(--color-ffxiv-darker) 25%, var(--color-ffxiv-darker) 75%, transparent)', color: 'var(--color-ffxiv-gold)' }}
            >
              ✦
            </span>
          </div>
        </FadeIn>

        {/* Story paragraphs */}
        <div className="space-y-6">
          {about.story.map((paragraph, index) => (
            <FadeIn key={index} delay={index * 100 + 200}>
              <p
                className="text-base sm:text-lg leading-relaxed text-center"
                style={{ color: 'var(--color-ffxiv-text)', lineHeight: '1.9' }}
              >
                {paragraph}
              </p>
            </FadeIn>
          ))}
        </div>

        {/* Name flourish */}
        <FadeIn delay={500}>
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark))' }} />
            <span
              className="text-sm tracking-[0.25em] uppercase"
              style={{ color: 'var(--color-ffxiv-muted)', fontFamily: 'var(--font-cinzel, serif)' }}
            >
              {name}
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--color-ffxiv-gold-dark), transparent)' }} />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
