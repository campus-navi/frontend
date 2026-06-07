import { useState } from 'react';

import { AppHeader } from '@/components/ui/AppHeader';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { MyPageInfoTags } from '@/features/mypage/components/MyPageInfoTags';
import { MyPageInterestGuideCard } from '@/features/mypage/components/MyPageInterestGuideCard';
import { MyPageMenuList } from '@/features/mypage/components/MyPageMenuList';
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
        <AppHeader
          variant="main"
          className="fixed left-1/2 top-0 z-40 w-full max-w-[393px] -translate-x-1/2 bg-white"
        />
        <div className="h-[calc(60px+max(20px,env(safe-area-inset-top)))] shrink-0" aria-hidden="true" />

        <section className="flex flex-1 flex-col px-4 pb-10 pt-4">
          <h1 className="sr-only">마이페이지</h1>

          {isInterestGuideVisible ? (
            <div>
              <MyPageInterestGuideCard onClose={() => setIsInterestGuideVisible(false)} />
            </div>
          ) : null}

          <div className={isInterestGuideVisible ? 'mt-6' : ''}>
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

          <div className="mt-6">
            <MyPageMenuList />
          </div>
        </section>
      </div>

      <MobileGnb activeItem="my" />
    </main>
  );
}
