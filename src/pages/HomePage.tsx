import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CtaButton } from '@/components/ui/CtaButton';
import { AppHeader } from '@/components/ui/AppHeader';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { Modal } from '@/components/ui/Modal';
import { RadioChip } from '@/components/ui/RadioChip';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Tags } from '@/components/ui/Tags';
import { FeaturedNoticeContent } from '@/features/home/components/FeaturedNoticeContent';
import { dismissNoticeInterestPrompt, useHasDismissedNoticeInterestPrompt } from '@/features/home/noticeInterestPromptDismissState';
import { useFeedCards } from '@/features/home/hooks/useFeedCards';
import { useMemberMe } from '@/features/home/hooks/useMemberMe';

const TEMP_NICKNAME = '익명';
const HAS_NEW_NOTIFICATION = true;
const deadlineCards = [
  { id: 1, daysLeft: 'D-6', category: '수강', title: '공지글입니다.\n두줄까지 쓸 수 있어요', meta: '04/10 | OO학사팀' },
  { id: 2, daysLeft: 'D-3', category: '장학', title: '성적 장학금 신청 안내', meta: '04/12 | 장학팀' },
];

const communityPosts = [
  {
    id: 1,
    hasImage: false,
    title: '호텔경제학을 여기서 볼 줄이야',
    body: '축제로 학교 분위기는 좋아졌고, 취소돼서 기부하니 이미지도 좋아졌고, 취소돼서 기부기부',
  },
  {
    id: 2,
    hasImage: true,
    title: '호텔경제학을 여기서 볼 줄이야',
    body: '축제로 학교 분위기는 좋아졌고, 취소돼서 기부하니 이미지도 좋아졌고, 취소돼서 기부기부',
  },
  {
    id: 3,
    hasImage: true,
    title: '호텔경제학을 여기서 볼 줄이야',
    body: '축제로 학교 분위기는 좋아졌고, 취소돼서 기부하니 이미지도 좋아졌고, 취소돼서 기부기부',
  },
];

