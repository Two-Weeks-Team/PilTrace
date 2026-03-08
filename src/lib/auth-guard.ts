import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { AuthUser } from '@/types/auth'

/**
 * 서버 컴포넌트에서 인증 확인
 * - 미인증 → /login 리다이렉트
 * - 인증됨 → AuthUser 반환
 *
 * @example
 * ```tsx
 * export default async function ProtectedPage() {
 *   const user = await requireAuth()
 *   return <div>안녕하세요, {user.nickname}님</div>
 * }
 * ```
 */
export async function requireAuth(): Promise<AuthUser> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return {
    id: user.id,
    email: user.email ?? '',
    nickname: user.user_metadata?.nickname ?? null,
    consentedAt: user.user_metadata?.consented_at
      ? new Date(user.user_metadata.consented_at)
      : null,
  }
}

/**
 * 서버 컴포넌트에서 인증 상태만 확인 (리다이렉트 없음)
 * - null: 미인증 / AuthUser: 인증됨
 */
export async function getServerUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return {
    id: user.id,
    email: user.email ?? '',
    nickname: user.user_metadata?.nickname ?? null,
    consentedAt: user.user_metadata?.consented_at
      ? new Date(user.user_metadata.consented_at)
      : null,
  }
}
