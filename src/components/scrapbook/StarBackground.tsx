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
      {/* Subtle linen texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.10) 0%, transparent 70%)',
        }}
      />
      {/* Noise grain for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
      {/* Scattered decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Stars — varied sizes, scattered */}
        <svg className="absolute" style={{ top: '6%', left: '5%', opacity: 0.20 }} width="52" height="52" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
        <svg className="absolute" style={{ top: '12%', right: '8%', opacity: 0.15 }} width="38" height="38" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
        <svg className="absolute" style={{ top: '28%', right: '15%', opacity: 0.10 }} width="24" height="24" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
        <svg className="absolute" style={{ top: '45%', left: '3%', opacity: 0.12 }} width="30" height="30" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
        <svg className="absolute" style={{ top: '60%', right: '6%', opacity: 0.17 }} width="44" height="44" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
        <svg className="absolute" style={{ top: '75%', left: '10%', opacity: 0.13 }} width="42" height="42" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
        <svg className="absolute" style={{ bottom: '8%', left: '45%', opacity: 0.11 }} width="28" height="28" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
        <svg className="absolute" style={{ top: '88%', right: '20%', opacity: 0.09 }} width="20" height="20" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" /></svg>
        {/* Clovers */}
        <svg className="absolute" style={{ top: '18%', left: '20%', opacity: 0.08, transform: 'rotate(15deg)' }} width="32" height="32" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2C9.8 2 8 3.8 8 6c0 1.1.4 2 1.1 2.8C7.3 9.5 6 11 6 13c0 2.2 1.8 4 4 4 .7 0 1.4-.2 2-.5.6.3 1.3.5 2 .5 2.2 0 4-1.8 4-4 0-2-1.3-3.5-3.1-4.2C15.6 8 16 7.1 16 6c0-2.2-1.8-4-4-4z" /></svg>
        <svg className="absolute" style={{ top: '50%', right: '18%', opacity: 0.07, transform: 'rotate(-10deg)' }} width="28" height="28" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2C9.8 2 8 3.8 8 6c0 1.1.4 2 1.1 2.8C7.3 9.5 6 11 6 13c0 2.2 1.8 4 4 4 .7 0 1.4-.2 2-.5.6.3 1.3.5 2 .5 2.2 0 4-1.8 4-4 0-2-1.3-3.5-3.1-4.2C15.6 8 16 7.1 16 6c0-2.2-1.8-4-4-4z" /></svg>
        <svg className="absolute" style={{ top: '82%', left: '60%', opacity: 0.06, transform: 'rotate(25deg)' }} width="24" height="24" viewBox="0 0 24 24" fill="#4A5A38"><path d="M12 2C9.8 2 8 3.8 8 6c0 1.1.4 2 1.1 2.8C7.3 9.5 6 11 6 13c0 2.2 1.8 4 4 4 .7 0 1.4-.2 2-.5.6.3 1.3.5 2 .5 2.2 0 4-1.8 4-4 0-2-1.3-3.5-3.1-4.2C15.6 8 16 7.1 16 6c0-2.2-1.8-4-4-4z" /></svg>
        {/* Dots */}
        <div className="absolute rounded-full" style={{ top: '15%', left: '40%', width: 6, height: 6, background: '#4A5A38', opacity: 0.10 }} />
        <div className="absolute rounded-full" style={{ top: '35%', right: '30%', width: 8, height: 8, background: '#4A5A38', opacity: 0.07 }} />
        <div className="absolute rounded-full" style={{ top: '55%', left: '28%', width: 5, height: 5, background: '#4A5A38', opacity: 0.09 }} />
        <div className="absolute rounded-full" style={{ top: '70%', right: '40%', width: 4, height: 4, background: '#4A5A38', opacity: 0.11 }} />
        <div className="absolute rounded-full" style={{ top: '40%', left: '8%', width: 7, height: 7, background: '#4A5A38', opacity: 0.06 }} />
        <div className="absolute rounded-full" style={{ top: '92%', left: '15%', width: 5, height: 5, background: '#4A5A38', opacity: 0.08 }} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
