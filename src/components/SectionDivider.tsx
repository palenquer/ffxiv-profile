export default function SectionDivider({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div className={`absolute ${position}-0 left-0 right-0 h-3 flex items-center`}>
      <div
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-ffxiv-gold-dark))' }}
      />
      <div
        className="mx-3 w-1.5 h-1.5 rotate-45 shrink-0"
        style={{ backgroundColor: 'var(--color-ffxiv-gold)', opacity: 0.65 }}
      />
      <div
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(90deg, var(--color-ffxiv-gold-dark), transparent)' }}
      />
    </div>
  )
}
