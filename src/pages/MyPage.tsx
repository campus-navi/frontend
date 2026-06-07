import { useState } from 'react';

import { MobileGnb } from '@/components/ui/MobileGnb';
import { MyPageInfoTags } from '@/features/mypage/components/MyPageInfoTags';
import { MyPageInterestGuideCard } from '@/features/mypage/components/MyPageInterestGuideCard';
import { MyPageProfileSummary } from '@/features/mypage/components/MyPageProfileSummary';
import { MyPageSummaryCards } from '@/features/mypage/components/MyPageSummaryCards';

const profileSummary = {
  nickname: '캠퍼스네비',
  email: 'campusnavi@example.com',
};

export default function MyPage() {
  const [isInterestGuideVisible, setIsInterestGuideVisible] = useState(true);

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[calc(54px+max(32px,env(safe-area-inset-bottom)))]">
        <section className="flex flex-1 flex-col px-4 pt-[calc(40px+max(20px,env(safe-area-inset-top)))]">
          <h1 className="text-[24px] font-bold leading-[1.4] tracking-normal text-[#202020]">
            마이페이지
          </h1>

          {isInterestGuideVisible ? (
            <div className="mt-6">
              <MyPageInterestGuideCard onClose={() => setIsInterestGuideVisible(false)} />
            </div>
          ) : null}

          <div className="mt-6">
            <MyPageSummaryCards />
          </div>

          <div className="mt-4">
            <MyPageProfileSummary
              nickname={profileSummary.nickname}
              email={profileSummary.email}
            />
          </div>

          <div className="mt-6">
            <MyPageInfoTags />
          </div>
        </section>
      </div>

      <MobileGnb activeItem="my" />
    </main>
  );
}
