import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runPhase4Review } from '@/lib/agents/phase4-review'

const requestSchema = z.object({
  draft: z.string().min(1000),
  style: z.enum(['question', 'list', 'word', 'story']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { draft, style } = requestSchema.parse(body)
    const result = await runPhase4Review(draft, style)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
