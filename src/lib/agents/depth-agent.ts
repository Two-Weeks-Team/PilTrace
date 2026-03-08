import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import type { EssayFocus, WritingStyle } from '@/types/essay'

const questionsSchema = z.object({
  questions: z.array(z.string()).min(1).max(3)
})

export async function runDepthAgent(
  diary: string,
  focus: EssayFocus,
  style: WritingStyle
): Promise<string[]> {
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: questionsSchema,
    system: `당신은 따뜻한 상담사입니다. 성찰적이고 감정적인 탐색 질문을 합니다.
규칙:
- 장면 기반 질문만 ("그 순간 몸이 어떻게 반응했나요?")
- 직접적 감정 단어 금지 ("슬펐나요?" ❌)
- 1~3개 질문만 생성
- 내면의 변화나 신체 반응에 집중`,
    prompt: `일기: ${diary}\n초점: ${focus}\n필체: ${style}\n\n이 일기에서 더 깊이 탐색할 1~3개 질문을 만들어주세요.`,
  })
  return object.questions
}
