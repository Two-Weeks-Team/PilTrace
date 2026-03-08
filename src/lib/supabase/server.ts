import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 서버(Server Component, Route Handler, Server Action)용 Supabase 클라이언트
 * - cookies() 통합으로 세션 쿠키 자동 관리
 * - 각 요청마다 새 인스턴스 생성 (서버는 싱글톤 사용 불가)
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Server Component에서 호출 시 setAll은 무시됨
            // proxy.ts나 Route Handler에서 세션 리프레시 처리
          }
        },
      },
    },
  )
}
