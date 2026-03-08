import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/db'
import { diaries } from '@/db/schema'
import type { ApiError, ApiSuccess } from '@/types/api'

// Zod 검증 스키마
const createDiarySchema = z.object({
  content: z
    .string()
    .min(100, '일기는 최소 100자 이상이어야 합니다.')
    .max(2000, '일기는 최대 2000자까지 가능합니다.'),
  userId: z.string().uuid().nullable().optional(),
})

/** POST /api/diary — 일기 저장 */
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json<ApiError>(
        { error: '서비스를 일시적으로 사용할 수 없습니다.', code: 'DB_UNAVAILABLE' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const parsed = createDiarySchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.'
      return NextResponse.json<ApiError>(
        { error: firstError, code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const { content, userId } = parsed.data

    const [diary] = await db
      .insert(diaries)
      .values({
        content,
        userId: userId ?? null,
      })
      .returning()

    return NextResponse.json<ApiSuccess<typeof diary>>(
      { data: diary, message: '일기가 저장되었습니다.' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json<ApiError>(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/** GET /api/diary — 일기 목록 (userId 필터) */
export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json<ApiError>(
        { error: '서비스를 일시적으로 사용할 수 없습니다.', code: 'DB_UNAVAILABLE' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const query = db
      .select()
      .from(diaries)
      .orderBy(desc(diaries.createdAt))

    const result = userId
      ? await query.where(eq(diaries.userId, userId))
      : await query

    return NextResponse.json<ApiSuccess<typeof result>>({
      data: result,
    })
  } catch {
    return NextResponse.json<ApiError>(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
