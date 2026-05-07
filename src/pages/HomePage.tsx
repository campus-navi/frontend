import { AppHeader } from '@/components/ui/AppHeader';

export default function HomePage() {
  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader variant="main" />

        <section className="flex flex-1 flex-col px-5 py-8">
          <h1 className="text-[24px] font-bold leading-[1.4] tracking-normal text-[#303030]">
            홈
          </h1>
          <p className="mt-3 text-[15px] font-medium leading-[1.5] tracking-normal text-[#8E8E8E]">
            로그인 이후 홈 화면 임시 페이지입니다.
          </p>
        </section>
      </div>
    </main>
  );
}
