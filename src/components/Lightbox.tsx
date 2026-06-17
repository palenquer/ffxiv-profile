'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryItem } from '@/types'

interface LightboxProps {
  items: GalleryItem[]
  activeIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ items, activeIndex, onClose, onPrev, onNext }: LightboxProps) {
  const item = items[activeIndex]

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
      style={{ backgroundColor: 'var(--ffxiv-lightbox-bg)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      {/* Inner container — stops click propagation */}
      <div
        className="relative max-w-5xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 z-10 p-2 rounded-full transition-colors hover:bg-white/10"
          style={{ color: 'var(--color-ffxiv-muted)', cursor: 'pointer' }}
          aria-label="Close lightbox"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <div
          className="relative w-full"
          style={{
            aspectRatio: '16/9',
            border: '1px solid var(--color-ffxiv-border)',
            boxShadow: '0 0 60px color-mix(in srgb, var(--color-ffxiv-gold) 8%, rgba(0,0,0,0.6))',
          }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>

        {/* Caption */}
        {item.caption && (
          <div className="mt-4 text-center">
            <p style={{ color: 'var(--color-ffxiv-text)' }}>{item.caption}</p>
          </div>
        )}

        {/* Counter */}
        <div className="mt-3">
          <span
            className="text-xs tracking-widest"
            style={{ color: 'var(--color-ffxiv-muted)' }}
          >
            {activeIndex + 1} / {items.length}
          </span>
        </div>
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-200"
        style={{
          color: 'var(--color-ffxiv-gold)',
          border: '1px solid var(--color-ffxiv-gold)',
          backgroundColor: 'color-mix(in srgb, var(--color-ffxiv-gold) 10%, transparent)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-ffxiv-gold) 25%, transparent)' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-ffxiv-gold) 10%, transparent)' }}
        aria-label="Previous image"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-200"
        style={{
          color: 'var(--color-ffxiv-gold)',
          border: '1px solid var(--color-ffxiv-gold)',
          backgroundColor: 'color-mix(in srgb, var(--color-ffxiv-gold) 10%, transparent)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-ffxiv-gold) 25%, transparent)' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-ffxiv-gold) 10%, transparent)' }}
        aria-label="Next image"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  )
}
