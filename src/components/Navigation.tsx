'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import type { NavItem } from '@/types'

interface NavigationProps {
  characterName: string
  navItems: NavItem[]
}

export default function Navigation({ characterName, navItems }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const clickLockRef = useRef(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['hero', ...navItems.map((n) => n.id)]
    const observers: IntersectionObserver[] = []
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting && !clickLockRef.current) setActiveSection(id) },
        { threshold: 0.25, rootMargin: '-80px 0px 0px 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((obs) => obs.disconnect())
  }, [navItems])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (!target) return
    setActiveSection(id)
    clickLockRef.current = true
    setTimeout(() => { clickLockRef.current = false }, 1200)
    const navH = document.querySelector('header')?.offsetHeight ?? 72
    const top = target.getBoundingClientRect().top + window.scrollY - navH
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const NavLink = ({ id, label, mobile = false }: { id: string; label: string; mobile?: boolean }) => {
    const isActive = activeSection === id
    return (
      <a
        href={`#${id}`}
        onClick={(e) => handleNavClick(e, `#${id}`, id)}
        className={`relative text-xs tracking-widest uppercase transition-colors duration-200 ${mobile ? 'block px-6 py-3' : ''}`}
        style={{ color: isActive ? 'var(--color-ffxiv-gold)' : 'var(--color-ffxiv-muted)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-ffxiv-gold)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? 'var(--color-ffxiv-gold)' : 'var(--color-ffxiv-muted)')}
      >
        {label}
        {!mobile && isActive && (
          <span
            className="absolute -bottom-1 left-0 right-0 h-px"
            style={{ background: 'var(--color-ffxiv-gold)', opacity: 0.6 }}
          />
        )}
      </a>
    )
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ffxiv-darker/95 backdrop-blur-md border-b border-ffxiv-border'
          : 'bg-transparent'
      }`}
      style={scrolled ? { boxShadow: 'var(--ffxiv-nav-shadow)' } : undefined}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero', 'hero')}
          className="text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
          style={{ fontFamily: 'var(--font-cinzel, serif)', color: 'var(--color-ffxiv-gold)' }}
        >
          {characterName}
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <NavLink id={id} label={label} />
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 transition-colors"
          style={{ color: 'var(--color-ffxiv-muted)' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{ backgroundColor: 'var(--color-ffxiv-darker)', borderColor: 'var(--color-ffxiv-border)' }}
        >
          <ul className="flex flex-col py-4">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <NavLink id={id} label={label} mobile />
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
