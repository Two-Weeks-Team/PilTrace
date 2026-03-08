import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import type { EssayFocus, WritingStyle } from '@/types/essay'

const questionsSchema = z.object({
  questions: z.array(z.string()).min(1).max(3)
})

export async function runCuriosityAgent(
  diary: string,
  focus: EssayFocus,
  style: WritingStyle
): Promise<string[]> {
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: questionsSchema,
    system: `당신은 사용자의 친한 친구입니다. 따뜻하고 호기심 많은 탐색 질문을 합니다.
규칙:
- 장면 기반 질문만 ("그때 어디에 있었나요?")
- 직접적 감정 단어 금지 ("행복했나요?" ❌)
- 1~3개 질문만 생성
- 초점이 experience면 경험적 질문, feeling이면 감정적 장면 질문`,
    prompt: `일기: ${diary}\n초점: ${focus}\n필체: ${style}\n\n이 일기에서 더 알고 싶은 것을 1~3개 질문으로 만들어주세요.`,
  })
  return object.questions
}
