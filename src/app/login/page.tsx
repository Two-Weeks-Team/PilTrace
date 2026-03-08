'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('이메일 또는 비밀번호가 올바르지 않아요.')
        } else {
          setError(signInError.message)
        }
        return
      }

      // 로그인 성공 → 메인으로 이동
      router.push('/')
      router.refresh()
    } catch {
      setError('로그인 중 오류가 발생했어요.')
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
              PilTrace
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              다시 만나서 반가워요
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
                placeholder="비밀번호 입력"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-light)] bg-[var(--cream)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] focus:border-transparent transition-colors"
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--sage-green)' }}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            아직 계정이 없나요?{' '}
            <Link
              href="/signup"
              className="font-medium text-[var(--sage-green-dark)] hover:underline"
            >
              가입하기
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
