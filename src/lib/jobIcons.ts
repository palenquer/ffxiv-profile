import type { Job } from '@/types'

export const jobIconPaths: Record<string, string> = {
  // Tank
  DRK: '/images/jobs/01_TANK/Job/DarkKnight.png',
  GNB: '/images/jobs/01_TANK/Job/Gunbreaker.png',
  PLD: '/images/jobs/01_TANK/Job/Paladin.png',
  WAR: '/images/jobs/01_TANK/Job/Warrior.png',
  // Healer
  WHM: '/images/jobs/02_HEALER/Job/WhiteMage.png',
  SCH: '/images/jobs/02_HEALER/Job/Scholar.png',
  AST: '/images/jobs/02_HEALER/Job/Astrologian.png',
  SGE: '/images/jobs/02_HEALER/Job/Sage.png',
  // DPS
  PCT: '/images/jobs/03_DPS/Job/Pictomancer.png',
  RPR: '/images/jobs/03_DPS/Job/Reaper.png',
  SAM: '/images/jobs/03_DPS/Job/Samurai.png',
  DRG: '/images/jobs/03_DPS/Job/Dragoon.png',
  MNK: '/images/jobs/03_DPS/Job/Monk.png',
  NIN: '/images/jobs/03_DPS/Job/Ninja.png',
  MCH: '/images/jobs/03_DPS/Job/Machinist.png',
  DNC: '/images/jobs/03_DPS/Job/Dancer.png',
  BRD: '/images/jobs/03_DPS/Job/Bard.png',
  BLM: '/images/jobs/03_DPS/Job/BlackMage.png',
  RDM: '/images/jobs/03_DPS/Job/RedMage.png',
  SMN: '/images/jobs/03_DPS/Job/Summoner.png',
  VPR: '/images/jobs/03_DPS/Job/Viper.png',
  // Crafter
  BSM: '/images/jobs/04_CRAFTER/Blacksmith.png',
  ARM: '/images/jobs/04_CRAFTER/Armorer.png',
  GSM: '/images/jobs/04_CRAFTER/Goldsmith.png',
  LTW: '/images/jobs/04_CRAFTER/Leatherworker.png',
  WVR: '/images/jobs/04_CRAFTER/Weaver.png',
  ALC: '/images/jobs/04_CRAFTER/Alchemist.png',
  CUL: '/images/jobs/04_CRAFTER/Culinarian.png',
  CRP: '/images/jobs/04_CRAFTER/Carpenter.png',
  // Gatherer
  MIN: '/images/jobs/05_GATHERER/Miner.png',
  BTN: '/images/jobs/05_GATHERER/Botanist.png',
  FSH: '/images/jobs/05_GATHERER/Fisher.png',
}

export const roleIconPaths: Partial<Record<Job['role'], string>> = {
  tank: '/images/jobs/00_ROLE/TankRole.png',
  healer: '/images/jobs/00_ROLE/HealerRole.png',
  dps: '/images/jobs/00_ROLE/DPSRole.png',
}

export const jobAbbrevColors: Record<string, string> = {
  DRK: '#8b5cf6', GNB: '#6366f1', PLD: '#3b82f6', WAR: '#ef4444',
  PCT: '#ec4899', RPR: '#a855f7', SAM: '#f97316', DRG: '#2563eb',
  MNK: '#f59e0b', NIN: '#10b981', MCH: '#06b6d4', DNC: '#f43f5e',
  BRD: '#84cc16', VPR: '#16a34a', BLM: '#7c3aed', RDM: '#dc2626',
  SMN: '#059669', WHM: '#f8fafc', SCH: '#8b5cf6', AST: '#eab308',
  SGE: '#06b6d4', BSM: '#d97706', ARM: '#94a3b8', GSM: '#a3e635',
  LTW: '#c084fc', WVR: '#f472b6', ALC: '#34d399', CUL: '#fb923c',
  CRP: '#78716c', MIN: '#a16207', BTN: '#166534', FSH: '#0369a1',
}
