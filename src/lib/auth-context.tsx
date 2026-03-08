'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AuthUser, AuthSession } from '@/types/auth'
import type { User } from '@supabase/supabase-js'

/** Supabase User → AuthUser 변환 */
function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    nickname: user.user_metadata?.nickname ?? null,
    consentedAt: user.user_metadata?.consented_at
      ? new Date(user.user_metadata.consented_at)
      : null,
  }
}

interface AuthContextValue {
  session: AuthSession
  isLoading: boolean
  /** 인증 상태 강제 새로고침 */
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  session: { type: 'anonymous' },
  isLoading: true,
  refresh: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>({ type: 'anonymous' })
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const refresh = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setSession({ type: 'user', user: toAuthUser(user) })
      } else {
        setSession({ type: 'anonymous' })
      }
    } catch {
      setSession({ type: 'anonymous' })
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    // 초기 인증 상태 로드
    refresh()

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, supabaseSession) => {
      if (supabaseSession?.user) {
        setSession({ type: 'user', user: toAuthUser(supabaseSession.user) })
      } else {
        setSession({ type: 'anonymous' })
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase, refresh])

  return (
    <AuthContext value={{ session, isLoading, refresh }}>
      {children}
    </AuthContext>
  )
}

/** 인증 상태 사용 hook */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

/** 인증된 사용자만 반환하는 편의 hook */
export function useUser(): AuthUser | null {
  const { session } = useAuth()
  return session.type === 'user' ? session.user : null
}
