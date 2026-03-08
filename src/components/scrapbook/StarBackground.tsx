'use client'

interface StarBackgroundProps {
  children?: React.ReactNode
  className?: string
}

export function StarBackground({ children, className = '' }: StarBackgroundProps) {
  return (
    <div
      className={`relative min-h-screen overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(160deg, #8FA278 0%, #9CAF88 30%, #A8B898 60%, #95A87A 100%)' }}
    >
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.12) 0%, transparent 70%)',
        }}
      />
      {/* Scattered star decorations — CSS-only, no tiled SVG */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large stars */}
        <svg className="absolute" style={{ top: '8%', left: '6%', opacity: 0.18 }} width="48" height="48" viewBox="0 0 24 24" fill="#4A5A38">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
        </svg>
        <svg className="absolute" style={{ top: '15%', right: '10%', opacity: 0.14 }} width="36" height="36" viewBox="0 0 24 24" fill="#4A5A38">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
        </svg>
        <svg className="absolute" style={{ top: '70%', left: '12%', opacity: 0.12 }} width="40" height="40" viewBox="0 0 24 24" fill="#4A5A38">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
        </svg>
        <svg className="absolute" style={{ top: '55%', right: '8%', opacity: 0.16 }} width="32" height="32" viewBox="0 0 24 24" fill="#4A5A38">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
        </svg>
        <svg className="absolute" style={{ bottom: '10%', left: '50%', opacity: 0.10 }} width="28" height="28" viewBox="0 0 24 24" fill="#4A5A38">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
        </svg>
        {/* Small dots */}
        <div className="absolute rounded-full" style={{ top: '20%', left: '25%', width: 6, height: 6, background: '#4A5A38', opacity: 0.10 }} />
        <div className="absolute rounded-full" style={{ top: '40%', right: '20%', width: 8, height: 8, background: '#4A5A38', opacity: 0.08 }} />
        <div className="absolute rounded-full" style={{ top: '80%', left: '35%', width: 5, height: 5, background: '#4A5A38', opacity: 0.10 }} />
        <div className="absolute rounded-full" style={{ top: '30%', right: '35%', width: 4, height: 4, background: '#4A5A38', opacity: 0.12 }} />
        <div className="absolute rounded-full" style={{ top: '65%', left: '70%', width: 7, height: 7, background: '#4A5A38', opacity: 0.08 }} />
        <div className="absolute rounded-full" style={{ top: '5%', left: '55%', width: 5, height: 5, background: '#4A5A38', opacity: 0.10 }} />
        <div className="absolute rounded-full" style={{ top: '90%', right: '15%', width: 6, height: 6, background: '#4A5A38', opacity: 0.09 }} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
