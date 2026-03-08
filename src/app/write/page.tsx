'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StarBackground } from '@/components/scrapbook'
import { PaperNote } from '@/components/scrapbook'
import { MaskingTape } from '@/components/scrapbook'

const MAX_CHARS = 2000
const MIN_CHARS = 100

export default function WritePage() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const charCount = content.length
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS

  const handleSubmit = async () => {
    if (!isValid) {
      setError(`${MIN_CHARS}자 이상 ${MAX_CHARS}자 이하로 작성해주세요.`)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Save diary to sessionStorage for pipeline
      sessionStorage.setItem('piltrace_diary', content)
      // Default focus and style (will be set in style selection page)
      sessionStorage.setItem('piltrace_focus', 'experience')
      sessionStorage.setItem('piltrace_style', 'story')
      
      // Save diary to DB
      const response = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      
      if (response.ok) {
        const diary = await response.json()
        sessionStorage.setItem('piltrace_diary_id', diary.id)
      }
      
      router.push('/write/style')
    } catch {
      setError('오류가 발생했어요. 다시 시도해주세요.')
      setIsLoading(false)
    }
  }

  return (
    <StarBackground>
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
        <MaskingTape variant="green" rotation={-1} className="mb-6">
          <span className="text-sm font-handwriting tracking-wide" style={{ color: 'var(--star-brown)' }}>
            오늘의 일기
          </span>
        </MaskingTape>

        <PaperNote variant="lined" clip className="w-full max-w-md">
          <div className="p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 있었던 일을 자유롭게 적어주세요...&#10;&#10;(최소 100자, 최대 2000자)"
              className="w-full min-h-64 resize-none bg-transparent border-none outline-none text-sm leading-relaxed font-handwriting"
              style={{ color: 'var(--earthy-brown)' }}
              maxLength={MAX_CHARS}
            />
            
            {/* Character count */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t" style={{ borderColor: 'var(--sage-green)', opacity: 0.3 }}>
              <span className="text-xs" style={{ color: charCount < MIN_CHARS ? '#ef4444' : 'var(--earthy-brown)', opacity: 0.6 }}>
                {charCount < MIN_CHARS ? `${MIN_CHARS - charCount}자 더 필요해요` : '좋아요!'}
              </span>
              <span className="text-xs" style={{ color: 'var(--earthy-brown)', opacity: 0.6 }}>
                {charCount} / {MAX_CHARS}
              </span>
            </div>
          </div>
        </PaperNote>

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="mt-8 px-10 py-3.5 rounded-full text-base font-medium transition-all hover:scale-[1.02] disabled:opacity-40 shadow-sm"
          style={{
            backgroundColor: 'var(--cream)',
            color: 'var(--star-brown)',
          }}
        >
          {isLoading ? '저장 중...' : '다음 단계로 →'}
        </button>
      </div>
    </StarBackground>
  )
}
