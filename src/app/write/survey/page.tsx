'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PaperNote } from '@/components/scrapbook'
import { StarBackground } from '@/components/scrapbook'

interface SurveyPageProps {
  questions: string[]
  onSubmit: (answers: string[]) => void
}

// Inner component that uses useSearchParams
function SurveyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get questions from sessionStorage (set by write page)
  const [questions] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = sessionStorage.getItem('piltrace_survey_questions')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  
  const [answers, setAnswers] = useState<string[]>(
    () => questions.map(() => '')
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Store answers in sessionStorage for the pipeline
      sessionStorage.setItem('piltrace_survey_answers', JSON.stringify(answers))
      router.push('/write/generating')
    } catch {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    sessionStorage.setItem('piltrace_survey_answers', JSON.stringify([]))
    router.push('/write/generating')
  }

  if (questions.length === 0) {
    return (
      <StarBackground>
        <div className="min-h-screen flex items-center justify-center p-4">
          <PaperNote variant="lined" clip className="w-full max-w-md p-6">
            <p className="text-center" style={{ color: 'var(--star-brown)' }}>
              질문을 불러오는 중...
            </p>
          </PaperNote>
        </div>
      </StarBackground>
    )
  }

  return (
    <StarBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1
            className="text-2xl font-handwriting mb-2"
            style={{ color: 'var(--cream)' }}
          >
            숭숭이가 궁금해요 🐒
          </h1>
          <p className="text-sm" style={{ color: 'var(--cream)', opacity: 0.8 }}>
            더 좋은 에세이를 위해 몇 가지 여쭤볼게요
          </p>
        </div>

        {/* Questions */}
        <div className="w-full max-w-lg space-y-4">
          {questions.map((question, index) => (
            <PaperNote key={index} variant="lined" className="p-4">
              <label className="block mb-2 font-medium text-sm" style={{ color: 'var(--star-brown)' }}>
                {question}
              </label>
              <textarea
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="자유롭게 적어주세요 (선택사항)"
                rows={3}
                className="w-full resize-none bg-transparent border-none outline-none text-sm"
                style={{ color: 'var(--earthy-brown)' }}
              />
            </PaperNote>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-sm rounded-full border"
            style={{
              borderColor: 'var(--cream)',
              color: 'var(--cream)',
              opacity: 0.7,
            }}
          >
            건너뛰기
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm rounded-full font-medium"
            style={{
              backgroundColor: 'var(--cream)',
              color: 'var(--star-brown)',
            }}
          >
            {isSubmitting ? '생성 중...' : '에세이 만들기 ✨'}
          </button>
        </div>
      </div>
    </StarBackground>
  )
}

// Wrapper with Suspense boundary
export default function SurveyPage() {
  return (
    <Suspense fallback={
      <StarBackground>
        <div className="min-h-screen flex items-center justify-center p-4">
          <PaperNote variant="lined" clip className="w-full max-w-md p-6">
            <p className="text-center" style={{ color: 'var(--star-brown)' }}>
              로딩 중...
            </p>
          </PaperNote>
        </div>
      </StarBackground>
    }>
      <SurveyContent />
    </Suspense>
  )
}
