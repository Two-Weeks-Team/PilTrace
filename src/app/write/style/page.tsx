'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StarBackground } from '@/components/scrapbook'
import { PaperNote } from '@/components/scrapbook'
import { MaskingTape } from '@/components/scrapbook'

type Focus = 'experience' | 'feeling'
type Style = 'question' | 'list' | 'word' | 'story'

const FOCUS_OPTIONS: { value: Focus; label: string; desc: string }[] = [
  { value: 'experience', label: '경험 중심', desc: '무슨 일이 있었는지' },
  { value: 'feeling', label: '감정 중심', desc: '어떤 느낌이었는지' },
]

const STYLE_OPTIONS: { value: Style; label: string; desc: string; emoji: string }[] = [
  { value: 'story', label: '스토리형', desc: '기승전결 서사', emoji: '📖' },
  { value: 'question', label: '질문형', desc: '독자에게 질문하며', emoji: '❓' },
  { value: 'list', label: '나열형', desc: '장면을 나열하며', emoji: '📝' },
  { value: 'word', label: '단어형', desc: '핵심 단어 중심', emoji: '✨' },
]

export default function StylePage() {
  const router = useRouter()
  const [focus, setFocus] = useState<Focus>('experience')
  const [style, setStyle] = useState<Style>('story')
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    setIsLoading(true)
    sessionStorage.setItem('piltrace_focus', focus)
    sessionStorage.setItem('piltrace_style', style)
    
    const diary = sessionStorage.getItem('piltrace_diary') || ''
    
    try {
      const response = await fetch('/api/essay/phase1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: diary, focus, style }),
      })
      
      if (response.ok) {
        const data = await response.json()
        sessionStorage.setItem('piltrace_survey_questions', JSON.stringify(data.questions || []))
        router.push('/write/survey')
      } else {
        throw new Error('Phase 1 failed')
      }
    } catch {
      // If phase1 fails, skip survey
      sessionStorage.setItem('piltrace_survey_questions', JSON.stringify([]))
      sessionStorage.setItem('piltrace_survey_answers', JSON.stringify([]))
      router.push('/write/generating')
    }
  }

  return (
    <StarBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 py-8">
        <MaskingTape variant="gingham" rotation={1} className="mb-6">
          <span className="text-xs font-handwriting" style={{ color: 'var(--star-brown)' }}>
            어떤 에세이를 원하세요?
          </span>
        </MaskingTape>

        {/* Focus selection */}
        <PaperNote variant="grid" className="w-full max-w-sm mb-4 p-4">
          <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--star-brown)' }}>
            초점 선택
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {FOCUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFocus(opt.value)}
                className="p-3 rounded-lg text-left transition-all"
                style={{
                  backgroundColor: focus === opt.value ? 'var(--sage-green)' : 'transparent',
                  border: `2px solid ${focus === opt.value ? 'var(--sage-green)' : 'var(--earthy-brown)'}`,
                  color: focus === opt.value ? 'var(--cream)' : 'var(--earthy-brown)',
                  opacity: focus === opt.value ? 1 : 0.6,
                }}
              >
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs mt-1 opacity-80">{opt.desc}</div>
              </button>
            ))}
          </div>
        </PaperNote>

        {/* Style selection */}
        <PaperNote variant="grid" className="w-full max-w-sm mb-6 p-4">
          <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--star-brown)' }}>
            필체 선택
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {STYLE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setStyle(opt.value)}
                className="p-3 rounded-lg text-left transition-all"
                style={{
                  backgroundColor: style === opt.value ? 'var(--sage-green)' : 'transparent',
                  border: `2px solid ${style === opt.value ? 'var(--sage-green)' : 'var(--earthy-brown)'}`,
                  color: style === opt.value ? 'var(--cream)' : 'var(--earthy-brown)',
                  opacity: style === opt.value ? 1 : 0.6,
                }}
              >
                <div className="text-lg mb-1">{opt.emoji}</div>
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs mt-1 opacity-80">{opt.desc}</div>
              </button>
            ))}
          </div>
        </PaperNote>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="px-8 py-3 rounded-full text-sm font-medium disabled:opacity-50"
          style={{
            backgroundColor: 'var(--cream)',
            color: 'var(--star-brown)',
          }}
        >
          {isLoading ? '질문 생성 중...' : '질문 받기 →'}
        </button>
      </div>
    </StarBackground>
  )
}
