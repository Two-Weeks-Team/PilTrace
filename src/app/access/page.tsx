'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import type { GuestAccessRequest, ApiError, ApiSuccess } from '@/types/api'

type AccessState =
  | { step: 'input' }
  | { step: 'loading' }
  | { step: 'error'; message: string; code?: string }
  | { step: 'success'; essay: EssayResult }

interface EssayResult {
  id: string
  content: string
  focus: string
  style: string
  todaysWord: string | null
  createdAt: string
}

export default function GuestAccessPage() {
  const [code, setCode] = useState('')
  const [pin, setPin] = useState('')
  const [state, setState] = useState<AccessState>({ step: 'input' })

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // 대문자 변환, 혼동문자 자동 치환
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    // 최대 6자리
    setCode(raw.slice(0, 6))
  }, [])

  const handlePinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setPin(raw.slice(0, 4))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (code.length !== 6) {
        setState({ step: 'error', message: '고유번호는 6자리여야 합니다.' })
        return
      }
      if (pin.length !== 4) {
        setState({ step: 'error', message: 'PIN은 4자리 숫자여야 합니다.' })
        return
      }

      setState({ step: 'loading' })

      try {
        const body: GuestAccessRequest = { code, pin }
        const res = await fetch('/api/access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const err = (await res.json()) as ApiError
          setState({
            step: 'error',
            message: err.error,
            code: err.code,
          })
          return
        }

        const result = (await res.json()) as ApiSuccess<EssayResult>
        setState({ step: 'success', essay: result.data })
      } catch {
        setState({ step: 'error', message: '네트워크 오류가 발생했습니다.' })
      }
    },
    [code, pin]
  )

  const handleReset = useCallback(() => {
    setCode('')
    setPin('')
    setState({ step: 'input' })
  }, [])

  // 에세이 결과 뷰
  if (state.step === 'success') {
    return (
      <main className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[var(--star-brown)] mb-1">
              나의 에세이
            </h1>
            {state.essay.todaysWord && (
              <p className="text-sm text-[var(--text-secondary)] font-handwriting text-lg">
                &ldquo;{state.essay.todaysWord}&rdquo;
              </p>
            )}
          </div>

          {/* 에세이 카드 */}
          <div className="bg-white rounded-2xl shadow-md border border-[var(--border-light)] p-6 md:p-8 bg-lined-paper">
            <div className="flex gap-2 mb-4">
              <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-[var(--sage-green)] text-white">
                {state.essay.focus === 'experience' ? '경험 중심' : '감정 중심'}
              </span>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-[var(--earthy-brown)] text-white">
                {state.essay.style === 'question'
                  ? '질문형'
                  : state.essay.style === 'list'
                    ? '리스트형'
                    : state.essay.style === 'word'
                      ? '단어형'
                      : '이야기형'}
              </span>
            </div>
            <article className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap text-base">
              {state.essay.content}
            </article>
          </div>

          {/* 돌아가기 */}
          <div className="text-center mt-6">
            <button
              onClick={handleReset}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--star-brown)] underline underline-offset-4 transition-colors"
            >
              ← 다른 에세이 조회하기
            </button>
          </div>
        </div>
      </main>
    )
  }

  // 입력 폼 뷰
  return (
    <main className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* 로고/헤더 */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <Image
              src="/assets/characters/dinosaur-heart.svg"
              alt="공룡 캐릭터"
              width={64}
              height={64}
              className="pixel-art"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <h1 className="text-2xl font-bold text-[var(--star-brown)]">에세이 조회</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            고유번호와 PIN을 입력하세요
          </p>
        </div>

        {/* 입력 카드 */}
        <div className="bg-white rounded-2xl shadow-md border border-[var(--border-light)] p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 고유번호 */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
              >
                고유번호
              </label>
              <input
                id="code"
                type="text"
                inputMode="text"
                autoComplete="off"
                placeholder="예: A3BK7N"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-[var(--cream)] text-center text-xl font-mono tracking-[0.3em] text-[var(--star-brown)] placeholder:text-[var(--text-muted)] placeholder:tracking-normal placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] focus:border-transparent transition-all"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 text-center">
                6자리 영숫자
              </p>
            </div>

            {/* PIN */}
            <div>
              <label
                htmlFor="pin"
                className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
              >
                PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                placeholder="••••"
                value={pin}
                onChange={handlePinChange}
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-[var(--cream)] text-center text-xl tracking-[0.5em] text-[var(--star-brown)] placeholder:tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] focus:border-transparent transition-all"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 text-center">
                4자리 숫자
              </p>
            </div>

            {/* 에러 메시지 */}
            {state.step === 'error' && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-700">{state.message}</p>
                {state.code === 'RATE_LIMITED' && (
                  <p className="text-xs text-red-500 mt-1">
                    보안을 위해 일정 시간 후 재시도해주세요.
                  </p>
                )}
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={state.step === 'loading' || code.length !== 6 || pin.length !== 4}
              className="w-full py-3 rounded-xl bg-[var(--sage-green)] hover:bg-[var(--sage-green-dark)] text-white font-medium text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.step === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  조회 중...
                </span>
              ) : (
                '에세이 열기'
              )}
            </button>
          </form>
        </div>

        {/* 하단 안내 */}
        <p className="text-xs text-[var(--text-muted)] text-center mt-4">
          에세이 작성 시 받은 고유번호와 PIN으로 접근할 수 있습니다.
          <br />
          5회 오류 시 15분간 접근이 제한됩니다.
        </p>
      </div>
    </main>
  )
}
