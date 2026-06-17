import type { CharacterData } from '@/types'
import SectionDivider from './SectionDivider'

interface FooterProps {
  data: Pick<CharacterData, 'name' | 'mainJob' | 'server' | 'footer'>
}

export default function Footer({ data }: FooterProps) {
  const { name, mainJob, server, footer } = data

  return (
    <footer
      className="relative py-12 px-6"
      style={{ backgroundColor: 'var(--color-ffxiv-darker)' }}
    >
      <SectionDivider position="top" />
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        {/* Logo / name */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-lg font-bold tracking-widest"
            style={{ fontFamily: 'var(--font-cinzel, serif)', color: 'var(--color-ffxiv-gold)' }}
          >
            {name}
          </span>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: 'var(--color-ffxiv-muted)' }}
          >
            {mainJob} · {server}
          </span>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-sm">
          <div
            className="h-px flex-1"
            style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-border))' }}
          />
          <span style={{ color: 'var(--color-ffxiv-gold)', fontSize: '0.6rem' }}>✦</span>
          <div
            className="h-px flex-1"
            style={{ background: 'linear-gradient(90deg, var(--color-ffxiv-border), transparent)' }}
          />
        </div>

        {/* Footer text */}
        <p
          className="text-xs text-center max-w-md leading-relaxed"
          style={{ color: 'var(--color-ffxiv-muted)' }}
        >
          {footer.text}
        </p>

        {/* Copyright */}
        <p
          className="text-xs"
          style={{ color: 'var(--color-ffxiv-border)' }}
        >
          © {footer.year} {name} · FINAL FANTASY XIV © SQUARE ENIX CO., LTD.
        </p>
      </div>
    </footer>
  )
}
