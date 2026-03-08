import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import type { EssayFocus, WritingStyle } from '@/types/essay'

const outlineSchema = z.object({
  sections: z.array(z.object({
    title: z.string(),
    keyPoints: z.array(z.string()),
    paragraphCount: z.number().min(1).max(3),
  })).min(8).max(12),
  structure: z.string(),
})

export type EssayOutline = z.infer<typeof outlineSchema>

export async function runArchitectAgent(
  diary: string,
  surveyAnswers: string[],
  focus: EssayFocus,
  style: WritingStyle
): Promise<EssayOutline> {
  const structureGuide = {
    question: '독자에게 질문을 던지며 전개하는 구조',
    list: '장면과 감각을 나열하는 구조',
    word: '핵심 단어 중심 연상 전개 구조',
    story: '기승전결 서사 구조',
  }[style]

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: outlineSchema,
    system: `당신은 에세이 설계사입니다. 한국어 수필의 구조를 설계합니다.
구조 유형: ${structureGuide}
규칙:
- 8~12개 섹션 설계
- 각 섹션에 핵심 소재 배치
- 필체에 맞는 구조 선택`,
    prompt: `일기: ${diary}\n설문 응답: ${surveyAnswers.join('\n')}\n초점: ${focus}\n필체: ${style}\n\n에세이 아웃라인을 설계해주세요.`,
  })
  return object
}
