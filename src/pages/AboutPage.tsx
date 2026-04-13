export default function AboutPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">프로젝트 구성</h1>
        <p className="text-slate-600">이후 기능 개발을 위한 최소한의 구조만 남기고 정리했습니다.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ul className="space-y-3 text-sm leading-6 text-slate-700">
          <li>
            <strong className="font-semibold text-slate-950">src/pages</strong>: 화면 단위 페이지
          </li>
          <li>
            <strong className="font-semibold text-slate-950">src/components</strong>: 공통 UI 및 레이아웃
          </li>
          <li>
            <strong className="font-semibold text-slate-950">src/assets</strong>: 이미지, 아이콘 등 정적 자산
          </li>
          <li>
            <strong className="font-semibold text-slate-950">src/styles</strong>: 전역 스타일
          </li>
          <li>
            <strong className="font-semibold text-slate-950">.env.example</strong>: 환경 변수 구조 예시
          </li>
        </ul>
      </div>
    </section>
  );
}
