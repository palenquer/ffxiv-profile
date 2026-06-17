#!/usr/bin/env node
/**
 * FFXIV Profile Setup Script
 *
 * Usage:
 *   npm run setup               ← reads LODESTONE_ID from .env.local
 *   npm run setup -- 48463380   ← explicit ID (overrides .env.local)
 *
 * What it does:
 *   1. Reads LODESTONE_ID from .env.local (or CLI arg)
 *   2. Fetches character data from XIVAPI (name, race, server, jobs, portrait)
 *   3. Downloads the official Lodestone portrait to public/images/hero.jpg
 *   4. Writes src/data/character.json with all auto-filled fields
 *   5. When the Lodestone ID changes, resets character data for the new character
 *   6. Preserves manual fields (about story, social links) only for the SAME character
 *   7. Prints a checklist of what still needs manual editing
 */

import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CHARACTER_JSON = join(ROOT, 'src/data/character.json')
const HERO_IMAGE = join(ROOT, 'public/images/hero.jpg')

// ─── Read .env.local ──────────────────────────────────────────────────────────
// Node does not auto-load .env files — we parse it manually.
async function loadEnvLocal() {
  try {
    const content = await readFile(join(ROOT, '.env.local'), 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx < 0) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      // CLI env vars take precedence over .env.local
      if (key && !(key in process.env)) process.env[key] = val
    }
  } catch { /* .env.local is optional */ }
}

// ─── Mappings ────────────────────────────────────────────────────────────────

const JOB_ID_MAP = {
  19: 'PLD', 21: 'WAR', 32: 'DRK', 37: 'GNB',
  24: 'WHM', 28: 'SCH', 33: 'AST', 40: 'SGE',
  20: 'MNK', 22: 'DRG', 30: 'NIN', 34: 'SAM', 39: 'RPR', 41: 'VPR',
  23: 'BRD', 31: 'MCH', 38: 'DNC',
  25: 'BLM', 27: 'SMN', 35: 'RDM', 36: 'BLU', 42: 'PCT',
  8: 'CRP', 9: 'BSM', 10: 'ARM', 11: 'GSM', 12: 'LTW',
  13: 'WVR', 14: 'ALC', 15: 'CUL',
  16: 'MIN', 17: 'BTN', 18: 'FSH',
}

const JOB_NAMES = {
  PLD: 'Paladin', WAR: 'Warrior', DRK: 'Dark Knight', GNB: 'Gunbreaker',
  WHM: 'White Mage', SCH: 'Scholar', AST: 'Astrologian', SGE: 'Sage',
  MNK: 'Monk', DRG: 'Dragoon', NIN: 'Ninja', SAM: 'Samurai', RPR: 'Reaper', VPR: 'Viper',
  BRD: 'Bard', MCH: 'Machinist', DNC: 'Dancer',
  BLM: 'Black Mage', SMN: 'Summoner', RDM: 'Red Mage', BLU: 'Blue Mage', PCT: 'Pictomancer',
  CRP: 'Carpenter', BSM: 'Blacksmith', ARM: 'Armorer', GSM: 'Goldsmith',
  LTW: 'Leatherworker', WVR: 'Weaver', ALC: 'Alchemist', CUL: 'Culinarian',
  MIN: 'Miner', BTN: 'Botanist', FSH: 'Fisher',
}

const JOB_ROLES = {
  PLD: 'tank', WAR: 'tank', DRK: 'tank', GNB: 'tank',
  WHM: 'healer', SCH: 'healer', AST: 'healer', SGE: 'healer',
  MNK: 'dps', DRG: 'dps', NIN: 'dps', SAM: 'dps', RPR: 'dps', VPR: 'dps',
  BRD: 'dps', MCH: 'dps', DNC: 'dps',
  BLM: 'dps', SMN: 'dps', RDM: 'dps', BLU: 'dps', PCT: 'dps',
  CRP: 'crafter', BSM: 'crafter', ARM: 'crafter', GSM: 'crafter',
  LTW: 'crafter', WVR: 'crafter', ALC: 'crafter', CUL: 'crafter',
  MIN: 'gatherer', BTN: 'gatherer', FSH: 'gatherer',
}

