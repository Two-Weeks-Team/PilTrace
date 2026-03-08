import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { essays } from '@/db/schema'
import {
  isValidPin,
  hashPin,
  generateUniqueCode,
  isValidUniqueCode,
} from '@/lib/guest-access'
import type { ApiError, ApiSuccess } from '@/types/api'

interface PinSetRequest {
  pin: string // 4자리 숫자
}

interface PinSetResponse {
  uniqueCode: string
}

/** POST /api/essay/[id]/pin — 에세이에 PIN 설정 + 고유번호 자동 생성 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: essayId } = await params

    if (!essayId) {
      return NextResponse.json<ApiError>(
        { error: '에세이 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const body = (await request.json()) as PinSetRequest

    if (!body.pin || !isValidPin(body.pin)) {
      return NextResponse.json<ApiError>(
        { error: 'PIN은 4자리 숫자여야 합니다.' },
        { status: 400 }
      )
    }

    // DB 연결 확인
    if (!db) {
      return NextResponse.json<ApiError>(
        { error: '서비스를 일시적으로 사용할 수 없습니다.', code: 'DB_UNAVAILABLE' },
        { status: 503 }
      )
    }

    // 에세이 존재 확인
    const existing = await db
      .select({
        id: essays.id,
        uniqueCode: essays.uniqueCode,
        pinHash: essays.pinHash,
      })
      .from(essays)
      .where(eq(essays.id, essayId))
      .limit(1)

    if (existing.length === 0 || !existing[0]) {
      return NextResponse.json<ApiError>(
        { error: '에세이를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 이미 PIN이 설정된 경우
    if (existing[0].pinHash) {
      return NextResponse.json<ApiError>(
        { error: 'PIN이 이미 설정되어 있습니다. 변경은 지원되지 않습니다.', code: 'PIN_ALREADY_SET' },
        { status: 409 }
      )
    }

    // PIN 해싱
    const pinHash = await hashPin(body.pin)

    // 고유번호 생성 (충돌 시 최대 10번 재시도)
    let uniqueCode = existing[0].uniqueCode
    if (!uniqueCode) {
      for (let attempt = 0; attempt < 10; attempt++) {
        const candidate = generateUniqueCode()
        const conflict = await db
          .select({ id: essays.id })
          .from(essays)
          .where(eq(essays.uniqueCode, candidate))
          .limit(1)

        if (conflict.length === 0) {
          uniqueCode = candidate
          break
        }
      }

      if (!uniqueCode || !isValidUniqueCode(uniqueCode)) {
        return NextResponse.json<ApiError>(
          { error: '고유번호 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' },
          { status: 500 }
        )
      }
    }

    // DB 업데이트
    await db
      .update(essays)
      .set({
        uniqueCode,
        pinHash,
        updatedAt: new Date(),
      })
      .where(eq(essays.id, essayId))

    return NextResponse.json<ApiSuccess<PinSetResponse>>({
      data: { uniqueCode },
      message: 'PIN이 설정되었습니다. 고유번호를 기억해주세요.',
    })
  } catch {
    return NextResponse.json<ApiError>(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
