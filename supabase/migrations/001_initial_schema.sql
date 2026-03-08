-- ================================================
-- PilTrace Initial Schema Migration
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ================================================

-- 1. Create custom enums
CREATE TYPE essay_focus AS ENUM ('experience', 'feeling');
CREATE TYPE writing_style AS ENUM ('question', 'list', 'word', 'story');

-- 2. Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nickname TEXT,
  consented_at TIMESTAMPTZ,  -- PIPA 동의 시각
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Diaries table (일기 입력, 100~2000자)
CREATE TABLE IF NOT EXISTS diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- nullable (게스트)
  content TEXT NOT NULL,  -- 100~2000자
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS diaries_user_id_idx ON diaries(user_id);

-- 4. Essays table (에세이 결과, 4000~5000자)
CREATE TABLE IF NOT EXISTS essays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- nullable (게스트)
  unique_code VARCHAR(6) UNIQUE,  -- 게스트 접근 코드 (영숫자 6자리)
  pin_hash TEXT,  -- bcrypt 해시
  content TEXT NOT NULL,  -- 4000~5000자
  focus essay_focus NOT NULL,
  style writing_style NOT NULL,
  todays_word TEXT,  -- 오늘의 한마디
  survey_data JSONB,  -- 설문 질문+답변
  revision_count INTEGER NOT NULL DEFAULT 0,
  agent_metadata JSONB,  -- 에이전트 비용/토큰 정보
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS essays_user_id_idx ON essays(user_id);
CREATE INDEX IF NOT EXISTS essays_unique_code_idx ON essays(unique_code);

-- 5. Survey Responses table (설문 응답)
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  essay_id UUID NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,  -- SurveyQuestion[]
  answers JSONB NOT NULL,    -- Record<string, string>
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Users: 자신의 프로필만 CRUD
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Diaries: 자신의 일기만 CRUD
CREATE POLICY "Users can view own diaries" ON diaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diaries" ON diaries
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own diaries" ON diaries
  FOR DELETE USING (auth.uid() = user_id);

-- Essays: 자신의 에세이 + 고유번호로 게스트 접근
CREATE POLICY "Users can view own essays" ON essays
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view essays by unique_code" ON essays
  FOR SELECT USING (unique_code IS NOT NULL);

CREATE POLICY "Users can insert essays" ON essays
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own essays" ON essays
  FOR UPDATE USING (auth.uid() = user_id);

-- Survey Responses: 에세이 소유자만
CREATE POLICY "Users can view own survey responses" ON survey_responses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM essays WHERE essays.id = survey_responses.essay_id AND essays.user_id = auth.uid())
  );

CREATE POLICY "Users can insert survey responses" ON survey_responses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM essays WHERE essays.id = survey_responses.essay_id AND (essays.user_id = auth.uid() OR essays.user_id IS NULL))
  );

-- 7. Service role bypass (API routes use service_role key via Drizzle)
-- Note: Drizzle connects directly via DATABASE_URL, bypassing RLS.
-- RLS policies above are for Supabase client SDK access only.

-- 8. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_essays_updated_at
  BEFORE UPDATE ON essays
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Auth trigger: auto-create public.users row on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
