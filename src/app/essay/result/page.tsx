'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CloverBackground } from '@/components/scrapbook'
import { PaperNote } from '@/components/scrapbook'
import { MaskingTape } from '@/components/scrapbook'
import { LaceRibbon } from '@/components/scrapbook'

export default function EssayResultPage() {
  const router = useRouter()
  const [essay, setEssay] = useState<string>('')
  const [envelopeOpened, setEnvelopeOpened] = useState(false)
  const [showEssay, setShowEssay] = useState(false)
  const [todaysWord, setTodaysWord] = useState('')
  const [showWordInput, setShowWordInput] = useState(false)
  const [wordSaved, setWordSaved] = useState(false)
  const [essayId, setEssayId] = useState<string | null>(null)

  useEffect(() => {
    const finalEssay = sessionStorage.getItem('piltrace_final_essay')
    const storedEssayId = sessionStorage.getItem('piltrace_essay_id')

    if (!finalEssay) {
      router.push('/write')
      return
    }

    setEssay(finalEssay)
    setEssayId(storedEssayId)

    // Envelope animation sequence
    const t1 = setTimeout(() => setEnvelopeOpened(true), 800)
    const t2 = setTimeout(() => setShowEssay(true), 2000)
    const t3 = setTimeout(() => setShowWordInput(true), 3000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [router])

  const handleSaveWord = async () => {
    if (!todaysWord.trim() || !essayId) {
      setWordSaved(true)
      return
    }

    try {
      await fetch(`/api/essay/${essayId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todays_word: todaysWord }),
      })
    } catch {
      // Silently fail — word is optional
    }
    setWordSaved(true)
  }

  const paragraphs = essay.split('\n').filter(p => p.trim())

  if (!essay) {
    return (
      <CloverBackground>
        <div className="min-h-screen flex items-center justify-center">
          <Image src="/assets/characters/sungsungi-envelope.svg" alt="숭숭이" width={64} height={64} className="pixel-art animate-bounce" style={{ imageRendering: 'pixelated' }} />
        </div>
      </CloverBackground>
    )
  }

  return (
    <CloverBackground>
      <LaceRibbon position="top" />

      <div className="min-h-screen p-4 py-12">
        {/* Envelope animation */}
        {!showEssay && (
          <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <div
              style={{
                perspective: '600px',
                width: '200px',
                height: '140px',
              }}
            >
              {/* Envelope body */}
              <div
                style={{
                  width: '200px',
                  height: '140px',
                  backgroundColor: 'var(--cream)',
                  border: '2px solid var(--earthy-brown)',
                  borderRadius: '4px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Envelope V-fold lines */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '70px',
                    background: `linear-gradient(135deg, var(--sage-green) 50%, transparent 50%),
                                 linear-gradient(225deg, var(--sage-green) 50%, transparent 50%)`,
                    backgroundSize: '50% 100%',
                    backgroundPosition: 'left, right',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.3,
                  }}
                />

                {/* Envelope flap */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '70px',
                    backgroundColor: 'var(--sage-green)',
                    transformOrigin: 'top center',
                    transform: envelopeOpened ? 'rotateX(-160deg)' : 'rotateX(0deg)',
                    transition: 'transform 0.8s ease-in-out',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    opacity: 0.8,
                  }}
                />

                {/* Letter peeking out */}
                {envelopeOpened && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '20px',
                      right: '20px',
                      height: '80px',
                      backgroundColor: 'white',
                      border: '1px solid var(--earthy-brown)',
                      borderRadius: '2px',
                      animation: 'slideUpLetter 0.6s ease-out 0.3s both',
                      opacity: 0.9,
                    }}
                  />
                )}
              </div>
            </div>

            <p
              className="mt-6 text-sm font-handwriting animate-pulse"
              style={{ color: 'var(--star-brown)' }}
            >
              {envelopeOpened ? '에세이를 꺼내는 중...' : (
                <span className="flex items-center gap-2">
                  <Image src="/assets/characters/sungsungi-envelope.svg" alt="" width={24} height={24} className="pixel-art inline" style={{ imageRendering: 'pixelated' }} />
                  숭숭이가 편지를 전달하고 있어요
                </span>
              )}
            </p>
          </div>
        )}

        {/* Essay content */}
        {showEssay && (
          <div
            style={{
              animation: 'fadeInUp 0.8s ease-out both',
            }}
          >
            <div className="max-w-lg mx-auto mb-4">
              <MaskingTape variant="gingham" rotation={-1} className="inline-block mb-3">
                <span className="text-xs font-handwriting" style={{ color: 'var(--star-brown)' }}>
                  나의 에세이
                </span>
              </MaskingTape>
            </div>

            <PaperNote variant="grid" className="max-w-lg mx-auto p-6 mb-6">
              <div className="space-y-4">
                {paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--earthy-brown)' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </PaperNote>

            {/* Today's word input */}
            {showWordInput && !wordSaved && (
              <div
                className="max-w-lg mx-auto mb-6"
                style={{ animation: 'fadeInUp 0.5s ease-out both' }}
              >
                <PaperNote variant="lined" className="p-4">
                  <p className="text-xs font-handwriting mb-2" style={{ color: 'var(--star-brown)' }}>
                    오늘의 한마디 ✨
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={todaysWord}
                      onChange={e => setTodaysWord(e.target.value)}
                      placeholder="오늘을 한 문장으로 표현한다면?"
                      maxLength={100}
                      className="flex-1 bg-transparent border-b text-sm outline-none py-1"
                      style={{
                        borderColor: 'var(--earthy-brown)',
                        color: 'var(--earthy-brown)',
                      }}
                    />
                    <button
                      onClick={handleSaveWord}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: 'var(--sage-green)',
                        color: 'var(--cream)',
                      }}
                    >
                      저장
                    </button>
                  </div>
                </PaperNote>
              </div>
            )}

            {wordSaved && (
              <div className="max-w-lg mx-auto mb-6 text-center">
                <p className="text-sm font-handwriting" style={{ color: 'var(--sage-green)' }}>
                  ✓ 저장되었어요
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="max-w-lg mx-auto flex flex-col gap-3">
              {essayId && (
                <Link
                  href={`/essay/${essayId}`}
                  className="w-full py-3 rounded-full text-center text-sm font-medium"
                  style={{
                    backgroundColor: 'var(--sage-green)',
                    color: 'var(--cream)',
                  }}
                >
                  📖 에세이 보관하기
                </Link>
              )}

              {essayId && (
                <Link
                  href={`/essay/${essayId}/edit`}
                  className="w-full py-3 rounded-full text-center text-sm border"
                  style={{
                    borderColor: 'var(--sage-green)',
                    color: 'var(--sage-green)',
                  }}
                >
                  ✍️ 수정 요청하기
                </Link>
              )}

              <Link
                href="/write"
                className="w-full py-3 rounded-full text-center text-sm"
                style={{ color: 'var(--earthy-brown)', opacity: 0.6 }}
              >
                🐒 새 에세이 쓰기
              </Link>
            </div>
          </div>
        )}
      </div>

      <LaceRibbon position="bottom" />

      <style jsx>{`
        @keyframes slideUpLetter {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 0.9;
          }
        }
        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </CloverBackground>
  )
}
