import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runPhase1Survey } from '@/lib/agents/phase1-survey'

const requestSchema = z.object({
  content: z.string().min(100).max(2000),
  focus: z.enum(['experience', 'feeling']),
  style: z.enum(['question', 'list', 'word', 'story']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, focus, style } = requestSchema.parse(body)
    const result = await runPhase1Survey(content, focus, style)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
