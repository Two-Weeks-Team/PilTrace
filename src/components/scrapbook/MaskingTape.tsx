'use client'

import Image from 'next/image'

interface MaskingTapeProps {
  variant?: 'green' | 'gingham'
  rotation?: number
  className?: string
  children?: React.ReactNode
}

export function MaskingTape({
  variant = 'green',
  rotation = 0,
  className = '',
  children,
}: MaskingTapeProps) {
  const tapeSrc =
    variant === 'green'
      ? '/assets/decorations/masking-tape-green.svg'
      : '/assets/decorations/gingham-tape.svg'

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Tape background using SVG asset */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src={tapeSrc}
          alt=""
          width={100}
          height={24}
          className="w-full h-full object-cover pixel-art"
          style={{ imageRendering: 'pixelated', opacity: 0.85 }}
        />
      </div>
      {/* Content on top of tape */}
      <div className="relative z-10 px-4 py-1">{children}</div>
    </div>
  )
}
