import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { essays } from '@/db/schema'
import {
  isValidUniqueCode,
  isValidPin,
  verifyPin,
  rateLimitKey,
  checkRateLimit,
} from '@/lib/guest-access'
import type { GuestAccessRequest, ApiError, ApiSuccess } from '@/types/api'

/** POST /api/access — 고유번호 + PIN으로 에세이 조회 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GuestAccessRequest

    // 입력 검증
    if (!body.code || !body.pin) {
      return NextResponse.json<ApiError>(
        { error: '고유번호와 PIN을 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    const code = body.code.toUpperCase().trim()
    const { pin } = body

    if (!isValidUniqueCode(code)) {
      return NextResponse.json<ApiError>(
        { error: '올바른 6자리 고유번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!isValidPin(pin)) {
      return NextResponse.json<ApiError>(
        { error: 'PIN은 4자리 숫자여야 합니다.' },
        { status: 400 }
      )
    }

    // 레이트 리미트 체크
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const key = rateLimitKey(ip, code)
    const rateCheck = checkRateLimit(key)

    if (!rateCheck.allowed) {
      const retryAfterSec = Math.ceil((rateCheck.retryAfterMs ?? 0) / 1000)
      return NextResponse.json<ApiError>(
        {
          error: `너무 많은 시도입니다. ${Math.ceil(retryAfterSec / 60)}분 후에 다시 시도해주세요.`,
          code: 'RATE_LIMITED',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfterSec) },
        }
      )
    }

    // DB 연결 확인
    if (!db) {
      return NextResponse.json<ApiError>(
        { error: '서비스를 일시적으로 사용할 수 없습니다.', code: 'DB_UNAVAILABLE' },
        { status: 503 }
      )
    }

    // 에세이 조회
    const essay = await db
      .select({
        id: essays.id,
        content: essays.content,
        focus: essays.focus,
        style: essays.style,
        todaysWord: essays.todaysWord,
        pinHash: essays.pinHash,
        createdAt: essays.createdAt,
      })
      .from(essays)
      .where(eq(essays.uniqueCode, code))
      .limit(1)

    if (essay.length === 0 || !essay[0]) {
      return NextResponse.json<ApiError>(
        { error: '해당 고유번호를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const found = essay[0]

    // PIN 미설정 에세이
    if (!found.pinHash) {
      return NextResponse.json<ApiError>(
        { error: '이 에세이에는 PIN이 설정되지 않았습니다.', code: 'PIN_NOT_SET' },
        { status: 400 }
      )
    }

    // PIN 검증
    const pinValid = await verifyPin(pin, found.pinHash)
    if (!pinValid) {
      return NextResponse.json<ApiError>(
        { error: 'PIN이 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    // 성공 — pinHash 제외 반환
    const { pinHash: _, ...essayData } = found
    return NextResponse.json<ApiSuccess<typeof essayData>>({
      data: essayData,
      message: '에세이를 성공적으로 조회했습니다.',
    })
  } catch {
    return NextResponse.json<ApiError>(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
