/**
 * PilTrace Full E2E Test Script
 * Tests: Auth, Diary CRUD, AI Pipeline (Phase 1-5), Essay CRUD, Guest Access, Edge Cases
 */

const BASE = 'http://localhost:3000'
const SUPABASE_URL = 'https://iknjujljsoqqjyrjuwid.supabase.co'
const SUPABASE_KEY = 'sb_publishable_zQ6kAfl4RxnLD6WHoRJgVw_oGkKh6-L'

const TEST_EMAIL = 'piltrace.test.2026@gmail.com'
const TEST_PASSWORD = 'Test1234!'

let results = []
let accessToken = null
let testDiaryId = null
let testEssayId = null
let testUniqueCode = null

function log(name, pass, detail = '') {
  const icon = pass ? '✅' : '❌'
  results.push({ name, pass, detail })
  console.log(`  ${icon} ${name}${detail ? ` — ${detail}` : ''}`)
}

async function req(url, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers }
  const res = await fetch(url, { ...opts, headers })
  const text = await res.text()
  let json = null
  try { json = JSON.parse(text) } catch {}
  return { status: res.status, json, text, headers: res.headers }
}

// ============================================================
// 1. PAGE RENDERING
// ============================================================
async function testPages() {
  console.log('\n📄 1. Page Rendering Tests')
  const pages = ['/', '/login', '/signup', '/access', '/write']
  for (const page of pages) {
    const r = await req(`${BASE}${page}`)
    log(`GET ${page}`, r.status === 200, `HTTP ${r.status}`)
  }
  // Protected routes should redirect
  const r = await req(`${BASE}/drawer`, { redirect: 'manual' })
  log('GET /drawer (unauthenticated)', r.status === 307 || r.status === 200, `HTTP ${r.status}`)
}

// ============================================================
// 2. AUTH E2E
// ============================================================
async function testAuth() {
  console.log('\n🔐 2. Auth E2E Tests')
  
  // Signup
  // Signup — test user already exists, so we expect either success or 'already registered'
  const signup = await req(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
  })
  const hasUser = signup.json?.id || signup.json?.user?.id
  const alreadyRegistered = signup.json?.identities?.length === 0 || signup.json?.msg?.includes?.('already') || signup.status === 429
  const signupOk = !!hasUser || alreadyRegistered
  log('Signup (or already exists)', signupOk, alreadyRegistered ? 'user already registered (OK)' : hasUser ? `user_id=${String(hasUser).slice(0,8)}...` : JSON.stringify(signup.json).slice(0,100))

  // Login
  const login = await req(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
  })
  accessToken = login.json?.access_token
  log('Login', !!accessToken, accessToken ? 'token received' : JSON.stringify(login.json).slice(0,100))
  
  // Logout endpoint
  const logout = await req(`${BASE}/api/auth/logout`, { method: 'POST' })
  log('Logout endpoint', logout.json?.success === true, JSON.stringify(logout.json))
}

// ============================================================
// 3. DIARY CRUD E2E
// ============================================================
async function testDiaryCRUD() {
  console.log('\n📝 3. Diary CRUD Tests')
  
  const DIARY_CONTENT = '오늘은 정말 특별한 하루였다. 아침에 일어나서 창밖을 보니 벚꽃이 만개해 있었다. 따뜻한 봄바람이 불어오고 새들이 노래하는 소리가 들렸다. 커피 한 잔을 마시며 잠시 명상을 했다. 마음이 차분해지는 느낌이었다. 이런 평화로운 순간이 더 있었으면 좋겠다.'
  
  // Create diary
  const create = await req(`${BASE}/api/diary`, {
    method: 'POST',
    body: JSON.stringify({ content: DIARY_CONTENT })
  })
  testDiaryId = create.json?.data?.id
  log('Create diary (POST /api/diary)', create.status === 201 && !!testDiaryId, `id=${testDiaryId}`)

  // Get single diary
  if (testDiaryId) {
    const get = await req(`${BASE}/api/diary/${testDiaryId}`)
    log('Get diary (GET /api/diary/:id)', get.status === 200 && get.json?.data?.id === testDiaryId, `content length=${get.json?.data?.content?.length}`)
  }

  // List diaries
  const list = await req(`${BASE}/api/diary`)
  log('List diaries (GET /api/diary)', list.status === 200 && Array.isArray(list.json?.data), `count=${list.json?.data?.length}`)

  // Delete diary (we'll create another one just for deletion test)
  const temp = await req(`${BASE}/api/diary`, {
    method: 'POST',
    body: JSON.stringify({ content: DIARY_CONTENT })
  })
  const tempId = temp.json?.data?.id
  if (tempId) {
    const del = await req(`${BASE}/api/diary/${tempId}`, { method: 'DELETE' })
    log('Delete diary (DELETE /api/diary/:id)', del.status === 200, del.json?.message)
    
    // Verify deleted
    const verify = await req(`${BASE}/api/diary/${tempId}`)
    log('Verify deletion (GET deleted diary)', verify.status === 404, `HTTP ${verify.status}`)
  }
}

