'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import Lightbox from './Lightbox'
import FadeIn from './FadeIn'
import type { CharacterData } from '@/types'

interface GallerySectionProps {
  data: Pick<CharacterData, 'gallery'>
  label?: string
}

export default function GallerySection({ data, label = 'Gallery' }: GallerySectionProps) {
  const { gallery } = data
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' })
  }

  const closeLightbox = () => setActiveIndex(null)
  const goPrev = () => setActiveIndex((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length))
  const goNext = () => setActiveIndex((i) => (i === null ? 0 : (i + 1) % gallery.length))

  return (
    <section
      id="gallery"
      className="relative py-24 md:py-32"
      style={{ backgroundColor: 'var(--color-ffxiv-surface)' }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark), var(--color-ffxiv-gold), var(--color-ffxiv-gold-dark), transparent)' }}
      />

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
                Memories
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

        {/* Carousel */}
        <FadeIn delay={100}>
          <div className="relative">
            {/* Left arrow + fade */}
            <div
              className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1"
              style={{
                background: 'linear-gradient(to right, var(--color-ffxiv-surface) 30%, transparent)',
                width: 72,
                opacity: canPrev ? 1 : 0,
                pointerEvents: canPrev ? 'auto' : 'none',
                transition: 'opacity 0.25s',
              }}
            >
              <button
                onClick={() => scroll(-1)}
                aria-label="Previous images"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  border: '1px solid var(--color-ffxiv-gold)',
                  color: 'var(--color-ffxiv-gold)',
                  backgroundColor: 'color-mix(in srgb, var(--color-ffxiv-gold) 12%, transparent)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.backgroundColor = 'color-mix(in srgb, var(--color-ffxiv-gold) 28%, transparent)'
                  el.style.boxShadow = '0 0 12px color-mix(in srgb, var(--color-ffxiv-gold) 30%, transparent)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.backgroundColor = 'color-mix(in srgb, var(--color-ffxiv-gold) 12%, transparent)'
                  el.style.boxShadow = 'none'
                }}
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            {/* Track */}
            <div
              ref={trackRef}
              onScroll={sync}
              className="no-scrollbar flex gap-4 overflow-x-auto pb-1"
              style={{
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
              }}
            >
              {gallery.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className="group relative shrink-0 overflow-hidden rounded-sm text-left focus:outline-none focus-visible:ring-2"
                  style={{
                    width: 'clamp(240px, 30vw, 360px)',
                    aspectRatio: '16/9',
                    scrollSnapAlign: 'start',
                    border: '1px solid var(--color-ffxiv-border)',
                  }}
                  aria-label={`View ${item.alt}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 360px"
                  />

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2"
                    style={{ background: 'color-mix(in srgb, var(--color-ffxiv-darker) 75%, transparent)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ border: '1px solid var(--color-ffxiv-gold)', backgroundColor: 'color-mix(in srgb, var(--color-ffxiv-gold) 15%, transparent)' }}
                    >
                      <Camera size={18} style={{ color: 'var(--color-ffxiv-gold)' }} />
                    </div>
                    {item.caption && (
                      <p className="text-sm text-center px-4 leading-relaxed" style={{ color: 'var(--color-ffxiv-text)' }}>
                        {item.caption}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Right arrow + fade */}
            <div
              className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end pr-1"
              style={{
                background: 'linear-gradient(to left, var(--color-ffxiv-surface) 30%, transparent)',
                width: 72,
                opacity: canNext ? 1 : 0,
                pointerEvents: canNext ? 'auto' : 'none',
                transition: 'opacity 0.25s',
              }}
            >
              <button
                onClick={() => scroll(1)}
                aria-label="Next images"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  border: '1px solid var(--color-ffxiv-gold)',
                  color: 'var(--color-ffxiv-gold)',
                  cursor: 'pointer',
                  backgroundColor: 'color-mix(in srgb, var(--color-ffxiv-gold) 12%, transparent)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.backgroundColor = 'color-mix(in srgb, var(--color-ffxiv-gold) 28%, transparent)'
                  el.style.boxShadow = '0 0 12px color-mix(in srgb, var(--color-ffxiv-gold) 30%, transparent)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.backgroundColor = 'color-mix(in srgb, var(--color-ffxiv-gold) 12%, transparent)'
                  el.style.boxShadow = 'none'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Counter */}
          <div className="flex justify-center mt-4">
            <span className="text-xs tracking-widest" style={{ color: 'var(--color-ffxiv-muted)' }}>
              {gallery.length} {gallery.length === 1 ? 'image' : 'images'}
            </span>
          </div>
        </FadeIn>
      </div>

      {activeIndex !== null && (
        <Lightbox
          items={gallery}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {/* Bottom border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark), var(--color-ffxiv-gold), var(--color-ffxiv-gold-dark), transparent)' }}
      />
    </section>
  )
}