const RACE_MAP = {
  1: { race: 'Hyur',     clans: { 1: 'Midlander', 2: 'Highlander' } },
  2: { race: 'Elezen',   clans: { 3: 'Wildwood', 4: 'Duskwight' } },
  3: { race: 'Lalafell', clans: { 5: 'Plainsfolk', 6: 'Dunesfolk' } },
  4: { race: "Miqo'te",  clans: { 7: 'Seeker of the Sun', 8: 'Keeper of the Moon' } },
  5: { race: 'Roegadyn', clans: { 9: 'Sea Wolf', 10: 'Hellsguard' } },
  6: { race: 'Au Ra',    clans: { 11: 'Raen', 12: 'Xaela' } },
  7: { race: 'Hrothgar', clans: { 13: 'Helions', 14: 'The Lost' } },
  8: { race: 'Viera',    clans: { 15: 'Rava', 16: 'Veena' } },
}

const GALLERY_TEMPLATE = [
  { id: 'g1', src: '/images/gallery/image-01.png', alt: 'Gallery image 1', caption: '' },
  { id: 'g2', src: '/images/gallery/image-02.png', alt: 'Gallery image 2', caption: '' },
  { id: 'g3', src: '/images/gallery/image-03.png', alt: 'Gallery image 3', caption: '' },
  { id: 'g4', src: '/images/gallery/image-04.png', alt: 'Gallery image 4', caption: '' },
  { id: 'g5', src: '/images/gallery/image-05.png', alt: 'Gallery image 5', caption: '' },
  { id: 'g6', src: '/images/gallery/image-06.png', alt: 'Gallery image 6', caption: '' },
]

const SOCIAL_TEMPLATE = [
  { platform: 'discord', label: 'Discord', url: 'https://discord.com/users/yourhandle', username: 'yourhandle' },
  { platform: 'twitter', label: 'Twitter / X', url: 'https://twitter.com/yourhandle', username: '@yourhandle' },
  { platform: 'carrd',   label: 'Carrd', url: 'https://yourname.carrd.co', username: 'yourname.carrd.co' },
  { platform: 'twitch',  label: 'Twitch', url: 'https://twitch.tv/yourhandle', username: 'yourhandle' },
]

// ─── Reverse map: "Pictomancer" → "PCT" ──────────────────────────────────────
const JOB_NAME_TO_ABBREV = Object.fromEntries(
  Object.entries(JOB_NAMES).map(([abbrev, name]) => [name, abbrev])
)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
  if (!res.ok) return null
  const json = await res.json()
  return json?.Error ? null : json
}

async function getHtml(url) {
  const res = await fetch(url, {
    headers: BROWSER_HEADERS,
    signal: AbortSignal.timeout(12_000),
  })
  if (!res.ok) return ''
  return res.text()
}

async function downloadFile(url, dest) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) })
  if (!res.ok) return false
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
  return true
}

// ─── Lodestone HTML parser ────────────────────────────────────────────────────

