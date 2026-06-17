function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  return [h, Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export interface SurfacePalette {
  darker: string; dark: string; surface: string; surface2: string; border: string
  text?: string; muted?: string
}

// Dark palette — example inputs: "#050508", "#0d0a12", "#050a0e"
export function deriveDarkPalette(hex: string): SurfacePalette | null {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return null
  const [h, s, l] = hexToHsl(hex)
  const base = Math.min(Math.max(l, 1), 12)
  return {
    darker:   hslToHex(h, s, base),
    dark:     hslToHex(h, s, base + 4),
    surface:  hslToHex(h, s, base + 8),
    surface2: hslToHex(h, s, base + 13),
    border:   hslToHex(h, s, base + 20),
  }
}

// Light palette — example inputs: "#f0eef5", "#eef0f5", "#f5f0e8"
export function deriveLightPalette(hex: string): SurfacePalette | null {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return null
  const [h, s, l] = hexToHsl(hex)
  const base = Math.min(Math.max(l, 85), 98)
  const s2 = Math.max(s, 6)
  return {
    darker:   hslToHex(h, s2, base),
    dark:     hslToHex(h, s2, base - 4),
    surface:  hslToHex(h, s2, base - 8),
    surface2: hslToHex(h, s2, base - 13),
    border:   hslToHex(h, s2, base - 20),
    text:     hslToHex(h, Math.max(s, 12), 10),
    muted:    hslToHex(h, Math.max(s, 6),  46),
  }
}

// Accent colors for light backgrounds — darker than dark-mode variant
export function deriveAccentColorsLight(hex: string): { gold: string; goldLight: string; goldDark: string } | null {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return null
  const [h, s, l] = hexToHsl(hex)
  const s2 = Math.max(s, 22)
  const baseL = Math.min(Math.max(l - 20, 25), 48)
  return {
    gold:      hslToHex(h, s2, baseL),
    goldLight: hslToHex(h, s2, Math.min(baseL + 14, 58)),
    // In light mode goldDark trends lighter (toward bg) just as it trends darker in dark mode —
    // this keeps borders/gradients subtle rather than heavy-dark on light backgrounds.
    goldDark:  hslToHex(h, Math.max(s2 - 6, 12), Math.min(baseL + 24, 70)),
  }
}

export function deriveAccentColors(hex: string): { gold: string; goldLight: string; goldDark: string } | null {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return null
  const [h, s, l] = hexToHsl(hex)
  const s2 = Math.max(s, 22)
  // Clamp lightness so the accent stays readable on dark backgrounds
  const baseL = l < 48 ? 57 : l > 70 ? 63 : l
  return {
    gold:      hslToHex(h, s2, baseL),
    goldLight: hslToHex(h, s2, Math.min(baseL + 18, 84)),
    goldDark:  hslToHex(h, s2, Math.max(baseL - 22, 16)),
  }
}
