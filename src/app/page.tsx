import characterData from '@/data/character.json'
import type { CharacterData, NavItem } from '@/types'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import RPSection from '@/components/RPSection'
import JobsSection from '@/components/JobsSection'
import FCSection from '@/components/FCSection'
import GallerySection from '@/components/GallerySection'
import SocialLinksSection from '@/components/SocialLinks'
import Footer from '@/components/Footer'

const data = characterData as CharacterData

// Section is visible when: not explicitly disabled AND has content
const s = data.sections ?? {}
const show = (key: keyof NonNullable<CharacterData['sections']>, hasData = true) =>
  s[key] !== false && hasData

const nl = data.navLabels ?? {}
const labels = {
  about:   nl.about   ?? 'About',
  rp:      nl.rp      ?? 'Character',
  jobs:    nl.jobs    ?? 'Jobs',
  fc:      nl.fc      ?? 'Free Company',
  gallery: nl.gallery ?? 'Gallery',
  social:  nl.social  ?? 'Social',
}

const navItems: NavItem[] = [
  show('about')                              && { id: 'about',   label: labels.about },
  show('rp',      !!data.rp)                && { id: 'rp',      label: labels.rp },
  show('jobs',    data.jobs.length > 0)     && { id: 'jobs',    label: labels.jobs },
  show('fc',      !!data.freeCompany)       && { id: 'fc',      label: labels.fc },
  show('gallery', data.gallery.length > 0)  && { id: 'gallery', label: labels.gallery },
  show('social',  data.socialLinks.length > 0) && { id: 'social', label: labels.social },
].filter(Boolean) as NavItem[]

const pronouns = data.rp?.tags?.find(
  (t) => t.label.toLowerCase() === 'pronouns'
)?.value

export default function Home() {
  return (
    <>
      <Navigation characterName={data.name} navItems={navItems} />
      <main>
        <HeroSection
          data={{
            name: data.name,
            title: data.title,
            mainJob: data.mainJob,
            mainJobIcon: data.mainJobIcon,
            server: data.server,
            datacenter: data.datacenter,
            race: data.race,
            clan: data.clan,
            heroImage: data.heroImage,
            heroImageAlt: data.heroImageAlt,
            heroBgImage: data.heroBgImage,
            theme: data.theme,
            pronouns,
          }}
        />
        {show('about') && (
          <AboutSection data={{ name: data.name, about: data.about }} label={labels.about} />
        )}
        {show('rp', !!data.rp) && (
          <RPSection data={{ rp: data.rp }} label={labels.rp} />
        )}
        {show('jobs', data.jobs.length > 0) && (
          <JobsSection data={{ jobs: data.jobs }} label={labels.jobs} />
        )}
        {show('fc', !!data.freeCompany) && (
          <FCSection data={{ freeCompany: data.freeCompany }} label={labels.fc} />
        )}
        {show('gallery', data.gallery.length > 0) && (
          <GallerySection data={{ gallery: data.gallery }} label={labels.gallery} />
        )}
        {show('social', data.socialLinks.length > 0) && (
          <SocialLinksSection data={{ socialLinks: data.socialLinks, name: data.name }} label={labels.social} />
        )}
      </main>
      <Footer
        data={{
          name: data.name,
          mainJob: data.mainJob,
          server: data.server,
          footer: data.footer,
        }}
      />
    </>
  )
}
