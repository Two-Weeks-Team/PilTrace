import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Next.js 16 Proxy (middleware.ts 대체)
 * - Supabase 세션 쿠키 리프레시
 * - 보호된 라우트 → /login 리다이렉트
 */

// 인증 필요한 라우트 접두사
const protectedPrefixes = ['/write', '/diary', '/essay', '/drawer', '/mypage', '/settings']

// 인증된 사용자가 접근 불필요한 라우트
const authRoutes = ['/login', '/signup']

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // Supabase 미설정 시 통과 (개발 환경에서 키 없이 빌드 가능)
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  // 세션 리프레시 (반드시 response 반환 전에 호출)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 미인증 + 보호된 라우트 → /login
  const isProtected = protectedPrefixes.some((prefix) =>
    path.startsWith(prefix),
  )
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.nextUrl)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // 인증됨 + 로그인/가입 페이지 → 메인
  const isAuthRoute = authRoutes.includes(path)
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
