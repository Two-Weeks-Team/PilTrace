import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import type { WritingStyle } from '@/types/essay'

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

export type FlowCritique = z.infer<typeof flowCritiqueSchema>

export async function runFlowEditorAgent(
  draft: string,
  style: WritingStyle
): Promise<FlowCritique> {
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: flowCritiqueSchema,
    system: `당신은 에세이 흐름 편집자입니다. 서사 일관성과 논리적 흐름을 검토합니다.
검토 항목:
- 시간 순서와 인과관계
- 감정 아크의 자연스러움
- 문단 전환의 매끄러움
- 반복 표현 제거
- 길이 검증 (4000~5000자)`,
    prompt: `필체: ${style}\n\n에세이:\n${draft}\n\n위 에세이의 흐름을 검토하고 구체적인 수정 지시사항을 제공해주세요.`,
  })
  return object
}