type FeaturedNoticeTab = 'new' | 'recommended';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredNoticeTab, setFeaturedNoticeTab] = useState<FeaturedNoticeTab>('new');
  const { data: feedCards, isError, isLoading } = useFeedCards();
  const { data: memberMe } = useMemberMe();
  const hasDismissedNoticeInterestPrompt = useHasDismissedNoticeInterestPrompt();
  const featuredPosts = featuredNoticeTab === 'new'
    ? feedCards?.newPosts ?? []
    : feedCards?.recommendedPosts ?? [];
  const nickname = memberMe?.nickname ?? TEMP_NICKNAME;
  const isNoticeInterestPromptOpen = memberMe?.hasSetInterests === false && !hasDismissedNoticeInterestPrompt;

  const goToNoticeInterests = () => {
    navigate('/notice-interests');
  };

  const closeNoticeInterestPrompt = () => {
    dismissNoticeInterestPrompt();
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[86px]">
        <AppHeader
          variant="main"
          rightSlot={<NotificationButton hasNewNotification={HAS_NEW_NOTIFICATION} />}
          className="fixed left-1/2 top-0 z-40 w-full max-w-[393px] -translate-x-1/2 bg-white"
        />
        <div className="h-[calc(60px+max(20px,env(safe-area-inset-top)))] shrink-0" aria-hidden="true" />

        <section className="flex flex-col gap-5 bg-white px-4 py-4">
          <SectionTitle nickname={nickname} suffix="주요 공지" />

          <div className="flex items-center gap-2" role="tablist" aria-label="공지 유형">
            <RadioChip
              selected={featuredNoticeTab === 'new'}
              size="md"
              role="tab"
              aria-selected={featuredNoticeTab === 'new'}
              onClick={() => setFeaturedNoticeTab('new')}
            >
              신규
            </RadioChip>
            <RadioChip
              selected={featuredNoticeTab === 'recommended'}
              size="md"
              role="tab"
              aria-selected={featuredNoticeTab === 'recommended'}
              onClick={() => setFeaturedNoticeTab('recommended')}
            >
              추천
            </RadioChip>
          </div>

          <FeaturedNoticeContent
            isError={isError}
            isLoading={isLoading}
            posts={featuredPosts}
          />
        </section>

        <section className="flex flex-col gap-4 bg-white py-5">
          <SectionHeader keyword="마감임박" suffix="공지" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {deadlineCards.map((card) => (
              <DeadlineCard key={card.id} {...card} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5 bg-white px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <SectionTitle nickname={nickname} suffix="머시기 글" />
            <SeeAllButton />
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
              <CommunityPost key={post.id} {...post} />
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
            <CtaButton type="button" variant="primary" state="default" size="xlg" onClick={goToNoticeInterests}>
              맞춤 공지 설정하기
            </CtaButton>
            <CtaButton type="button" variant="tertiary" state="default" size="xlg" onClick={closeNoticeInterestPrompt}>
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

function SectionTitle({ nickname, suffix }: { nickname: string; suffix: string }) {
  return (
    <h1 className="flex items-center gap-1 text-[20px] font-bold leading-[1.2] tracking-[-0.02em] text-[#333333]">
      <span>{nickname}님을 위한</span>
      <span className="text-[#939393]">{suffix}</span>
    </h1>
  );
}

function SectionHeader({ keyword, suffix }: { keyword: string; suffix: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4">
      <h2 className="flex items-center gap-1 text-[20px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A1A]">
        <span>{keyword}</span>
        <span className="text-[#939393]">{suffix}</span>
      </h2>
      <SeeAllButton />
    </div>
  );
}

function SeeAllButton() {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-1 text-[14px] font-normal leading-[1.2] tracking-[-0.02em] text-[#9D9D9D]"
    >
      모두보기
      <SvgIcon size={8} viewBox="0 0 8 8">
        <path d="m3 1.5 2.5 2.5L3 6.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
      </SvgIcon>
    </button>
  );
}

function DeadlineCard({
  daysLeft,
  category,
  title,
  meta,
}: {
  daysLeft: string;
  category: string;
  title: string;
  meta: string;
}) {
  return (
    <article className="flex h-[140px] w-[316px] shrink-0 flex-col gap-3 rounded-2xl bg-[#FAFAFC] p-4">
      <div className="flex items-center gap-1.5">
        <Tags size="lg" type="primary">
          {daysLeft}
        </Tags>
        <span className="inline-flex h-8 items-center justify-center rounded-lg border border-[#DCDFE2] px-2.5 text-[14px] font-medium leading-[1.4] text-[#292B2C]">
          {category}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="whitespace-pre-line text-[16px] font-semibold leading-[1.4] tracking-[0.01em] text-[#333333]">
          {title}
        </h3>
        <p className="text-[14px] font-normal leading-[1.4] text-[#9E9E9E]">{meta}</p>
      </div>
    </article>
  );
}

function CommunityPost({
  hasImage,
  title,
  body,
}: {
  hasImage: boolean;
  title: string;
  body: string;
}) {
  return (
    <article className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FAFAFC] text-[#BFC4C8]">
            <SvgIcon size={16} viewBox="0 0 16 16">
              <path
                d="M8 8.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM3.2 13.3a4.8 4.8 0 0 1 9.6 0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1"
              />
            </SvgIcon>
          </span>
          <span className="text-[14px] font-medium leading-[1.4] text-[#565656]">익명</span>
          <span className="text-[14px] font-semibold leading-[1.4] tracking-[0.015em] text-[#0BC798]">N%가 본 글이에요</span>
        </div>
        <button type="button" className="flex h-4 w-4 shrink-0 items-center justify-center text-[#292B2C]" aria-label="더보기">
          <MoreIcon />
        </button>
      </div>

      <div className="flex gap-3 pl-5">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-semibold leading-[1.4] tracking-[0.01em] text-[#292B2C]">{title}</h3>
          <p className="mt-1 line-clamp-2 text-[14px] font-normal leading-[1.4] text-[#565656]">{body}</p>
          <p className="mt-1 text-[12px] font-normal leading-[1.4] text-[#BFC4C8]">1일전</p>
        </div>
        {hasImage ? <div className="h-[72px] w-[72px] shrink-0 rounded-lg bg-[#FFD36E]" aria-hidden="true" /> : null}
      </div>
    </article>
  );
}

function NotificationButton({ hasNewNotification }: { hasNewNotification: boolean }) {
  return (
    <button
      type="button"
      className="relative flex h-7 w-7 items-center justify-center text-[#BFC4C8]"
      aria-label="알림"
    >
      <SvgIcon size={28} viewBox="0 0 28 28">
        <path
          d="M21 12.4a7 7 0 0 0-14 0v3.4l-1.6 2.8a1.1 1.1 0 0 0 1 1.7h15.2a1.1 1.1 0 0 0 1-1.7L21 15.8v-3.4ZM11.2 22.3a3 3 0 0 0 5.6 0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.16667"
        />
      </SvgIcon>
      {hasNewNotification ? (
        <span className="absolute right-[5px] top-0.5 h-[7px] w-[7px] rounded-full bg-[#FF5E47]" aria-hidden="true" />
      ) : null}
    </button>
  );
}

function MoreIcon() {
  return (
    <SvgIcon size={16} viewBox="0 0 16 16">
      <path
        d="M8 3.3v.01M8 8v.01M8 12.7v.01"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </SvgIcon>
  );
}
