export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-neutral-950 px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          개인정보처리방침
        </h1>
        <p className="mt-2 text-sm text-white/40">최종 수정일: 2026년 3월 4일</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-white/60">
          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              1. 수집하는 개인정보 항목
            </h2>
            <p>서비스는 회원가입 및 서비스 이용을 위해 다음 정보를 수집합니다:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong className="text-white/70">필수 항목:</strong> 이메일 주소,
                비밀번호(암호화 저장)
              </li>
              <li>
                <strong className="text-white/70">자동 수집 항목:</strong> 위치 정보
                (사용자 동의 시), 서비스 이용 기록, 접속 로그
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              2. 개인정보의 수집 및 이용 목적
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>회원 식별 및 인증</li>
              <li>위치 기반 스토리 서비스 제공</li>
              <li>서비스 개선 및 통계 분석</li>
              <li>부정 이용 방지 및 서비스 안정성 확보</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              3. 위치 정보의 처리
            </h2>
            <p>
              SonderMaps는 위치 기반 서비스를 제공하기 위해 이용자의 위치 정보를
              수집합니다. 위치 정보는 스토리 게시 시점에만 수집되며, 이용자의 실시간
              위치를 지속적으로 추적하지 않습니다. 이용자는 브라우저 설정을 통해
              언제든지 위치 정보 제공을 거부할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              4. 개인정보의 보유 및 이용 기간
            </h2>
            <p>
              이용자의 개인정보는 서비스 이용 기간 동안 보유하며, 회원 탈퇴 시 지체
              없이 파기합니다. 다만, 관련 법령에 따라 보존이 필요한 경우 해당 기간
              동안 보관합니다.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
              <li>접속 로그: 3개월</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              5. 개인정보의 제3자 제공
            </h2>
            <p>
              서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
              다만, 법령에 의한 요청이 있는 경우에는 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              6. 개인정보의 안전성 확보 조치
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>비밀번호 암호화 저장 (Supabase Auth)</li>
              <li>SSL/TLS 암호화 통신</li>
              <li>데이터베이스 접근 제어 (Row Level Security)</li>
              <li>정기적 보안 점검</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              7. 이용자의 권리
            </h2>
            <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>개인정보 열람 요구</li>
              <li>개인정보 수정 요구</li>
              <li>개인정보 삭제 요구</li>
              <li>개인정보 처리 정지 요구</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              8. 문의
            </h2>
            <p>
              개인정보 처리에 관한 문의는 서비스 내 문의 기능 또는 아래 연락처를 통해
              접수할 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
