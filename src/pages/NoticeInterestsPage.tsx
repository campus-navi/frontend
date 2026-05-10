import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';

export default function NoticeInterestsPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="맞춤 공지 설정" onBack={() => navigate('/home')} />

        <section className="flex flex-1 flex-col px-5 py-8">
          <h1 className="text-[24px] font-bold leading-[1.4] tracking-normal text-[#303030]">
            맞춤 공지 설정
          </h1>
          <p className="mt-3 text-[15px] font-medium leading-[1.5] tracking-normal text-[#8E8E8E]">
            키워드 선택 화면은 준비 중입니다.
          </p>
        </section>

        <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3">
          <CtaButton type="button" variant="primary" state="default" size="xlg" onClick={() => navigate('/home')}>
            홈으로 돌아가기
          </CtaButton>
        </div>
      </div>
    </main>
  );
}
