import { NextRequest } from 'next/server'
import { z } from 'zod'
import { runWriterAgent } from '@/lib/agents/writer-agent'

const requestSchema = z.object({
  diary: z.string().min(100).max(2000),
  survey_answers: z.array(z.string()),
  outline: z.object({
    sections: z.array(z.object({
      title: z.string(),
      keyPoints: z.array(z.string()),
      paragraphCount: z.number(),
    })),
    structure: z.string(),
  }),
  tone_guide: z.object({
    sentencePattern: z.string(),
    paragraphStyle: z.string(),
    rhythmGuide: z.string(),
    forbiddenWords: z.array(z.string()),
    styleNotes: z.string(),
  }),
  focus: z.enum(['experience', 'feeling']),
  style: z.enum(['question', 'list', 'word', 'story']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { diary, survey_answers, outline, tone_guide, focus, style } = requestSchema.parse(body)
    
    const result = await runWriterAgent(
      diary,
      survey_answers,
      outline,
      tone_guide,
      focus,
      style
    )
    
    return result.toTextStreamResponse()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.issues }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
