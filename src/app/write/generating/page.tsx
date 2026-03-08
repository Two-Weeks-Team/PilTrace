'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { StarBackground } from '@/components/scrapbook'
import { PaperNote } from '@/components/scrapbook'
import { usePipeline } from '@/lib/pipeline/usePipeline'
import { createClient } from '@/lib/supabase/client'

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
  const textRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom as text streams in
  useEffect(() => {
    if (textRef.current && state.isStreaming) {
      textRef.current.scrollTop = textRef.current.scrollHeight
    }
  }, [state.draft, state.finalEssay, state.isStreaming])

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
          await submitSurvey(input, surveyAnswers)
        } else {
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

      // Save essay to DB
      const saveEssay = async () => {
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          const diaryId = sessionStorage.getItem('piltrace_diary_id')
          const focus = sessionStorage.getItem('piltrace_focus') || 'experience'
          const style = sessionStorage.getItem('piltrace_style') || 'story'

          if (diaryId && diaryId !== 'undefined') {
            const res = await fetch('/api/essay', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                diaryId,
                content: state.finalEssay,
                focus,
                style,
                userId: user?.id ?? null,
              }),
            })

            if (res.ok) {
              const result = await res.json()
              sessionStorage.setItem('piltrace_essay_id', result.data.id)
            }
          }
        } catch (err) {
          console.error('Essay save failed:', err)
        }

        // Redirect regardless of save success
        router.push('/essay/result')
      }

      const timer = setTimeout(saveEssay, 2000)
      return () => clearTimeout(timer)
    }
  }, [state.phase, state.finalEssay, router])

  const streamingText = state.finalEssay || state.draft
  const isShowingText = state.isStreaming || state.phase === 'phase3' || state.phase === 'phase5' || state.phase === 'complete'

  return (
    <StarBackground>
      <div className="min-h-screen flex flex-col items-center p-4 py-8">
        {/* Header: character + phase message */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <Image
            src="/assets/characters/sungsungi-keyboard.svg"
            alt="승승이가 에세이를 쓰고 있어요"
            width={48}
            height={48}
            className="pixel-art animate-bounce"
            style={{ imageRendering: 'pixelated' }}
          />
          <h2 className="text-xl font-handwriting" style={{ color: 'var(--cream)' }}>
            {PHASE_MESSAGES[state.phase]}
          </h2>
        </div>

        {/* Streaming text card — full readable area */}
        {isShowingText && streamingText ? (
          <PaperNote variant="lined" className="w-full max-w-lg flex-1">
            <div
              ref={textRef}
              className="p-6 overflow-y-auto"
              style={{
                maxHeight: 'calc(100vh - 200px)',
                minHeight: '300px',
                color: 'var(--earthy-brown)',
                lineHeight: '1.9',
                fontSize: '15px',
              }}
            >
              {streamingText}
              {state.isStreaming && (
                <span className="inline-block w-0.5 h-4 ml-0.5 animate-pulse" style={{ backgroundColor: 'var(--sage-green)' }} />
              )}
            </div>
          </PaperNote>
        ) : (
          /* Non-streaming phases: compact card */
          <PaperNote variant="lined" clip className="w-full max-w-md">
            <div className="p-8 text-center">
              <div className="mb-4 flex justify-center">
                <Image
                  src="/assets/characters/sungsungi-keyboard.svg"
                  alt="승승이"
                  width={96}
                  height={96}
                  className="pixel-art animate-bounce"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <h2 className="text-2xl font-handwriting mb-3" style={{ color: 'var(--star-brown)' }}>
                {PHASE_MESSAGES[state.phase]}
              </h2>
              <div className="flex justify-center gap-1 mt-4">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--sage-green)', animationDelay: '0s' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--sage-green)', animationDelay: '0.15s' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--sage-green)', animationDelay: '0.3s' }} />
              </div>
            </div>
          </PaperNote>
        )}

        {state.phase === 'error' && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
            <p className="text-sm text-red-500">{state.error}</p>
          </div>
        )}
      </div>
    </StarBackground>
  )
}
