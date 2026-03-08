import { runFlowEditorAgent, type FlowCritique } from './flow-editor-agent'
import { runStyleAuditorAgent, type StyleCritique } from './style-auditor-agent'
import type { WritingStyle } from '@/types/essay'

export interface Phase4Result {
  flowCritique: FlowCritique
  styleCritique: StyleCritique
}

export async function runPhase4Review(
  draft: string,
  style: WritingStyle
): Promise<Phase4Result> {
  const [flowCritique, styleCritique] = await Promise.all([
    runFlowEditorAgent(draft, style),
    runStyleAuditorAgent(draft, style),
  ])
  return { flowCritique, styleCritique }
}
