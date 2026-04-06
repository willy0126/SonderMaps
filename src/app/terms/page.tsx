export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-neutral-950 px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          이용약관
        </h1>
        <p className="mt-2 text-sm text-white/40">최종 수정일: 2026년 3월 4일</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-white/60">
          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              제1조 (목적)
            </h2>
            <p>
              이 약관은 SonderMaps(이하 &ldquo;서비스&rdquo;)가 제공하는 지도 기반
              스토리텔링 플랫폼의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및
              책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              제2조 (정의)
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                &ldquo;서비스&rdquo;란 SonderMaps가 제공하는 위치 기반 익명
                스토리텔링 플랫폼 및 관련 제반 서비스를 의미합니다.
              </li>
              <li>
                &ldquo;이용자&rdquo;란 이 약관에 따라 서비스를 이용하는 모든 사람을
                의미합니다.
              </li>
              <li>
                &ldquo;콘텐츠&rdquo;란 이용자가 서비스에 게시하는 텍스트, 이미지 등
                모든 형태의 정보를 의미합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              제3조 (약관의 효력 및 변경)
            </h2>
            <p>
              본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게
              공지함으로써 효력이 발생합니다. 서비스는 관련 법령을 위배하지 않는
              범위에서 본 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경사유를
              명시하여 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              제4조 (서비스의 제공 및 변경)
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>위치 기반 익명 스토리 작성 및 열람</li>
              <li>감정 기반 스토리 필터링 및 탐색</li>
              <li>지도 기반 스토리 시각화</li>
              <li>기타 서비스가 정하는 부가 서비스</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              제5조 (이용자의 의무)
            </h2>
            <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>타인의 개인정보를 침해하는 콘텐츠 게시</li>
              <li>허위 정보 또는 악의적인 콘텐츠 게시</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>기타 관련 법령에 위반되는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              제6조 (콘텐츠의 관리)
            </h2>
            <p>
              서비스는 이용자가 게시한 콘텐츠가 관련 법령 또는 본 약관에 위반된다고
              판단되는 경우, 사전 통지 없이 해당 콘텐츠를 삭제하거나 게시를 제한할 수
              있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-medium text-white/80">
              제7조 (면책)
            </h2>
            <p>
              서비스는 천재지변, 불가항력, 또는 이에 준하는 사유로 서비스를 제공할 수
              없는 경우에는 서비스 제공에 관한 책임이 면제됩니다. 이용자가 게시한
              콘텐츠에 대한 책임은 해당 이용자에게 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
