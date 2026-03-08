'use client'

import { useState } from 'react'
import { ShareModal } from './ShareModal'

interface ShareButtonProps {
  essayId: string
  existingCode?: string | null
}

export function ShareButton({ essayId, existingCode }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 rounded-full text-center text-sm font-medium"
        style={{
          backgroundColor: 'var(--star-brown)',
          color: 'var(--cream)',
        }}
      >
        🔗 {existingCode ? '공유 코드 보기' : '공유하기'}
      </button>

      <ShareModal
        essayId={essayId}
        existingCode={existingCode}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
