import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/db'
import { essays } from '@/db/schema'
import type { ApiError, ApiSuccess } from '@/types/api'

// Zod 검증 스키마
const createEssaySchema = z.object({
  diaryId: z.string().uuid('올바른 일기 ID 형식이 아닙니다.'),
  content: z.string().min(1, '에세이 내용이 필요합니다.'),
  focus: z.enum(['experience', 'feeling'], {
    error: 'focus는 experience 또는 feeling이어야 합니다.',
  }),
  style: z.enum(['question', 'list', 'word', 'story'], {
    error: 'style은 question, list, word, story 중 하나여야 합니다.',
  }),
  surveyData: z.unknown().optional(),
  agentMetadata: z.unknown().optional(),
  userId: z.string().uuid().nullable().optional(),
  isGuest: z.boolean().optional(),
})

/** POST /api/essay — 에세이 저장 */
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json<ApiError>(
        { error: '서비스를 일시적으로 사용할 수 없습니다.', code: 'DB_UNAVAILABLE' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const parsed = createEssaySchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.'
      return NextResponse.json<ApiError>(
        { error: firstError, code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const { diaryId, content, focus, style, surveyData, agentMetadata, userId } = parsed.data

    const [essay] = await db
      .insert(essays)
      .values({
        diaryId,
        content,
        focus,
        style,
        surveyData: surveyData ?? null,
        agentMetadata: agentMetadata ?? null,
        userId: userId ?? null,
      })
      .returning()

    return NextResponse.json<ApiSuccess<typeof essay>>(
      { data: essay, message: '에세이가 저장되었습니다.' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json<ApiError>(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/** GET /api/essay — 에세이 목록 (userId 필터) */
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

    // pinHash 제외하여 반환
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
    }

    const query = db
      .select(selectFields)
      .from(essays)
      .orderBy(desc(essays.createdAt))

    const result = userId
      ? await query.where(eq(essays.userId, userId))
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