function parseLodestoneCharPage(html) {
  if (html.length < 5000) return null

  const pick = (text, ...patterns) => {
    for (const p of patterns) {
      const r = text.match(p)
      if (r?.[1]) return r[1].trim()
    }
    return null
  }

  const name = pick(html,
    /class="frame__chara__name"[^>]*>([^<]+)</,
    /"frame__chara__name">([^<]+)</
  )
  if (!name) return null

  const title = pick(html,
    /class="frame__chara__title"[^>]*>([^<]+)</,
    /frame__chara__title[^>]*>([^<]+)</
  )

  // Server/DC: "Behemoth[Primal]" or "Behemoth <span>[Primal]</span>"
  const worldRaw = pick(html,
    /class="frame__chara__world"[^>]*>([\s\S]{1,100}?)<\/p>/
  ) || ''
  const worldText = worldRaw.replace(/<[^>]+>/g, ' ')
  const server = worldText.match(/([A-Z][A-Za-z]+)/)?.[1] || null
  const dc     = worldText.match(/\[([A-Za-z]+)\]/)?.[1] || null

  // Race + clan: "Lalafell<br>Dunesfolk" pattern
  let race = null, clan = null
  const raceBlock = pick(html,
    /class="character-block__name"[^>]*>([\s\S]{1,200}?)<\/p>/
  )
  if (raceBlock) {
    const parts = raceBlock
      .replace(/<br\s*\/?>/gi, '|||')
      .replace(/<[^>]+>/g, '')
      .split('|||')
      .map(s => s.trim())
      .filter(Boolean)
    race = parts[0] || null
    // Strip trailing gender marker ("Dunesfolk / ♀" → "Dunesfolk")
    clan = parts[1]?.replace(/\s*\/\s*[♂♀].*$/, '').trim() || null
  }

  // Portrait: find fc0.jpg avatar URL → swap to fl0.jpg full body
  const avatarMatch = html.match(/https:\/\/img2\.finalfantasyxiv\.com\/f\/([a-f0-9_]+)fc0\.jpg/)
  const portrait = avatarMatch
    ? `https://img2.finalfantasyxiv.com/f/${avatarMatch[1]}fl0.jpg`
    : null

  // Free Company ID (if character is in one)
  const fcMatch = html.match(/character__freecompany__name[\s\S]{1,200}?href="\/lodestone\/freecompany\/(\d+)\/"/)
  const fcId = fcMatch?.[1] || null

  return { name, title, server, dc, race, clan, portrait, fcId }
}

function parseLodestoneFC(html, server, dc) {
  if (html.length < 1000) return null

  const name = html.match(/freecompany__text__name[^>]*>([\s\S]{1,100}?)</)?.[1]?.trim()
  if (!name) return null

  const tag  = html.match(/freecompany__text__tag[^>]*>&laquo;([^&]+)&raquo;/)?.[1]?.trim()
  const rank = html.match(/heading--lead">Rank<\/h3>\s*<p[^>]*>\s*(\d+)/)?.[1]
  const sloganRaw = html.match(/freecompany__text__message[^>]*>([\s\S]{0,600}?)<\/p>/)?.[1] ?? ''
  const slogan = sloganRaw.replace(/<[^>]+>/g, '').trim()

  // Crest images — extract from the crest block
  const crestStart = html.indexOf('entry__freecompany__crest')
  const crestArea = crestStart >= 0 ? html.slice(crestStart, crestStart + 1500) : ''
  const crestImages = []
  const baseM = crestArea.match(/src="(https:\/\/lds-img\.finalfantasyxiv\.com\/[^"]+)"/)
  if (baseM) crestImages.push(baseM[1])
  for (const m of crestArea.matchAll(/src="(https:\/\/img2\.finalfantasyxiv\.com\/c\/[^"]+)"/g)) {
    crestImages.push(m[1])
  }

  return {
    name,
    ...(tag   && { tag }),
    ...(rank  && { rank }),
    ...(server && { server }),
    ...(dc    && { datacenter: dc }),
    ...(slogan && { description: slogan }),
    ...(crestImages.length > 0 && { crestImages }),
  }
}

