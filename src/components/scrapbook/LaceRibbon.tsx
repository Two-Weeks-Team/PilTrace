'use client'

interface LaceRibbonProps {
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function LaceRibbon({ position = 'top', className = '' }: LaceRibbonProps) {
  const isHorizontal = position === 'top' || position === 'bottom'

  return (
    <div
      className={`${className}`}
      style={{
        width: isHorizontal ? '100%' : '24px',
        height: isHorizontal ? '24px' : '100%',
        backgroundImage: isHorizontal
          ? `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 8px,
              var(--earthy-brown) 8px,
              var(--earthy-brown) 10px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 4px,
              var(--earthy-brown) 4px,
              var(--earthy-brown) 6px
            )`
          : `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 8px,
              var(--earthy-brown) 8px,
              var(--earthy-brown) 10px
            )`,
        opacity: 0.6,
      }}
    />
  )
}
