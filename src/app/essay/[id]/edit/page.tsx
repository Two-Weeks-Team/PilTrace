'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { StarBackground } from '@/components/scrapbook'
import { PaperNote } from '@/components/scrapbook'
import { MaskingTape } from '@/components/scrapbook'

const REVISION_REASONS = [
  { value: 'tone', label: '문체가 맞지 않아요', emoji: '✍️' },
  { value: 'length', label: '너무 길거나 짧아요', emoji: '📏' },
  { value: 'content', label: '내용이 다르게 표현됐어요', emoji: '💭' },
  { value: 'style', label: '필체를 바꾸고 싶어요', emoji: '🎨' },
  { value: 'other', label: '기타', emoji: '✏️' },
]

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const essayId = params.id as string
  
  const [selectedReason, setSelectedReason] = useState('')
  const [additionalNote, setAdditionalNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedReason) return
    
    setIsSubmitting(true)
    
    try {
      // Increment revision count
      await fetch(`/api/essay/${essayId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionCount: 1 }),
      })
      
      // Store revision context for pipeline
      sessionStorage.setItem('piltrace_revision_reason', selectedReason)
      sessionStorage.setItem('piltrace_revision_note', additionalNote)
      sessionStorage.setItem('piltrace_survey_answers', JSON.stringify([]))
      
      // Restart pipeline from style selection
      router.push('/write/style')
    } catch {
      setIsSubmitting(false)
    }
  }

  return (
    <StarBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 py-8">
        <MaskingTape variant="green" rotation={-1} className="mb-6">
          <span className="text-xs font-handwriting" style={{ color: 'var(--star-brown)' }}>
            수정 요청
          </span>
        </MaskingTape>

        <PaperNote variant="lined" clip className="w-full max-w-sm p-4">
          <h2 className="text-lg font-handwriting mb-4" style={{ color: 'var(--star-brown)' }}>
            어떤 부분이 마음에 들지 않으셨나요?
          </h2>

          <div className="space-y-2 mb-4">
            {REVISION_REASONS.map(reason => (
              <button
                key={reason.value}
                onClick={() => setSelectedReason(reason.value)}
                className="w-full p-3 rounded-lg text-left flex items-center gap-2 transition-all"
                style={{
                  backgroundColor: selectedReason === reason.value ? 'var(--sage-green)' : 'transparent',
                  border: `1px solid ${selectedReason === reason.value ? 'var(--sage-green)' : 'var(--earthy-brown)'}`,
                  color: selectedReason === reason.value ? 'var(--cream)' : 'var(--earthy-brown)',
                  opacity: selectedReason === reason.value ? 1 : 0.7,
                }}
              >
                <span>{reason.emoji}</span>
                <span className="text-sm">{reason.label}</span>
              </button>
            ))}
          </div>

          <textarea
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            placeholder="추가로 원하시는 방향이 있으면 적어주세요 (선택사항)"
            rows={3}
            className="w-full resize-none bg-transparent border rounded-lg p-2 text-sm outline-none"
            style={{
              borderColor: 'var(--earthy-brown)',
              color: 'var(--earthy-brown)',
              opacity: 0.8,
            }}
          />
        </PaperNote>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm rounded-full border"
            style={{
              borderColor: 'var(--cream)',
              color: 'var(--cream)',
              opacity: 0.7,
            }}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="px-6 py-2 text-sm rounded-full font-medium disabled:opacity-40"
            style={{
              backgroundColor: 'var(--cream)',
              color: 'var(--star-brown)',
            }}
          >
            {isSubmitting ? '처리 중...' : '다시 만들기 ✨'}
          </button>
        </div>
      </div>
    </StarBackground>
  )
}
