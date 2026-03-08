'use client'

import Image from 'next/image'

interface PaperNoteProps {
  variant?: 'lined' | 'grid' | 'kraft'
  clip?: boolean
  sticker?: boolean
  children?: React.ReactNode
  className?: string
}

export function PaperNote({
  variant = 'lined',
  clip = false,
  sticker = false,
  children,
  className = '',
}: PaperNoteProps) {
  const bgClass = {
    lined: 'bg-lined-paper',
    grid: 'bg-grid-paper',
    kraft: 'bg-kraft-paper',
  }[variant]

  return (
    <div className={`relative ${className}`}>
      {/* Binder clip decoration using SVG asset */}
      {clip && (
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 z-20"
          aria-hidden="true"
        >
          <Image
            src="/assets/decorations/binder-clip.svg"
            alt=""
            width={36}
            height={52}
            className="pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      )}

      {/* Star sticker decoration using SVG asset */}
      {sticker && (
        <div
          className="absolute -top-5 -right-5 z-20"
          aria-hidden="true"
        >
          <Image
            src="/assets/decorations/fabric-star.svg"
            alt=""
            width={48}
            height={48}
            className="pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      )}

      {/* Paper content */}
      <div
        className={`relative rounded-lg shadow-lg p-4 ${bgClass}`}
        style={{ backgroundColor: 'var(--cream)' }}
      >
        {children}
      </div>
    </div>
  )
}
