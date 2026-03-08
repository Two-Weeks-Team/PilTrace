import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import type { WritingStyle } from '@/types/essay'

const styleCritiqueSchema = z.object({
  aiSmellIssues: z.array(z.object({
    original: z.string(),
    replacement: z.string(),
  })),
  styleConsistency: z.string(),
  naturalness: z.string(),
  suggestions: z.array(z.string()),
})

export type StyleCritique = z.infer<typeof styleCritiqueSchema>

const FORBIDDEN_WORDS = ['흥미롭게도', '중요한 것은', '다양한', '결론적으로', '존재합니다', '~에 의해']

export async function runStyleAuditorAgent(
  draft: string,
  style: WritingStyle
): Promise<StyleCritique> {
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: styleCritiqueSchema,
    system: `당신은 한국어 문체 감수관입니다. AI냄새를 제거하고 자연스러운 한국어를 만듭니다.
AI냄새 금지어: ${FORBIDDEN_WORDS.join(', ')}
검토 항목:
- 필체 일치성 (${style})
- AI냄새 금지어 대체
- 해요체 일관성
- 문장 리듬 자연스러움`,
    prompt: `필체: ${style}\n\n에세이:\n${draft}\n\n위 에세이의 문체를 검토하고 AI냄새를 제거해주세요.`,
  })
  return object
}
