'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { CharacterData, Job } from '@/types'
import { jobIconPaths, roleIconPaths, jobAbbrevColors } from '@/lib/jobIcons'
import FadeIn from './FadeIn'

interface JobsSectionProps {
  data: Pick<CharacterData, 'jobs'>
  label?: string
}

const roleColors: Record<Job['role'], string> = {
  tank: '#5b8dd9',
  healer: '#6dbf8a',
  dps: '#d95b5b',
}

const roleLabels: Record<Job['role'], string> = {
  tank: 'Tank',
  healer: 'Healer',
  dps: 'DPS',
}

function level100Color(level: number): string {
  if (level === 100) return '#c8a84b'
  if (level >= 90) return '#6dbf8a'
  if (level >= 70) return '#5b8dd9'
  return '#7a7580'
}

function LevelBar({ level, color, animated }: { level: number; color: string; animated: boolean }) {
  return (
    <div className="relative mt-2">
      <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-ffxiv-border)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: animated ? `${level}%` : '0%',
            backgroundColor: color,
            transition: 'width 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  )
}

function JobCard({ job, animated, cardDelay }: { job: Job; animated: boolean; cardDelay: number }) {
  const roleColor = roleColors[job.role]
  const jobColor = jobAbbrevColors[job.icon] ?? roleColor
  const iconSrc = jobIconPaths[job.icon]

  return (
    <FadeIn delay={cardDelay}>
      <div
        className="relative group p-4 rounded-sm flex flex-col gap-3 cursor-default"
        style={{
          background: `linear-gradient(135deg, ${roleColor}0c 0%, var(--color-ffxiv-surface-2) 55%)`,
          border: `1px solid ${job.isFavorite ? jobColor + '55' : roleColor + '28'}`,
          boxShadow: job.isFavorite ? `0 0 20px ${jobColor}15` : 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = jobColor + '88'
          el.style.boxShadow = `0 4px 24px ${jobColor}30`
          el.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = job.isFavorite ? jobColor + '55' : roleColor + '28'
          el.style.boxShadow = job.isFavorite ? `0 0 20px ${jobColor}15` : 'none'
          el.style.transform = 'translateY(0)'
        }}
      >
        {/* Favorite star */}
        {job.isFavorite && (
          <div className="absolute top-2.5 right-2.5 text-xs" title="Favorite job" style={{ color: 'var(--color-ffxiv-gold)' }}>
            ★
          </div>
        )}

        {/* Icon + name */}
        <div className="flex items-center gap-3">

          {iconSrc ? (
            <Image
              src={iconSrc}
              alt={job.name}
              width={40}
              height={40}
              className="object-contain"
              style={{ imageRendering: 'auto' }}
            />
          ) : (
            <span
              className="font-bold text-xs"
              style={{ color: jobColor, fontFamily: 'var(--font-cinzel, serif)', letterSpacing: '0.05em' }}
            >
              {job.icon}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-ffxiv-text)' }}>
              {job.name}
            </p>
          </div>
        </div>

        {/* Level bar */}
        <div>
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: 'var(--color-ffxiv-muted)' }}>Level</span>
            <span className="text-sm font-bold" style={{ color: level100Color(job.level) }}>
              {job.level}
            </span>
          </div>
          <LevelBar level={job.level} color={level100Color(job.level)} animated={animated} />
        </div>
      </div>
    </FadeIn>
  )
}

export default function JobsSection({ data, label = 'Jobs' }: JobsSectionProps) {
  const { jobs } = data
  const roles = ['tank', 'healer', 'dps'] as const
  const [animated, setAnimated] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="jobs"
      className="relative py-24 md:py-32"
      style={{ backgroundColor: 'var(--color-ffxiv-darker)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark))' }} />
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: 'var(--color-ffxiv-gold)', fontFamily: 'var(--font-cinzel, serif)' }}
              >
                Class & Job
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

        {/* Groups by role */}
        <div className="space-y-10">
          {roles.map((role, roleIndex) => {
            const roleJobs = jobs.filter((j) => j.role === role)
            if (roleJobs.length === 0) return null
            const roleIcon = roleIconPaths[role]

            return (
              <FadeIn key={role} delay={roleIndex * 80}>
                <div>
                  {/* Role header */}
                  <div className="flex items-center gap-2.5 mb-4">
                    {roleIcon ? (
                      <Image
                        src={roleIcon}
                        alt={roleLabels[role]}
                        width={20}
                        height={20}
                        className="object-contain opacity-90"
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: roleColors[role] }} />
                    )}
                    <h3
                      className="text-xs tracking-widest uppercase font-semibold"
                      style={{ color: roleColors[role] }}
                    >
                      {roleLabels[role]}
                    </h3>
                    <div className="h-px flex-1" style={{ backgroundColor: roleColors[role] + '30' }} />
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {roleJobs.map((job, cardIndex) => (
                      <JobCard
                        key={job.name}
                        job={job}
                        animated={animated}
                        cardDelay={roleIndex * 80 + cardIndex * 60}
                      />
                    ))}
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
