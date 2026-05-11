import { AppHeader } from '@/components/ui/AppHeader';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { RadioChip } from '@/components/ui/RadioChip';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Tags } from '@/components/ui/Tags';

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

export default function HomePage() {
  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[86px]">
        <AppHeader
          variant="main"
          rightSlot={<NotificationButton hasNewNotification={HAS_NEW_NOTIFICATION} />}
          className="fixed left-1/2 top-0 z-40 w-full max-w-[393px] -translate-x-1/2 bg-white"
        />
        <div className="h-[60px] shrink-0" aria-hidden="true" />

        <section className="flex flex-col gap-5 bg-white px-4 py-4">
          <SectionTitle suffix="주요 공지" />

          <div className="flex items-center gap-2" role="tablist" aria-label="공지 유형">
            <RadioChip selected size="md" role="tab" aria-selected="true">
              신규
            </RadioChip>
            <RadioChip size="md" role="tab" aria-selected="false">
              추천
            </RadioChip>
          </div>

          <FeaturedNoticeCard />
          <ProgressDots total={10} activeIndex={0} />
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
            <SectionTitle suffix="머시기 글" />
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
    </main>
  );
}

function SectionTitle({ suffix }: { suffix: string }) {
  return (
    <h1 className="flex items-center gap-1 text-[20px] font-bold leading-[1.2] tracking-[-0.02em] text-[#333333]">
      <span>{TEMP_NICKNAME}님을 위한</span>
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

function FeaturedNoticeCard() {
  return (
    <article className="relative flex h-[481px] overflow-hidden rounded-2xl bg-[#D6D8CF] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_70%,#8BB178_0_22%,transparent_23%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(51,51,51,0.82)_100%)]" />
      <div className="absolute left-6 right-6 top-9 flex flex-col items-center text-center text-[#18245A]">
        <p className="text-[22px] font-medium leading-none">2025 크림슨 SW아카데미</p>
        <p className="mt-2 text-[44px] font-black leading-none tracking-[-0.03em] text-black">AI Driven</p>
        <p className="mt-3 text-[26px] font-black leading-tight text-black">창업 캠프(w. aws)</p>
      </div>
      <div className="relative z-10 mt-auto flex w-full flex-col gap-3">
        <Tags size="lg" type="tertiary" className="h-8">
          수강
        </Tags>
        <div className="flex flex-col gap-1">
          <h2 className="line-clamp-2 text-[20px] font-semibold leading-[1.4] text-white">
            2026-1 프로젝트학기제 및 지역사회연계 프로젝트 신청 안내 (2/25 마감)
          </h2>
          <p className="line-clamp-2 text-[14px] font-normal leading-[1.4] text-[#DCDFE2]">
            3학년 2학기 이상 재학생 대상, 2월 25일 13시까지 이메일 접수. 성과 발표 우수팀 상장 및
            장학금 지급, 상세 양식 첨부
          </p>
        </div>
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center rounded-[10px] bg-[#292B2C] px-4 text-[16px] font-medium leading-none tracking-[0.015em] text-white"
        >
          공지 자세히 보기
        </button>
      </div>
    </article>
  );
}

function ProgressDots({ total, activeIndex }: { total: number; activeIndex: number }) {
  return (
    <div className="flex h-4 items-center justify-center gap-1" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={
            index === activeIndex
              ? 'h-1 w-4 rounded-full bg-[#292B2C]'
              : 'h-1 w-1 rounded-full border border-[rgba(41,43,44,0.4)] bg-[rgba(41,43,44,0.1)]'
          }
        />
      ))}
    </div>
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