function parseLodestoneJobsPage(html) {
  if (html.length < 1000) return []

  const jobs = []
  // Lodestone structure: character__job__level > level number, then data-tooltip="JobName"
  const pattern = /character__job__level">\s*(\d+)\s*<\/div>[\s\S]{1,300}?data-tooltip="([^"]{3,30})"/g
  let m
  while ((m = pattern.exec(html)) !== null) {
    const level = parseInt(m[1], 10)
    // Tooltip can be "Ninja / Rogue" or "Ninja" — take the part before " / "
    const jobName = m[2].split(' / ')[0].trim()
    const abbrev  = JOB_NAME_TO_ABBREV[jobName]
    if (abbrev && level > 0) jobs.push({ name: jobName, icon: abbrev, level, role: JOB_ROLES[abbrev] })
  }

  // Deduplicate — keep highest level per job
  const seen = new Map()
  for (const j of jobs) {
    if (!seen.has(j.icon) || seen.get(j.icon).level < j.level) seen.set(j.icon, j)
  }
  return [...seen.values()].sort((a, b) => b.level - a.level)
}

async function fetchFromLodestone(id) {
  const [charHtml, jobsHtml] = await Promise.all([
    getHtml(`https://na.finalfantasyxiv.com/lodestone/character/${id}/`).catch(() => ''),
    getHtml(`https://na.finalfantasyxiv.com/lodestone/character/${id}/class_job/`).catch(() => ''),
  ])

  const charData = parseLodestoneCharPage(charHtml)
  if (!charData) return null

  charData.jobs = parseLodestoneJobsPage(jobsHtml)

  if (charData.fcId) {
    const fcHtml = await getHtml(`https://na.finalfantasyxiv.com/lodestone/freecompany/${charData.fcId}/`).catch(() => '')
    charData.fc = parseLodestoneFC(fcHtml, charData.server, charData.dc)
  }

  return charData
}

function isPlaceholder(socialLinks) {
  return !socialLinks || socialLinks.every(l => l.url?.includes('yourhandle'))
}

function hasRealStory(about) {
  return about?.story?.length > 0 && !about.story[0].includes('Write your character')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Load .env.local before reading LODESTONE_ID
  await loadEnvLocal()

  const id = process.argv[2] || process.env.LODESTONE_ID

  if (!id) {
    console.error('\n❌  Missing Lodestone ID')
    console.error('    Add to .env.local : LODESTONE_ID=48463380')
    console.error('    Or pass directly  : npm run setup -- 48463380\n')
    process.exit(1)
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`  FFXIV Profile Setup  —  ID: ${id}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  // Load existing character.json
  let existing = {}
  try { existing = JSON.parse(await readFile(CHARACTER_JSON, 'utf-8')) } catch {}

  // Detect ID change → reset character-specific data, but keep config fields
  const previousId = existing._lodestoneId
  const prevIsReal = /^\d+$/.test(previousId || '')  // ignore placeholder like "YOUR_LODESTONE_ID"
  const idChanged = prevIsReal && previousId !== id
  if (idChanged) {
    console.log(`  ⚡ New character (was ${previousId}) — resetting character data\n`)
    // Preserve user config and customizations across character switches
    const keep = {}
    for (const f of ['pronouns','sections','navLabels','rp','theme','gallery','socialLinks','footer',
                     '_animationOptions','_socialPlatforms','_jobIconCodes']) {
      if (existing[f] !== undefined) keep[f] = existing[f]
    }
    existing = keep
  }

  const filled = []
  const manual = []
  let out = { ...existing }
  out._lodestoneId = id

  // ── Fetch from XIVAPI ──────────────────────────────────────────────────────
  process.stdout.write('Fetching XIVAPI... ')
  const data = await get(`https://xivapi.com/character/${id}?data=CJ`).catch(() => null)

  if (data) {
    console.log('✓\n')
    const char = data.Character
    const classJobs = data.ClassJobs ?? []

    // Basic info
    out.name = char.Name
    out.server = char.Server
    out.datacenter = char.DC
    filled.push(`name → ${char.Name}`)
    filled.push(`server → ${char.Server} [${char.DC}]`)

    // Race / clan
    const raceInfo = RACE_MAP[char.Race]
    if (raceInfo) {
      out.race = raceInfo.race
      out.clan = raceInfo.clans[char.Tribe] ?? ''
      filled.push(`race → ${out.race} · ${out.clan}`)
    }

    // Title
    if (char.Title?.Name) {
      out.title = char.Title.Name
      filled.push(`title → ${char.Title.Name}`)
    } else {
      out.title = out.title || 'Adventurer of Eorzea'
      manual.push('title  (no title equipped — edit in character.json)')
    }

    // Active job
    const active = char.ActiveClassJob
    if (active) {
      const abbrev = JOB_ID_MAP[active.JobID]
      if (abbrev) {
        out.mainJob = JOB_NAMES[abbrev]
        out.mainJobIcon = abbrev
        filled.push(`mainJob → ${out.mainJob} (${abbrev})`)
      }
    }

    // All combat jobs (tank/healer/dps) with level > 0
    const COMBAT_ROLES = new Set(['tank', 'healer', 'dps'])
    const jobs = classJobs
      .filter(j => j.Level > 0 && JOB_ID_MAP[j.JobID] && COMBAT_ROLES.has(JOB_ROLES[JOB_ID_MAP[j.JobID]]))
      .sort((a, b) => b.Level - a.Level)
      .map(j => {
        const abbrev = JOB_ID_MAP[j.JobID]
        return { name: JOB_NAMES[abbrev], icon: abbrev, level: j.Level, role: JOB_ROLES[abbrev] }
      })

    if (jobs.length > 0) {
      out.jobs = jobs
      filled.push(`jobs → ${jobs.length} jobs synced`)
    }

    // Portrait
    const portraitUrl = char.Portrait || char.Avatar
    if (portraitUrl) {
      process.stdout.write('Downloading portrait... ')
      const ok = await downloadFile(portraitUrl, HERO_IMAGE).catch(() => false)
      console.log(ok ? '✓' : '✗ (skipped)')
      if (ok) filled.push('portrait → public/images/hero.jpg')
      else manual.push('portrait  (place image at public/images/hero.jpg)')
    }

    // Free Company (XIVAPI gives us the FC ID; fetch full data from Lodestone)
    const fcId = char.FreeCompanyId
    if (fcId) {
      process.stdout.write('Fetching Free Company... ')
      const fcHtml = await getHtml(`https://na.finalfantasyxiv.com/lodestone/freecompany/${fcId}/`).catch(() => '')
      const fc = parseLodestoneFC(fcHtml, char.Server, char.DC)
      if (fc) {
        out.freeCompany = fc
        const fcTag = fc.tag ? ` «${fc.tag}»` : ''
        console.log('✓')
        filled.push(`freeCompany → ${fc.name}${fcTag}`)
      } else {
        console.log('✗ (skipped)')
      }
    }

  } else {
    console.log('✗  (XIVAPI unreachable)\n')

    // ── Fallback: parse Lodestone HTML directly ────────────────────────────
    process.stdout.write('Trying Lodestone directly... ')
    const lodestone = await fetchFromLodestone(id).catch(() => null)

    if (lodestone) {
      console.log('✓\n')

      out.name   = lodestone.name
      out.server = lodestone.server
      out.datacenter = lodestone.dc
      filled.push(`name → ${lodestone.name}`)
      filled.push(`server → ${lodestone.server} [${lodestone.dc}]`)

      if (lodestone.race) {
        out.race = lodestone.race
        out.clan = lodestone.clan ?? ''
        filled.push(`race → ${out.race} · ${out.clan}`)
      }

      if (lodestone.title) {
        out.title = lodestone.title
        filled.push(`title → ${lodestone.title}`)
      } else {
        out.title = out.title || 'Adventurer of Eorzea'
        manual.push('title  (no title equipped — edit in character.json)')
      }

      const combatJobs = (lodestone.jobs ?? []).filter(j => ['tank','healer','dps'].includes(j.role))
      if (combatJobs.length > 0) {
        out.jobs = combatJobs
        const mainJob = combatJobs[0]
        out.mainJob     = mainJob.name
        out.mainJobIcon = mainJob.icon
        filled.push(`mainJob → ${mainJob.name} (${mainJob.icon})`)
        filled.push(`jobs → ${combatJobs.length} jobs synced`)
      } else {
        manual.push('jobs  (Lodestone job page not parseable — edit character.json)')
      }

      if (lodestone.fc) {
        out.freeCompany = lodestone.fc
        const tag = lodestone.fc.tag ? ` «${lodestone.fc.tag}»` : ''
        filled.push(`freeCompany → ${lodestone.fc.name}${tag}`)
      } else {
        out.freeCompany = undefined
      }

      if (lodestone.portrait) {
        process.stdout.write('Downloading portrait... ')
        const ok = await downloadFile(lodestone.portrait, HERO_IMAGE).catch(() => false)
        console.log(ok ? '✓' : '✗ (skipped)')
        if (ok) filled.push('portrait → public/images/hero.jpg')
        else manual.push('portrait  (place image at public/images/hero.jpg)')
      }

    } else {
      // ── Both blocked (e.g. WSL) — keep existing data ──────────────────────
      console.log('✗  (network blocked)\n')
      console.log('   Tip: this usually happens in WSL. Try running from a Mac/Linux')
      console.log('   terminal, or set LODESTONE_ID in Vercel and use npm run build:fresh\n')

      if (!out.name || out.name === 'Character Name') {
        out.name         = 'Character Name'
        out.title        = 'Adventurer of Eorzea'
        out.mainJob      = 'Adventurer'
        out.mainJobIcon  = 'ADV'
        out.server       = 'Server'
        out.datacenter   = 'DC'
        out.race         = 'Race'
        out.clan         = 'Clan'
        manual.push('All character fields (edit src/data/character.json directly)')
      } else {
        filled.push(`kept existing data for ${out.name}`)
      }
      manual.push('portrait  (place image at public/images/hero.jpg)')
    }
  }

  // ── Preserve manual fields ─────────────────────────────────────────────────

  // Config fields that are never auto-filled — keep whatever the user set
  if (!out.sections)   out.sections   = { about: true, rp: false, jobs: true, fc: true, gallery: true, social: true }
  if (!out.navLabels)  out.navLabels  = { about: 'About', rp: 'Character', jobs: 'Jobs', fc: 'Free Company', gallery: 'Gallery', social: 'Social' }
  if (!out._animationOptions) out._animationOptions = ['shooting-stars','fireflies','sakura','glitter','snow','aurora','bubbles']
  if (!out._socialPlatforms)  out._socialPlatforms  = ['discord','carrd','twitter','twitch','bluesky','instagram']
  if (!out._jobIconCodes)     out._jobIconCodes      = 'NIN BRD DNC DRG MCH MNK RPR SAM VPR BLM BLU PCT RDM SMN WHM AST SCH SGE DRK GNB PLD WAR'
  // pronouns: keep existing value, add placeholder only on first run
  if (out.pronouns === undefined) {
    out.pronouns = ''
    manual.push('pronouns  (optional — e.g. "She/Her", leave empty to hide)')
  }

  out.heroImage    = '/images/hero.jpg'
  out.heroImageAlt = `${out.name} character portrait`
  if (!out.heroBgImage) out.heroBgImage = '/images/hero-bg.jpg'

  if (!hasRealStory(out.about)) {
    out.about = {
      tagline: 'Write your tagline here.',
      story: ['Write your character story here. This text appears in the About section.'],
    }
    manual.push('about.tagline and about.story')
  }

  if (!out.jobs || out.jobs.length === 0) {
    out.jobs = []
    manual.push('jobs  (add manually to character.json)')
  }

  if (!out.gallery || out.gallery.length === 0) {
    out.gallery = GALLERY_TEMPLATE
  }

  if (isPlaceholder(out.socialLinks)) {
    out.socialLinks = out.socialLinks || SOCIAL_TEMPLATE
    manual.push('socialLinks  (Discord, Twitter, Twitch, Carrd)')
  }

  out.footer = {
    text: out.footer?.text || 'Made with love and a worrying number of raid wipes.',
    year: new Date().getFullYear(),
  }

  if (!out.theme) {
    out.theme = { accentColor: '#c8a84b' }
  }

  // ── Write ──────────────────────────────────────────────────────────────────
  await writeFile(CHARACTER_JSON, JSON.stringify(out, null, 2))

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────')
  if (filled.length > 0) {
    console.log('✅  Auto-filled:')
    filled.forEach(f => console.log(`    • ${f}`))
  }
  if (manual.length > 0) {
    console.log('\n📝  Needs manual editing (src/data/character.json):')
    manual.forEach(m => console.log(`    • ${m}`))
  }
  console.log('\n🖼️   Gallery images → public/images/gallery/')
  console.log('    gpose-01.jpg  gpose-02.jpg  gpose-03.jpg')
  console.log('    screenshot-01.jpg  screenshot-02.jpg  screenshot-03.jpg')
  console.log('\n🚀  When ready: git add . && git push')
  console.log('─────────────────────────────────────────\n')
}

main().catch(err => { console.error('\n❌ ', err.message); process.exit(1) })
