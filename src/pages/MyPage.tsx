import { useState } from 'react';

import { AppHeader } from '@/components/ui/AppHeader';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { MyPageInfoTags } from '@/features/mypage/components/MyPageInfoTags';
import { MyPageInterestGuideCard } from '@/features/mypage/components/MyPageInterestGuideCard';
import { MyPageMenuList } from '@/features/mypage/components/MyPageMenuList';
import { MyPageProfileSummary } from '@/features/mypage/components/MyPageProfileSummary';
import { MyPageSummaryCards } from '@/features/mypage/components/MyPageSummaryCards';
import { useMyPageSummary } from '@/features/mypage/hooks/useMyPageSummary';

const fallbackMyPageSummary = {
  admissionYear: 0,
  campus: '',
  departments: [],
  nickname: '캠퍼스네비',
  email: 'campusnavi@example.com',
  grade: 0,
  interestCount: 0,
  remindCount: 0,
  scrapCount: 0,
};

export default function MyPage() {
  const [isInterestGuideVisible, setIsInterestGuideVisible] = useState(true);
  const { data: myPageSummary, isError, isLoading } = useMyPageSummary();
  const summary = myPageSummary ?? fallbackMyPageSummary;
  const shouldShowInterestGuide = myPageSummary?.interestCount === 0 && isInterestGuideVisible;

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

          {isLoading ? (
            <div className="mb-4 rounded-xl bg-[#F6F7F9] px-4 py-3 text-[14px] font-medium leading-[1.4] text-[#565656]">
              마이페이지 정보를 불러오는 중이에요.
            </div>
          ) : null}

          {isError ? (
            <div className="mb-4 rounded-xl bg-[#FFF4F2] px-4 py-3 text-[14px] font-medium leading-[1.4] text-[#FF5E47]">
              마이페이지 정보를 불러오지 못했어요.
            </div>
          ) : null}

          {shouldShowInterestGuide ? (
            <div>
              <MyPageInterestGuideCard onClose={() => setIsInterestGuideVisible(false)} />
            </div>
          ) : null}

          <div className={shouldShowInterestGuide || isLoading || isError ? 'mt-6' : ''}>
            <MyPageSummaryCards
              remindCount={summary.remindCount}
              scrapCount={summary.scrapCount}
            />
          </div>

          <div className="mt-4">
            <MyPageProfileSummary
              nickname={summary.nickname}
              email={summary.email}
            />
          </div>

          <div className="mt-6">
            <MyPageInfoTags
              admissionYear={summary.admissionYear}
              campus={summary.campus}
              departments={summary.departments}
              grade={summary.grade}
            />
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
