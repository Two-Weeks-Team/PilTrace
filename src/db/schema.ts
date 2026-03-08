import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  pgEnum,
  varchar,
  index,
} from 'drizzle-orm/pg-core'

// Enums
export const essayFocusEnum = pgEnum('essay_focus', ['experience', 'feeling'])
export const writingStyleEnum = pgEnum('writing_style', ['question', 'list', 'word', 'story'])

// Users (Supabase Auth 확장)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // auth.users.id와 동일
  email: text('email').notNull().unique(),
  nickname: text('nickname'),
  consentedAt: timestamp('consented_at'), // PIPA 동의 시각
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Diaries (일기 입력)
export const diaries = pgTable('diaries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // nullable (게스트)
  content: text('content').notNull(), // 100~2000자
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('diaries_user_id_idx').on(table.userId),
}))

// Essays (에세이 결과)
export const essays = pgTable('essays', {
  id: uuid('id').defaultRandom().primaryKey(),
  diaryId: uuid('diary_id').references(() => diaries.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }), // nullable (게스트)
  uniqueCode: varchar('unique_code', { length: 6 }).unique(), // 게스트 접근 코드
  pinHash: text('pin_hash'), // bcrypt 해시
  content: text('content').notNull(), // 4000~5000자
  focus: essayFocusEnum('focus').notNull(),
  style: writingStyleEnum('style').notNull(),
  todaysWord: text('todays_word'), // 오늘의 한마디
  surveyData: jsonb('survey_data'), // 설문 질문+답변
  revisionCount: integer('revision_count').default(0).notNull(),
  agentMetadata: jsonb('agent_metadata'), // 에이전트 비용/토큰 정보
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('essays_user_id_idx').on(table.userId),
  uniqueCodeIdx: index('essays_unique_code_idx').on(table.uniqueCode),
}))

// Survey Responses (설문 응답)
export const surveyResponses = pgTable('survey_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  essayId: uuid('essay_id').references(() => essays.id, { onDelete: 'cascade' }).notNull(),
  questions: jsonb('questions').notNull(), // SurveyQuestion[]
  answers: jsonb('answers').notNull(),    // Record<string, string>
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Diary = typeof diaries.$inferSelect
export type NewDiary = typeof diaries.$inferInsert
export type Essay = typeof essays.$inferSelect
export type NewEssay = typeof essays.$inferInsert
export type SurveyResponse = typeof surveyResponses.$inferSelect
export type NewSurveyResponse = typeof surveyResponses.$inferInsert
