export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          Ready for MVP
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          빠르게 화면 구현을 시작할 수 있는 프론트엔드 기본 환경
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-600">
          Vite, React, TypeScript, react-router-dom, Tailwind CSS를 기반으로 초기 세팅을 마친
          상태입니다. 다음 단계로 온보딩, 회원가입, 로그인 화면 구현을 바로 이어갈 수 있습니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Routing</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            `react-router-dom` 기반 기본 라우팅과 레이아웃 구성이 준비되어 있습니다.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Styling</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tailwind CSS와 전역 스타일 파일을 연결해 화면 작업을 빠르게 시작할 수 있습니다.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">DX</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            ESLint, Prettier, alias, env 예시 파일까지 포함해 팀 협업 기준을 맞췄습니다.
          </p>
        </article>
      </div>
    </section>
  );
}