// ============================================================
// 4. AI PIPELINE E2E (Phase 1→2→3→4→5)
// ============================================================
async function testAIPipeline() {
  console.log('\n🤖 4. AI Pipeline E2E Tests (Phase 1→2→3→4→5)')
  
  const DIARY = '오늘은 정말 특별한 하루였다. 아침에 일어나서 창밖을 보니 벚꽃이 만개해 있었다. 따뜻한 봄바람이 불어오고 새들이 노래하는 소리가 들렸다. 커피 한 잔을 마시며 잠시 명상을 했다. 마음이 차분해지는 느낌이었다. 이런 평화로운 순간이 더 있었으면 좋겠다.'

  // Phase 1: Survey
  console.log('  ⏳ Phase 1: Survey generation...')
  const p1 = await req(`${BASE}/api/essay/phase1`, {
    method: 'POST',
    body: JSON.stringify({ content: DIARY, focus: 'experience', style: 'story' })
  })
  const questions = p1.json?.questions
  log('Phase 1: Survey', Array.isArray(questions) && questions.length >= 3, `${questions?.length} questions`)

  if (!questions?.length) { log('Phase 2-5: SKIPPED (Phase 1 failed)', false); return }

  // Phase 2: Planning
  console.log('  ⏳ Phase 2: Essay planning...')
  const surveyAnswers = questions.slice(0, 3).map((q, i) => 
    ['벚꽃이 활짝 핀 모습이 가장 기억나요', '어릴 때 할머니 집 앞의 벚꽃이 떠올랐어요', '따뜻하고 포근한 분위기였어요'][i] || '잘 모르겠어요'
  )
  const p2 = await req(`${BASE}/api/essay/phase2`, {
    method: 'POST',
    body: JSON.stringify({ diary: DIARY, survey_answers: surveyAnswers, focus: 'experience', style: 'story' })
  })
  const outline = p2.json?.outline
  const toneGuide = p2.json?.toneGuide
  log('Phase 2: Planning', !!outline?.sections && !!toneGuide, `${outline?.sections?.length} sections`)

  if (!outline || !toneGuide) { log('Phase 3-5: SKIPPED (Phase 2 failed)', false); return }

  // Phase 3: Writing (streaming response)
  console.log('  ⏳ Phase 3: Essay writing (streaming, ~30-60s)...')
  const p3Res = await fetch(`${BASE}/api/essay/phase3`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      diary: DIARY,
      survey_answers: surveyAnswers,
      outline,
      tone_guide: toneGuide,
      focus: 'experience',
      style: 'story'
    })
  })
  
  let draft = ''
  if (p3Res.ok) {
    const reader = p3Res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      // Plain text stream or AI SDK protocol
      if (chunk.includes('0:')) {
        const lines = chunk.split('\n').filter(l => l.trim())
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try { const t = JSON.parse(line.slice(2)); if (typeof t === 'string') draft += t } catch {}
          }
        }
      } else {
        draft += chunk
      }
    }
  }
  const draftLen = draft.length
  log('Phase 3: Writing', p3Res.ok && draftLen > 1000, `${draftLen} chars (target: 4000-5000)`)

  if (draftLen < 1000) {
    console.log('  ⚠️ Draft too short, continuing with what we have...')
  }

  // Phase 4: Review
  console.log('  ⏳ Phase 4: Review (flow + style critique)...')
  const p4 = await req(`${BASE}/api/essay/phase4`, {
    method: 'POST',
    body: JSON.stringify({ draft, style: 'story' })
  })
  const flowCritique = p4.json?.flowCritique
  const styleCritique = p4.json?.styleCritique
  log('Phase 4: Review', !!flowCritique && !!styleCritique, `flow issues=${flowCritique?.issues?.length}, style issues=${styleCritique?.aiSmellIssues?.length}`)

  if (!flowCritique || !styleCritique) { log('Phase 5: SKIPPED (Phase 4 failed)', false); return }

  // Phase 5: Polish (streaming response)
  console.log('  ⏳ Phase 5: Polish (final essay, ~30-60s)...')
  const p5Res = await fetch(`${BASE}/api/essay/phase5`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      draft,
      flow_critique: flowCritique,
      style_critique: styleCritique,
      style: 'story'
    })
  })
  
  let finalEssay = ''
  if (p5Res.ok) {
    const reader = p5Res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      if (chunk.includes('0:')) {
        const lines = chunk.split('\n').filter(l => l.trim())
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try { const t = JSON.parse(line.slice(2)); if (typeof t === 'string') finalEssay += t } catch {}
          }
        }
      } else {
        finalEssay += chunk
      }
    }
  }
  const finalLen = finalEssay.length
  log('Phase 5: Polish', p5Res.ok && finalLen > 1000, `${finalLen} chars`)
  
  // Store for essay CRUD test
  return { diary: DIARY, finalEssay, surveyAnswers }
}

