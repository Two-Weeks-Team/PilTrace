'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { StarBackground } from '@/components/scrapbook'
import { PaperNote } from '@/components/scrapbook'
import { usePipeline } from '@/lib/pipeline/usePipeline'

const PHASE_MESSAGES = {
  idle: '준비 중...',
  phase1: '숭숭이가 일기를 읽고 있어요 🐒',
  survey: '질문을 생각하는 중...',
  phase2: '에세이 구조를 설계하는 중...',
  phase3: '초고를 쓰는 중... ✍️',
  phase4: '꼼꼼히 검토하는 중...',
  phase5: '마지막 다듬기 중... ✨',
  complete: '완성! 🎉',
  error: '오류가 발생했어요',
}

export default function GeneratingPage() {
  const router = useRouter()
  const { state, startPhase1, submitSurvey } = usePipeline()
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (started) return
    setStarted(true)

    const diary = sessionStorage.getItem('piltrace_diary') || ''
    const focus = (sessionStorage.getItem('piltrace_focus') || 'experience') as 'experience' | 'feeling'
    const style = (sessionStorage.getItem('piltrace_style') || 'story') as 'question' | 'list' | 'word' | 'story'
    const surveyAnswers = JSON.parse(sessionStorage.getItem('piltrace_survey_answers') || '[]')

    const input = { diary, focus, style }

    async function run() {
      try {
        if (surveyAnswers.length > 0) {
          // Survey already done, go straight to phase 2+
          await submitSurvey(input, surveyAnswers)
        } else {
          // Start from phase 1
          await startPhase1(input)
        }
      } catch (err) {
        console.error('Pipeline error:', err)
      }
    }

    run()
  }, [started, startPhase1, submitSurvey])

  useEffect(() => {
    if (state.phase === 'complete' && state.finalEssay) {
      sessionStorage.setItem('piltrace_final_essay', state.finalEssay)
      router.push('/essay/result')
    }
  }, [state.phase, state.finalEssay, router])

  return (
    <StarBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <PaperNote variant="lined" clip className="w-full max-w-md p-8 text-center">
          {/* Animated sungsungi character */}
          <div className="mb-4 flex justify-center">
            <Image
              src="/assets/characters/sungsungi-keyboard.svg"
              alt="숭숭이가 에세이를 쓰고 있어요"
              width={64}
              height={64}
              className="pixel-art animate-bounce"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          <h2 className="text-xl font-handwriting mb-2" style={{ color: 'var(--star-brown)' }}>
            {PHASE_MESSAGES[state.phase]}
          </h2>

          {/* Streaming preview */}
          {state.isStreaming && (state.draft || state.finalEssay) && (
            <div
              className="mt-4 text-left text-xs leading-relaxed max-h-32 overflow-hidden"
              style={{ color: 'var(--earthy-brown)', opacity: 0.7 }}
            >
              {(state.finalEssay || state.draft).slice(-200)}
            </div>
          )}

          {state.phase === 'error' && (
            <p className="mt-4 text-sm text-red-500">{state.error}</p>
          )}
        </PaperNote>
      </div>
    </StarBackground>
  )
}
