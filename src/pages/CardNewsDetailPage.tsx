import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { SvgIcon } from '@/components/ui/SvgIcon';
import {
  CardNewsCarousel,
  type CardNewsItem,
} from '@/features/card-news/components/CardNewsCarousel';

const FALLBACK_CARD_IMAGE_URL = '/images/notice-interest-prompt.svg';

interface CardNewsRouteState {
  cards?: unknown;
  imageUrl?: unknown;
  postId?: unknown;
  summary?: unknown;
  tagName?: unknown;
  title?: unknown;
}

function parsePostId(value: string | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue || !/^[1-9]\d*$/.test(normalizedValue)) {
    return null;
  }

  const postId = Number(normalizedValue);

  return Number.isInteger(postId) && postId > 0 ? postId : null;
}

function normalizeCardNewsItem(value: unknown): CardNewsItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const item = value as CardNewsRouteState;

  if (
    typeof item.postId !== 'number' ||
    !Number.isInteger(item.postId) ||
    item.postId <= 0 ||
    typeof item.title !== 'string' ||
    typeof item.tagName !== 'string' ||
    typeof item.summary !== 'string'
  ) {
    return null;
  }

  return {
    imageUrl: typeof item.imageUrl === 'string' && item.imageUrl.trim() ? item.imageUrl : FALLBACK_CARD_IMAGE_URL,
    postId: item.postId,
    summary: item.summary,
    tagName: item.tagName,
    title: item.title,
  };
}

function getCardNewsItems(value: unknown, postId: number | null) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const state = value as CardNewsRouteState;
  const cards = Array.isArray(state.cards)
    ? state.cards.map(normalizeCardNewsItem).filter((card): card is CardNewsItem => card !== null)
    : [];
  const fallbackCard = normalizeCardNewsItem(state);
  const cardNewsItems = cards.length > 0 ? cards : fallbackCard ? [fallbackCard] : [];

  if (postId === null || !cardNewsItems.some((card) => card.postId === postId)) {
    return null;
  }

  return cardNewsItems;
}

export default function CardNewsDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId: postIdParam } = useParams();
  const postId = parsePostId(postIdParam);
  const cardNewsItems = getCardNewsItems(location.state, postId);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (postId === null) {
    return (
      <CardNewsMessagePage
        message="올바른 카드뉴스를 찾을 수 없어요."
        onBackClick={handleBackClick}
      />
    );
  }

  if (cardNewsItems === null) {
    return (
      <CardNewsMessagePage
        message="카드뉴스 정보를 불러올 수 없어요. 홈에서 다시 선택해주세요."
        onBackClick={handleBackClick}
        onNoticeDetailClick={() => navigate(`/info/posts/${postId}`)}
      />
    );
  }

  return (
    <CardNewsCarousel
      initialPostId={postId}
      items={cardNewsItems}
      onBackClick={handleBackClick}
      onNoticeDetailClick={(activePostId) => navigate(`/info/posts/${activePostId}`)}
    />
  );
}

function CardNewsMessagePage({
  message,
  onBackClick,
  onNoticeDetailClick,
}: {
  message: string;
  onBackClick: () => void;
  onNoticeDetailClick?: () => void;
}) {
  return (
    <main className="min-h-[100svh] bg-[#1C1C1C]">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-[#1C1C1C] text-white">
        <header className="absolute inset-x-0 top-0 z-30 flex h-[64px] items-center justify-between px-4 text-white">
          <button type="button" className="flex h-10 w-10 items-center justify-start" aria-label="뒤로가기" onClick={onBackClick}>
            <SvgIcon size={24} viewBox="0 0 24 24">
              <path d="m15 5-7 7 7 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </SvgIcon>
          </button>
        </header>
        <section className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
          <p className="text-[16px] font-medium leading-[1.5] text-[#DCDFE2]">
            {message}
          </p>
          {onNoticeDetailClick ? (
            <button
              type="button"
              className="mt-8 flex h-12 items-center justify-center rounded-full bg-[#292B2C] px-6 text-[16px] font-semibold leading-none tracking-[0.015em] text-white"
              onClick={onNoticeDetailClick}
            >
              공지 자세히 보기
            </button>
          ) : null}
        </section>
      </div>
    </main>
  );
}
