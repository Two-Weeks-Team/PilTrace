import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { diaries } from '@/db/schema'
import type { ApiError, ApiSuccess } from '@/types/api'

type RouteParams = { params: Promise<{ id: string }> }

/** GET /api/diary/[id] — 일기 단건 조회 */
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
      .select()
      .from(diaries)
      .where(eq(diaries.id, id))
      .limit(1)

    if (result.length === 0 || !result[0]) {
      return NextResponse.json<ApiError>(
        { error: '일기를 찾을 수 없습니다.' },
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

/** DELETE /api/diary/[id] — 일기 삭제 */
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
      .delete(diaries)
      .where(eq(diaries.id, id))
      .returning({ id: diaries.id })

    if (result.length === 0) {
      return NextResponse.json<ApiError>(
        { error: '일기를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiSuccess>(
      { data: undefined, message: '일기가 삭제되었습니다.' }
    )
  } catch {
    return NextResponse.json<ApiError>(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
