import type { MyPageSummary } from '@/api';
import { AppHeader } from '@/components/ui/AppHeader';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { MyPageInterestGuideCard } from '@/features/mypage/components/guide/MyPageInterestGuideCard';
import { MyPageMenuList } from '@/features/mypage/components/menu/MyPageMenuList';
import { MyPageInfoTags } from '@/features/mypage/components/profile/MyPageInfoTags';
import { MyPageProfileSummary } from '@/features/mypage/components/profile/MyPageProfileSummary';
import { MyPageSummaryCards } from '@/features/mypage/components/summary/MyPageSummaryCards';

type MyPageViewProps = {
  onCloseInterestGuide: () => void;
  onEditProfile: () => void;
  shouldOffsetSummary: boolean;
  shouldShowErrorMessage: boolean;
  shouldShowInterestGuide: boolean;
  shouldShowLoadingMessage: boolean;
  summary: MyPageSummary;
};

export function MyPageView({
  onCloseInterestGuide,
  onEditProfile,
  shouldOffsetSummary,
  shouldShowErrorMessage,
  shouldShowInterestGuide,
  shouldShowLoadingMessage,
  summary,
}: MyPageViewProps) {
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

          {shouldShowLoadingMessage ? (
            <div className="mb-4 rounded-xl bg-[#F6F7F9] px-4 py-3 text-[14px] font-medium leading-[1.4] text-[#565656]">
              마이페이지 정보를 불러오는 중이에요.
            </div>
          ) : null}

          {shouldShowErrorMessage ? (
            <div className="mb-4 rounded-xl bg-[#FFF4F2] px-4 py-3 text-[14px] font-medium leading-[1.4] text-[#FF5E47]">
              마이페이지 정보를 불러오지 못했어요.
            </div>
          ) : null}

          {shouldShowInterestGuide ? (
            <div>
              <MyPageInterestGuideCard onClose={onCloseInterestGuide} />
            </div>
          ) : null}

          <div className={shouldOffsetSummary ? 'mt-6' : ''}>
            <MyPageSummaryCards
              remindCount={summary.remindCount}
              scrapCount={summary.scrapCount}
            />
          </div>

          <div className="mt-4">
            <MyPageProfileSummary
              email={summary.email}
              name={summary.name}
              onEdit={onEditProfile}
            />
          </div>

          <div className="mt-6">
            <MyPageInfoTags
              admissionYear={summary.admissionYear}
              campus={summary.campus}
              departments={summary.departments}
              nickname={summary.nickname}
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
