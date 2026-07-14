import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { Modal } from '@/components/ui/Modal';
import { RadioChip } from '@/components/ui/RadioChip';
import { DeadlinePreviewSection } from '@/features/deadlines/components/DeadlinePreviewSection';
import { FeaturedNoticeContent } from '@/features/home/components/FeaturedNoticeContent';
import { HomeCommunityPost } from '@/features/home/components/HomeCommunityPost';
import { HomeNotificationButton } from '@/features/home/components/HomeNotificationButton';
import { HomeSectionTitle } from '@/features/home/components/HomeSectionTitle';
import { HomeSeeAllButton } from '@/features/home/components/HomeSeeAllButton';
import type { HomeViewModel } from '@/features/home/types';

const HAS_NEW_NOTIFICATION = true;

export function HomeView({
  communityPosts,
  deadlinePreviewPosts,
  featuredNoticeTab,
  featuredPosts,
  isDeadlinePreviewError,
  isDeadlinePreviewLoading,
  isFeaturedNoticeError,
  isFeaturedNoticeLoading,
  isNoticeInterestPromptOpen,
  nickname,
  onCloseNoticeInterestPrompt,
  onDeadlinePostClick,
  onFeaturedNoticeCardClick,
  onFeaturedNoticeDetailClick,
  onFeaturedNoticeTabChange,
  onNotificationClick,
  onOpenDeadlineList,
  onOpenNoticeInterests,
  shouldShowDeadlinePreviewEmpty,
  shouldShowFeaturedNoticeEmpty,
}: HomeViewModel) {
  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[calc(54px+max(32px,env(safe-area-inset-bottom)))]">
        <AppHeader
          variant="main"
          rightSlot={<HomeNotificationButton hasNewNotification={HAS_NEW_NOTIFICATION} onClick={onNotificationClick} />}
          className="fixed left-1/2 top-0 z-40 w-full max-w-[393px] -translate-x-1/2 bg-white"
        />
        <div className="h-[calc(60px+max(20px,env(safe-area-inset-top)))] shrink-0" aria-hidden="true" />

        <section className="flex flex-col gap-5 bg-white px-4 py-4">
          <HomeSectionTitle nickname={nickname} suffix="주요 공지" />

          <div className="flex items-center gap-2" role="tablist" aria-label="공지 유형">
            <RadioChip
              selected={featuredNoticeTab === 'new'}
              size="md"
              role="tab"
              aria-selected={featuredNoticeTab === 'new'}
              onClick={() => onFeaturedNoticeTabChange('new')}
            >
              신규
            </RadioChip>
            <RadioChip
              selected={featuredNoticeTab === 'recommended'}
              size="md"
              role="tab"
              aria-selected={featuredNoticeTab === 'recommended'}
              onClick={() => onFeaturedNoticeTabChange('recommended')}
            >
              추천
            </RadioChip>
          </div>

          <FeaturedNoticeContent
            isEmpty={shouldShowFeaturedNoticeEmpty}
            isError={isFeaturedNoticeError}
            isLoading={isFeaturedNoticeLoading}
            posts={featuredPosts}
            onCardClick={onFeaturedNoticeCardClick}
            onNoticeDetailClick={onFeaturedNoticeDetailClick}
          />
        </section>

        <DeadlinePreviewSection
          isEmpty={shouldShowDeadlinePreviewEmpty}
          isError={isDeadlinePreviewError}
          isLoading={isDeadlinePreviewLoading}
          posts={deadlinePreviewPosts}
          onPostClick={onDeadlinePostClick}
          onSeeAll={onOpenDeadlineList}
        />

        <section className="flex flex-col gap-5 bg-white px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <HomeSectionTitle nickname={nickname} suffix="머시기 글" />
            <HomeSeeAllButton />
          </div>

          <div className="flex items-center gap-2" role="tablist" aria-label="커뮤니티 글 유형">
            <RadioChip selected role="tab" aria-selected="true">
              전체
            </RadioChip>
            <RadioChip role="tab" aria-selected="false">
              인기
            </RadioChip>
          </div>

          <div className="flex flex-col gap-4">
            {communityPosts.map((post) => (
              <HomeCommunityPost key={post.id} {...post} />
            ))}
          </div>
        </section>
      </div>

      <MobileGnb activeItem="home" />

      <Modal
        isOpen={isNoticeInterestPromptOpen}
        title={<span className="sr-only">어떤 공지를 보여드릴까요?</span>}
        titleId="notice-interest-prompt-title"
        footerLayout="vertical"
        footer={
          <>
            <CtaButton type="button" variant="primary" state="default" size="xlg" onClick={onOpenNoticeInterests}>
              맞춤 공지 설정하기
            </CtaButton>
            <CtaButton type="button" variant="tertiary" state="default" size="xlg" onClick={onCloseNoticeInterestPrompt}>
              다음에 할게요
            </CtaButton>
          </>
        }
      >
        <div className="flex w-full flex-col items-center px-5 pb-5 pt-1">
          <img
            src="/images/notice-interest-prompt.svg"
            alt=""
            className="h-[150px] w-full object-contain"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-center text-[18px] font-semibold leading-[1.4] tracking-normal text-[#292B2C]">
            어떤 공지를 보여드릴까요?
          </h3>
          <p className="mt-3 whitespace-pre-line text-center text-[16px] font-medium leading-[1.5] tracking-normal text-[#5E5E5E]">
            {`${nickname}님을 위한 컨텐츠를 위해\n간단한 설문조사에 참여해주세요.`}
          </p>
        </div>
      </Modal>
    </main>
  );
}
