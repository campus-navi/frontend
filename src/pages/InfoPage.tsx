import { AppHeader } from '@/components/ui/AppHeader';
import { MobileGnb } from '@/components/ui/MobileGnb';

export default function InfoPage() {
  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[86px]">
        <AppHeader title="교내정보" />

        <section className="flex flex-1 flex-col justify-center px-5 py-10 text-center">
          <h1 className="text-[24px] font-bold leading-[1.4] text-[#292B2C]">
            교내정보
          </h1>
          <p className="mt-4 text-[16px] font-medium leading-[1.5] text-[#565656]">
            교내정보 목록은 후속 이슈에서 연동됩니다.
          </p>
        </section>
      </div>

      <MobileGnb activeItem="info" />
    </main>
  );
}
