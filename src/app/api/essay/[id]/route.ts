import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { essays } from '@/db/schema'
import type { ApiError, ApiSuccess } from '@/types/api'

type RouteParams = { params: Promise<{ id: string }> }

// PATCH 검증 스키마
const updateEssaySchema = z.object({
  todaysWord: z.string().optional(),
  revisionCount: z.number().int().min(0).optional(),
}).refine(
  (data) => data.todaysWord !== undefined || data.revisionCount !== undefined,
  { message: '수정할 필드가 최소 하나 필요합니다.' }
)

// pinHash 제외 select 필드
const selectFields = {
  id: essays.id,
  diaryId: essays.diaryId,
  userId: essays.userId,
  uniqueCode: essays.uniqueCode,
  content: essays.content,
  focus: essays.focus,
  style: essays.style,
  todaysWord: essays.todaysWord,
  surveyData: essays.surveyData,
  revisionCount: essays.revisionCount,
  agentMetadata: essays.agentMetadata,
  createdAt: essays.createdAt,
  updatedAt: essays.updatedAt,
} as const

/** GET /api/essay/[id] — 에세이 단건 조회 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    if (!db) {
      return NextResponse.json<ApiError>(
        { error: '서비스를 일시적으로 사용할 수 없습니다.', code: 'DB_UNAVAILABLE' },
        { status: 503 }
      )
    }

    const result = await db
      .select(selectFields)
      .from(essays)
      .where(eq(essays.id, id))
      .limit(1)

    if (result.length === 0 || !result[0]) {
      return NextResponse.json<ApiError>(
        { error: '에세이를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiSuccess<typeof result[0]>>({
      data: result[0],
    })
  } catch {
    return NextResponse.json<ApiError>(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/** PATCH /api/essay/[id] — 에세이 수정 (todaysWord, revisionCount) */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    if (!db) {
      return NextResponse.json<ApiError>(
        { error: '서비스를 일시적으로 사용할 수 없습니다.', code: 'DB_UNAVAILABLE' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const parsed = updateEssaySchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.'
      return NextResponse.json<ApiError>(
        { error: firstError, code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // 에세이 존재 확인
    const existing = await db
      .select({ id: essays.id })
      .from(essays)
      .where(eq(essays.id, id))
      .limit(1)

    if (existing.length === 0) {
      return NextResponse.json<ApiError>(
        { error: '에세이를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 업데이트 필드 구성
    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (parsed.data.todaysWord !== undefined) {
      updateData.todaysWord = parsed.data.todaysWord
    }
    if (parsed.data.revisionCount !== undefined) {
      updateData.revisionCount = parsed.data.revisionCount
    }

    const [updated] = await db
      .update(essays)
      .set(updateData)
      .where(eq(essays.id, id))
      .returning(selectFields)

    return NextResponse.json<ApiSuccess<typeof updated>>({
      data: updated,
      message: '에세이가 수정되었습니다.',
    })
  } catch {
    return NextResponse.json<ApiError>(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/** DELETE /api/essay/[id] — 에세이 삭제 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    if (!db) {
      return NextResponse.json<ApiError>(
        { error: '서비스를 일시적으로 사용할 수 없습니다.', code: 'DB_UNAVAILABLE' },
        { status: 503 }
      )
    }

    const result = await db
      .delete(essays)
      .where(eq(essays.id, id))
      .returning({ id: essays.id })

    if (result.length === 0) {
      return NextResponse.json<ApiError>(
        { error: '에세이를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiSuccess>(
      { data: undefined, message: '에세이가 삭제되었습니다.' }
    )
  } catch {
    return NextResponse.json<ApiError>(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
