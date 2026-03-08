import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import type { WritingStyle } from '@/types/essay'

const toneGuideSchema = z.object({
  sentencePattern: z.string(),
  paragraphStyle: z.string(),
  rhythmGuide: z.string(),
  forbiddenWords: z.array(z.string()),
  styleNotes: z.string(),
})

export type ToneGuide = z.infer<typeof toneGuideSchema>

export async function runToneCalibratorAgent(
  style: WritingStyle,
  diary: string
): Promise<ToneGuide> {
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: toneGuideSchema,
    system: `당신은 한국어 문체 전문가입니다. 필체별 문체 가이드를 작성합니다.
규칙:
- 짧은문장(10-20자) + 긴문장(40-60자) 교차 패턴
- 해요체 기본
- 문단당 3~5문장
- AI냄새 금지어 목록 포함: 흥미롭게도, 중요한 것은, 다양한, 결론적으로, 존재합니다`,
    prompt: `필체: ${style}\n일기 샘플: ${diary.slice(0, 200)}\n\n이 필체에 맞는 문체 가이드를 작성해주세요.`,
  })
  return object
}
