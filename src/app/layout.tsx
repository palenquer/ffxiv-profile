import type { Metadata } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import characterData from '@/data/character.json'
import type { CharacterData } from '@/types'
import {
  deriveAccentColors,
  deriveAccentColorsLight,
  deriveDarkPalette,
  deriveLightPalette,
} from '@/lib/theme'
import './globals.css'

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap' })
const inter  = Inter({ subsets: ['latin'], variable: '--font-inter',  display: 'swap' })

const data = characterData as CharacterData
const { name, mainJob, server, datacenter } = data
const bg = data.theme?.background

const darkAccent  = deriveAccentColors(data.theme?.accentColor ?? '')
const lightAccent = deriveAccentColorsLight(data.theme?.accentColor ?? '')
const accent = data.theme?.accentColor ?? ''
const darkPalette  = deriveDarkPalette(bg?.baseColor ?? accent)
const lightPalette = deriveLightPalette(bg?.lightBaseColor ?? accent)

function paletteVars(p: ReturnType<typeof deriveDarkPalette>) {
  if (!p) return ''
  return [
    `--color-ffxiv-darker:${p.darker}`,
    `--color-ffxiv-dark:${p.dark}`,
    `--color-ffxiv-surface:${p.surface}`,
    `--color-ffxiv-surface-2:${p.surface2}`,
    `--color-ffxiv-border:${p.border}`,
    p.text  ? `--color-ffxiv-text:${p.text}`   : '',
    p.muted ? `--color-ffxiv-muted:${p.muted}` : '',
  ].filter(Boolean).join(';')
}

function accentVars(a: ReturnType<typeof deriveAccentColors>) {
  if (!a) return ''
  return `--color-ffxiv-gold:${a.gold};--color-ffxiv-gold-light:${a.goldLight};--color-ffxiv-gold-dark:${a.goldDark}`
}

const themeCSS = [
  darkPalette || darkAccent
    ? `[data-theme="dark"]{${[paletteVars(darkPalette), accentVars(darkAccent)].filter(Boolean).join(';')}}`
    : '',
  lightPalette || lightAccent
    ? `[data-theme="light"]{${[paletteVars(lightPalette), accentVars(lightAccent)].filter(Boolean).join(';')}}`
    : '',
].filter(Boolean).join('')

const defaultMode = data.theme?.mode ?? 'dark'

export const metadata: Metadata = {
  title: `${name} — FFXIV Character Profile`,
  description: `${mainJob} on ${server} (${datacenter}). Character profile for ${name} in Final Fantasy XIV.`,
  keywords: ['FFXIV', 'Final Fantasy XIV', 'character profile', mainJob, name],
  openGraph: {
    title: `${name} — FFXIV Character Profile`,
    description: `${mainJob} on ${server} (${datacenter}).`,
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme={defaultMode} className={`${cinzel.variable} ${inter.variable}`}>
      <head>
        {themeCSS && <style dangerouslySetInnerHTML={{ __html: themeCSS }} />}
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
