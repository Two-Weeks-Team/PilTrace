// 인증된 사용자
export interface AuthUser {
  id: string
  email: string
  nickname: string | null
  consentedAt: Date | null
}

// 게스트 접근
export interface GuestAccess {
  uniqueCode: string   // 6자리 영숫자
  // PIN은 서버에서만 처리, 클라이언트에 절대 노출 금지
}

// 인증 세션 (서버/클라이언트 공통)
export type AuthSession = 
  | { type: 'user'; user: AuthUser }
  | { type: 'guest'; code: string }
  | { type: 'anonymous' }