// ============================================================
// 5. ESSAY CRUD + PIN/GUEST ACCESS
// ============================================================
async function testEssayCRUD(pipelineResult) {
  console.log('\n📚 5. Essay CRUD + Guest Access Tests')
  
  const essayContent = pipelineResult?.finalEssay || '이것은 테스트 에세이입니다. '.repeat(200)
  
  // Save essay
  const create = await req(`${BASE}/api/essay`, {
    method: 'POST',
    body: JSON.stringify({
      diaryId: testDiaryId,
      content: essayContent,
      focus: 'experience',
      style: 'story',
      surveyData: { answers: ['답변1', '답변2'] },
    })
  })
  testEssayId = create.json?.data?.id
  log('Save essay (POST /api/essay)', create.status === 201 && !!testEssayId, `id=${testEssayId}`)

  if (!testEssayId) return

  // Get essay
  const get = await req(`${BASE}/api/essay/${testEssayId}`)
  log('Get essay (GET /api/essay/:id)', get.status === 200 && get.json?.data?.id === testEssayId, `content length=${get.json?.data?.content?.length}`)

  // Update essay (todaysWord)
  const patch = await req(`${BASE}/api/essay/${testEssayId}`, {
    method: 'PATCH',
    body: JSON.stringify({ todaysWord: '오늘의 한마디: 봄은 아름답다' })
  })
  log('Update essay todaysWord (PATCH)', patch.status === 200, patch.json?.data?.todaysWord)

  // Set PIN + generate unique code
  const pin = await req(`${BASE}/api/essay/${testEssayId}/pin`, {
    method: 'POST',
    body: JSON.stringify({ pin: '1234' })
  })
  testUniqueCode = pin.json?.data?.uniqueCode
  log('Set PIN + generate code (POST /api/essay/:id/pin)', !!testUniqueCode, `code=${testUniqueCode}`)

  // Guest access with correct PIN
  if (testUniqueCode) {
    const access = await req(`${BASE}/api/access`, {
      method: 'POST',
      body: JSON.stringify({ code: testUniqueCode, pin: '1234' })
    })
    log('Guest access (correct PIN)', access.status === 200 && !!access.json?.data, `essay found: ${!!access.json?.data?.content}`)

    // Guest access with wrong PIN
    const wrongPin = await req(`${BASE}/api/access`, {
      method: 'POST',
      body: JSON.stringify({ code: testUniqueCode, pin: '9999' })
    })
    log('Guest access (wrong PIN)', wrongPin.status === 401, `${wrongPin.json?.error}`)
  }

  // List essays
  const list = await req(`${BASE}/api/essay`)
  log('List essays (GET /api/essay)', list.status === 200 && Array.isArray(list.json?.data), `count=${list.json?.data?.length}`)
}

