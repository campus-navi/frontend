import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { isApiError } from '@/api';
import { AppHeader } from '@/components/ui/AppHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OfficialPostAttachments } from '@/features/official-posts/components/OfficialPostAttachments';
import { OfficialPostBottomFloating } from '@/features/official-posts/components/OfficialPostBottomFloating';
import { OfficialPostContent } from '@/features/official-posts/components/OfficialPostContent';
import { OfficialPostDetails } from '@/features/official-posts/components/OfficialPostDetails';
import { OfficialPostHeroImage } from '@/features/official-posts/components/OfficialPostHeroImage';
import { OfficialPostSummaryAI } from '@/features/official-posts/components/OfficialPostSummaryAI';
import { OfficialPostTabs } from '@/features/official-posts/components/OfficialPostTabs';
import { OfficialPostTitleSection } from '@/features/official-posts/components/OfficialPostTitleSection';
import { useOfficialPostDetail } from '@/features/official-posts/hooks/useOfficialPostDetail';

const DESIGN_LNB_SOLID_Y = 386;
const LNB_OVERLAY_HEIGHT = 84;
const LNB_SOLID_SCROLL_Y = DESIGN_LNB_SOLID_Y - LNB_OVERLAY_HEIGHT;

function parsePostId(value: string | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue || !/^[1-9]\d*$/.test(normalizedValue)) {
    return null;
  }

  const postId = Number(normalizedValue);

  return Number.isInteger(postId) && postId > 0 ? postId : null;
}

export default function InfoPostDetailPage() {
  const navigate = useNavigate();
  const { postId: postIdParam } = useParams();
  const postId = parsePostId(postIdParam);
  const {
    data: post,
    error,
    isError,
    isLoading,
  } = useOfficialPostDetail(postId);
  const [isLnbSolid, setIsLnbSolid] = useState(false);
  const errorMessage = getDetailErrorMessage(error, postId);

  useEffect(() => {
    const updateLnbState = () => {
      setIsLnbSolid(window.scrollY >= LNB_SOLID_SCROLL_Y);
    };

    updateLnbState();
    window.addEventListener('scroll', updateLnbState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateLnbState);
    };
  }, []);

  const headerClassName = [
    'fixed left-1/2 top-0 z-50 w-full max-w-[393px] -translate-x-1/2 transition-colors duration-200',
    isLnbSolid ? 'bg-white shadow-[0_1px_0_rgba(238,240,242,1)]' : 'bg-transparent',
  ].join(' ');

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="relative mx-auto min-h-[100svh] w-full max-w-[393px] bg-white">
        <AppHeader
          className={headerClassName}
          title={isLnbSolid ? '공지사항' : undefined}
          variant="back"
          onBack={() => navigate(-1)}
        />

        {isLoading ? <DetailLoading /> : null}

        {postId === null || isError ? <DetailMessage message={errorMessage} /> : null}

        {!isLoading && post ? (
          <>
            <OfficialPostHeroImage imageUrl={post.imageUrls[0]} title={post.title} />

            <article className="flex flex-col bg-white pb-[112px]">
              <OfficialPostTitleSection post={post} />
              <OfficialPostDetails post={post} />
              <OfficialPostAttachments
                attachments={post.attachments}
                hasUnreadAttachments={post.hasUnreadAttachments}
              />
              <OfficialPostTabs />
              <OfficialPostSummaryAI summary={post.summary} />
              <OfficialPostContent post={post} />
            </article>

            <OfficialPostBottomFloating endDate={post.endDate} isScrapped={post.isScrapped} />
          </>
        ) : null}
      </div>
    </main>
  );
}

function DetailLoading() {
  return (
    <section className="flex min-h-[100svh] items-center justify-center px-5 py-10">
      <LoadingSpinner ariaLabel="공지사항 상세를 불러오는 중" className="h-8 w-8 text-[#292B2C]" />
    </section>
  );
}

function DetailMessage({ message }: { message: string }) {
  return (
    <section className="flex min-h-[100svh] items-center justify-center px-5 py-10 text-center">
      <p className="text-[16px] font-medium leading-[1.5] text-[#565656]">{message}</p>
    </section>
  );
}

function getDetailErrorMessage(error: unknown, postId: number | null) {
  if (postId === null) {
    return '교내정보 글을 찾을 수 없어요.';
  }

  if (isApiError(error) && error.status === 425) {
    return 'AI가 아직 공지 내용을 정리하는 중이에요. 잠시 후 다시 확인해주세요.';
  }

  return '교내정보 글을 불러오지 못했어요.';
}
