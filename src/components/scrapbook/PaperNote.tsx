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
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
          aria-hidden="true"
        >
          <Image
            src="/assets/decorations/binder-clip.svg"
            alt=""
            width={20}
            height={32}
            className="pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      )}

      {/* Star sticker decoration using SVG asset */}
      {sticker && (
        <div
          className="absolute -top-3 -right-3 z-20"
          aria-hidden="true"
        >
          <Image
            src="/assets/decorations/fabric-star.svg"
            alt=""
            width={28}
            height={28}
            className="pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      )}

      {/* Paper content */}
      <div
        className={`relative rounded-sm shadow-md p-4 ${bgClass}`}
        style={{ backgroundColor: 'var(--cream)' }}
      >
        {children}
      </div>
    </div>
  )
}
