'use client'

interface CloverBackgroundProps {
  children?: React.ReactNode
  className?: string
}

export function CloverBackground({ children, className = '' }: CloverBackgroundProps) {
  return (
    <div
      className={`relative min-h-screen ${className}`}
      style={{ backgroundColor: 'var(--cream)' }}
    >
      {/* Clover pattern overlay using actual SVG asset */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/assets/backgrounds/clover-pattern.svg')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '48px 48px',
          imageRendering: 'pixelated' as React.CSSProperties['imageRendering'],
          opacity: 0.7,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
