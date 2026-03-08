'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeAI, setAgreeAI] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!agreePrivacy || !agreeAI) {
      setError('개인정보 처리 및 AI 처리에 동의해주세요.')
      return
    }
    setError(null)
    setIsLoading(true)
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // 가입 성공 → 메인으로 이동
      router.push('/')
      router.refresh()
    } catch {
      setError('회원가입 중 오류가 발생했어요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--cream)] px-4">
      <div className="w-full max-w-sm">
        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-md border border-[var(--border-light)] p-8 relative">
          {/* 마스킹테이프 장식 */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-sm opacity-70"
            style={{ backgroundColor: 'var(--sage-green)' }}
          />

          {/* 헤더 */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[var(--star-brown)] mb-1">
              PilTrace 가입
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              오늘의 이야기를 에세이로
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 닉네임 */}
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
              >
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="숭숭이"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-light)] bg-[var(--cream)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] focus:border-transparent transition-colors"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@piltrace.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-light)] bg-[var(--cream)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] focus:border-transparent transition-colors"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-light)] bg-[var(--cream)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] focus:border-transparent transition-colors"
              />
            </div>

            {/* PIPA 동의 */}
            <div className="space-y-2 text-sm">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-0.5 accent-[var(--sage-green)]"
                  required
                />
                <span className="text-[var(--text-secondary)]">
                  <span className="font-medium">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                  <a href="/privacy" className="ml-1 underline text-[var(--sage-green-dark)]">자세히 보기</a>
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeAI}
                  onChange={(e) => setAgreeAI(e.target.checked)}
                  className="mt-0.5 accent-[var(--sage-green)]"
                  required
                />
                <span className="text-[var(--text-secondary)]">
                  <span className="font-medium">[필수]</span> AI 에세이 생성을 위한 일기 내용 처리에 동의합니다.
                </span>
              </label>
            </div>

            {/* 가입 버튼 */}
            <button
              type="submit"
              disabled={isLoading || !agreePrivacy || !agreeAI}
              className="w-full py-2.5 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--sage-green)' }}
            >
              {isLoading ? '가입 중...' : '가입하기'}
            </button>
          </form>

          {/* 로그인 링크 */}
          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            이미 계정이 있나요?{' '}
            <Link
              href="/login"
              className="font-medium text-[var(--sage-green-dark)] hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>

        {/* 하단 장식 */}
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
          ✦ 숭숭이와 함께하는 AI 저널링 ✦
        </p>
      </div>
    </div>
  )
}
