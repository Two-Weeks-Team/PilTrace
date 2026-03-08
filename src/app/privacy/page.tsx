import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '개인정보처리방침 | PilTrace',
  description: 'PilTrace 개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[var(--cream)] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-md border border-[var(--border-light)] p-8 md:p-12 relative">
          {/* 마스킹테이프 장식 */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-sm opacity-70"
            style={{ backgroundColor: 'var(--sage-green)' }}
          />

          {/* 헤더 */}
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm text-[var(--sage-green-dark)] hover:underline mb-4 inline-block"
            >
              ← 메인으로 돌아가기
            </Link>
            <h1 className="text-2xl font-bold text-[var(--star-brown)]">
              개인정보처리방침
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              시행일: 2026년 3월 1일
            </p>
          </div>

          {/* 본문 */}
          <div className="prose-sm space-y-6 text-[var(--text-secondary)] leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                1. 수집하는 개인정보 항목
              </h2>
              <p>
                PilTrace(이하 &quot;서비스&quot;)는 회원가입 및 서비스 이용을 위해
                다음과 같은 개인정보를 수집합니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>필수 항목:</strong> 이메일 주소, 비밀번호, 닉네임
                </li>
                <li>
                  <strong>자동 수집 항목:</strong> 서비스 이용 기록, 접속 일시
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                2. 개인정보의 수집 및 이용 목적
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>회원 식별 및 서비스 이용 관리</li>
                <li>AI 에세이 생성 서비스 제공</li>
                <li>서비스 개선 및 신규 기능 개발</li>
                <li>고객 문의 및 불만 처리</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                3. AI 처리에 관한 사항
              </h2>
              <p>
                서비스는 사용자가 작성한 일기 내용을 AI(OpenAI GPT 시리즈)를
                통해 에세이로 변환합니다. 이 과정에서:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>일기 내용은 에세이 생성 목적으로만 AI에 전송됩니다.</li>
                <li>AI 처리는 실시간으로 이루어지며, 별도의 학습 데이터로 사용되지 않습니다.</li>
                <li>생성된 에세이는 사용자의 계정에 안전하게 저장됩니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                4. 개인정보의 보유 및 이용 기간
              </h2>
              <p>
                회원 탈퇴 시 즉시 파기합니다. 단, 관련 법령에 따라 일정 기간
                보관이 필요한 경우 해당 기간 동안 보관합니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>전자상거래 관련 기록: 5년 (전자상거래법)</li>
                <li>접속 기록: 3개월 (통신비밀보호법)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                5. 개인정보의 제3자 제공
              </h2>
              <p>
                서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지
                않습니다. 단, AI 에세이 생성을 위해 다음의 경우 일기 내용이
                외부 서비스로 전송됩니다.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>OpenAI:</strong> 에세이 생성을 위한 AI 처리
                  (일기 본문만 전송, 이메일/닉네임 등 개인식별정보 미포함)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                6. 이용자의 권리
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>언제든 회원 탈퇴를 통해 개인정보 삭제를 요청할 수 있습니다.</li>
                <li>작성한 일기 및 에세이의 열람, 수정, 삭제가 가능합니다.</li>
                <li>개인정보 처리에 대한 동의를 철회할 수 있습니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                7. 개인정보의 안전성 확보 조치
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>비밀번호 암호화 저장 (Supabase Auth)</li>
                <li>SSL/TLS 암호화 통신</li>
                <li>접근 권한 관리 및 제한</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                8. 쿠키의 사용
              </h2>
              <p>
                서비스는 인증 세션 유지를 위해 쿠키를 사용합니다. 브라우저
                설정에서 쿠키를 거부할 수 있으나, 이 경우 서비스 이용에
                제한이 있을 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                9. 개인정보 보호책임자
              </h2>
              <p>
                개인정보 관련 문의사항은 아래로 연락해주세요.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>담당:</strong> PilTrace 개인정보 보호팀
                </li>
                <li>
                  <strong>이메일:</strong> privacy@piltrace.com
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                10. 방침 변경에 관한 사항
              </h2>
              <p>
                이 개인정보처리방침은 2026년 3월 1일부터 적용되며, 변경 사항이
                있을 경우 서비스 내 공지를 통해 안내드립니다.
              </p>
            </section>
          </div>
        </div>

        {/* 하단 장식 */}
        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          ✦ PilTrace · 개인정보를 소중히 다룹니다 ✦
        </p>
      </div>
    </div>
  )
}
