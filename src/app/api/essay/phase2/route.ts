import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runPhase2Planning } from '@/lib/agents/phase2-planning'

const requestSchema = z.object({
  diary: z.string().min(100).max(2000),
  survey_answers: z.array(z.string()),
  focus: z.enum(['experience', 'feeling']),
  style: z.enum(['question', 'list', 'word', 'story']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { diary, survey_answers, focus, style } = requestSchema.parse(body)
    const result = await runPhase2Planning(diary, survey_answers, focus, style)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
