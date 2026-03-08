'use client'

interface StarBackgroundProps {
  children?: React.ReactNode
  className?: string
}

export function StarBackground({ children, className = '' }: StarBackgroundProps) {
  return (
    <div
      className={`relative min-h-screen ${className}`}
      style={{ backgroundColor: 'var(--sage-green)' }}
    >
      {/* Star pattern overlay using actual SVG asset */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/assets/backgrounds/star-pattern.svg')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '48px 48px',
          imageRendering: 'pixelated' as React.CSSProperties['imageRendering'],
          opacity: 0.8,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
