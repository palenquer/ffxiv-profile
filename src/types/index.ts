export interface Job {
  name: string
  icon: string
  level: number
  role: 'tank' | 'healer' | 'dps'
  isFavorite?: boolean
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  caption?: string
}

export interface SocialLink {
  platform: 'discord' | 'carrd' | 'twitter' | 'twitch' | 'bluesky' | 'instagram'
  label: string
  url: string
  username?: string
}

export interface RPTag {
  label: string
  value: string
}

export interface RPData {
  tags?: RPTag[]
  hooks?: string[]
  oocNote?: string
}

export interface FCData {
  name: string
  tag?: string
  rank?: string
  server?: string
  datacenter?: string
  description?: string
  crestImages?: string[]
}

export interface NavItem {
  id: string
  label: string
}

export interface NavLabels {
  about?: string
  rp?: string
  jobs?: string
  fc?: string
  gallery?: string
  social?: string
}

export interface CharacterData {
  name: string
  title: string
  mainJob: string
  mainJobIcon: string
  server: string
  datacenter: string
  race: string
  clan: string
  pronouns?: string
  heroImage: string
  heroImageAlt: string
  heroBgImage?: string
  about: {
    tagline: string
    story: string[]
  }
  jobs: Job[]
  gallery: GalleryItem[]
  socialLinks: SocialLink[]
  rp?: RPData
  freeCompany?: FCData
  sections?: {
    about?: boolean
    rp?: boolean
    jobs?: boolean
    fc?: boolean
    gallery?: boolean
    social?: boolean
  }
  navLabels?: NavLabels
  footer: {
    text: string
    year: number
  }
  theme?: {
    mode?: 'dark' | 'light'
    accentColor: string
    animation?: 'shooting-stars' | 'fireflies' | 'sakura' | 'glitter' | 'snow' | 'aurora' | 'bubbles'
    background?: {
      baseColor?: string
      lightBaseColor?: string
      overlayOpacity?: number
      blur?: boolean
      position?: 'top' | 'center' | 'bottom'
    }
  }
}
