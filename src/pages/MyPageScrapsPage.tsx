import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';

export default function MyPageScrapsPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[max(32px,env(safe-area-inset-bottom))]">
        <AppHeader title="스크랩 설정" onBack={() => navigate('/mypage', { replace: true })} />

        <section className="flex flex-1 flex-col px-4 pb-10 pt-6">
          <h1 className="text-[24px] font-bold leading-[1.4] tracking-normal text-[#202020]">
            스크랩 관리
          </h1>

          <div className="mt-8 flex flex-col gap-6">
            <section aria-labelledby="recent-scraps-title">
              <h2
                id="recent-scraps-title"
                className="text-[18px] font-semibold leading-[1.4] tracking-normal text-[#292B2C]"
              >
                최근 스크랩
              </h2>
              <div className="mt-3 rounded-xl bg-[#F6F7F9] px-4 py-6 text-[14px] font-medium leading-[1.4] text-[#8E969D]">
                최근 스크랩 목록 영역
              </div>
            </section>

            <section aria-labelledby="scrap-folders-title">
              <h2
                id="scrap-folders-title"
                className="text-[18px] font-semibold leading-[1.4] tracking-normal text-[#292B2C]"
              >
                스크랩 폴더
              </h2>
              <div className="mt-3 rounded-xl bg-[#F6F7F9] px-4 py-6 text-[14px] font-medium leading-[1.4] text-[#8E969D]">
                스크랩 폴더 목록 영역
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
