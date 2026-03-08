import bcrypt from 'bcryptjs'

// 혼동문자 제외: 0, O, I, l, 1
const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' as const
const CODE_LENGTH = 6
const PIN_SALT_ROUNDS = 10
const PIN_LENGTH = 4

// === 고유번호 생성 ===

/** 6자리 영숫자 고유번호 생성 (혼동문자 제외) */
export function generateUniqueCode(): string {
  let code = ''
  const array = new Uint32Array(CODE_LENGTH)
  crypto.getRandomValues(array)
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARSET[array[i] % CHARSET.length]
  }
  return code
}

/** 고유번호 형식 검증 */
export function isValidUniqueCode(code: string): boolean {
  if (code.length !== CODE_LENGTH) return false
  return [...code].every((c) => CHARSET.includes(c))
}

// === PIN 해싱 ===

/** 4자리 PIN을 bcrypt로 해싱 */
export async function hashPin(pin: string): Promise<string> {
  if (!isValidPin(pin)) {
    throw new Error('PIN must be exactly 4 digits')
  }
  return bcrypt.hash(pin, PIN_SALT_ROUNDS)
}

/** PIN과 해시 비교 */
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash)
}

/** PIN 형식 검증 (4자리 숫자) */
export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin)
}

// === 레이트 리미트 (in-memory) ===

interface RateLimitEntry {
  count: number
  resetAt: number // timestamp ms
}

const rateLimitMap = new Map<string, RateLimitEntry>()

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15분

/** 레이트 리미트 키 생성 (IP + unique_code) */
export function rateLimitKey(ip: string, code: string): string {
  return `${ip}:${code}`
}

/**
 * 레이트 리미트 체크 & 카운트 증가
 * @returns { allowed: true } | { allowed: false, retryAfterMs }
 */
export function checkRateLimit(key: string): {
  allowed: boolean
  retryAfterMs?: number
} {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  // 만료된 엔트리 삭제
  if (entry && now >= entry.resetAt) {
    rateLimitMap.delete(key)
  }

  const current = rateLimitMap.get(key)

  if (!current) {
    // 첫 시도
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return { allowed: true }
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfterMs: current.resetAt - now,
    }
  }

  // 카운트 증가
  current.count++
  return { allowed: true }
}

/** 만료된 엔트리 정리 (주기적 호출용) */
export function cleanupRateLimits(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap) {
    if (now >= entry.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}