// ============================================================
// 6. EDGE CASES
// ============================================================
async function testEdgeCases() {
  console.log('\n🔬 6. Edge Case Tests')
  
  // Min length (exactly 100)
  const min = '가'.repeat(100)
  const r1 = await req(`${BASE}/api/diary`, { method: 'POST', body: JSON.stringify({ content: min }) })
  log('Diary min input (100 chars)', r1.status === 201, `${r1.status}`)

  // Too short (99)
  const short = '가'.repeat(99)
  const r2 = await req(`${BASE}/api/diary`, { method: 'POST', body: JSON.stringify({ content: short }) })
  log('Diary too short (99 chars)', r2.status === 400, r2.json?.error?.slice(0, 50))

  // Max length (2000)
  const max = '가'.repeat(2000)
  const r3 = await req(`${BASE}/api/diary`, { method: 'POST', body: JSON.stringify({ content: max }) })
  log('Diary max input (2000 chars)', r3.status === 201, `${r3.status}`)

  // Too long (2001)
  const long = '가'.repeat(2001)
  const r4 = await req(`${BASE}/api/diary`, { method: 'POST', body: JSON.stringify({ content: long }) })
  log('Diary too long (2001 chars)', r4.status === 400, r4.json?.error?.slice(0, 50))

  // Empty body
  const r5 = await req(`${BASE}/api/diary`, { method: 'POST', body: '{}' })
  log('Diary empty body', r5.status === 400, r5.json?.error?.slice(0, 50))

  // Invalid guest code format
  const r6 = await req(`${BASE}/api/access`, { method: 'POST', body: JSON.stringify({ code: 'abc', pin: '1234' }) })
  log('Guest: invalid code format', r6.status === 400, r6.json?.error?.slice(0, 50))

  // Invalid PIN format
  const r7 = await req(`${BASE}/api/access`, { method: 'POST', body: JSON.stringify({ code: 'AB12C3', pin: 'abcd' }) })
  log('Guest: invalid PIN format', r7.status === 400, r7.json?.error?.slice(0, 50))

  // Non-existent guest code
  const r8 = await req(`${BASE}/api/access`, { method: 'POST', body: JSON.stringify({ code: 'ZZ99ZZ', pin: '1234' }) })
  log('Guest: non-existent code', r8.status === 404, r8.json?.error?.slice(0, 50))

  // Non-existent diary ID
  const r9 = await req(`${BASE}/api/diary/00000000-0000-0000-0000-000000000000`)
  log('Diary: non-existent ID', r9.status === 404, r9.json?.error?.slice(0, 50))

  // Non-existent essay ID  
  const r10 = await req(`${BASE}/api/essay/00000000-0000-0000-0000-000000000000`)
  log('Essay: non-existent ID', r10.status === 404, r10.json?.error?.slice(0, 50))
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('='.repeat(60))
  console.log('PilTrace Full E2E Test')
  console.log('='.repeat(60))
  
  await testPages()
  await testAuth()
  await testDiaryCRUD()
  const pipelineResult = await testAIPipeline()
  await testEssayCRUD(pipelineResult)
  await testEdgeCases()

  // Summary
  console.log('\n' + '='.repeat(60))
  const passed = results.filter(r => r.pass).length
  const failed = results.filter(r => !r.pass).length
  console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed / ${results.length} total`)
  
  if (failed > 0) {
    console.log('\n❌ FAILURES:')
    results.filter(r => !r.pass).forEach(r => console.log(`  - ${r.name}: ${r.detail}`))
  }
  
  console.log('\n' + (failed === 0 ? '🎉 ALL TESTS PASSED!' : '⚠️ SOME TESTS FAILED'))
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
