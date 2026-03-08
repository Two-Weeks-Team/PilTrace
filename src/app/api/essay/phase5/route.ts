import { NextRequest } from 'next/server'
import { z } from 'zod'
import { runPolisherAgent } from '@/lib/agents/polisher-agent'

const flowCritiqueSchema = z.object({
  issues: z.array(z.object({
    location: z.string(),
    problem: z.string(),
    suggestion: z.string(),
  })),
  overallFlow: z.string(),
  lengthCheck: z.object({
    charCount: z.number(),
    isInRange: z.boolean(),
    adjustment: z.string(),
  }),
})

const styleCritiqueSchema = z.object({
  aiSmellIssues: z.array(z.object({
    original: z.string(),
    replacement: z.string(),
  })),
  styleConsistency: z.string(),
  naturalness: z.string(),
  suggestions: z.array(z.string()),
})

const requestSchema = z.object({
  draft: z.string().min(1000),
  flow_critique: flowCritiqueSchema,
  style_critique: styleCritiqueSchema,
  style: z.enum(['question', 'list', 'word', 'story']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { draft, flow_critique, style_critique, style } = requestSchema.parse(body)
    
    const result = runPolisherAgent(draft, flow_critique, style_critique, style)
    return result.toTextStreamResponse()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.issues }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
