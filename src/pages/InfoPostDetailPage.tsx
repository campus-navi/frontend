import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { isApiError } from '@/api';
import { AppHeader } from '@/components/ui/AppHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OfficialPostAttachments } from '@/features/official-posts/components/OfficialPostAttachments';
import { OfficialPostBottomFloating } from '@/features/official-posts/components/OfficialPostBottomFloating';
import { OfficialPostContent } from '@/features/official-posts/components/OfficialPostContent';
import { OfficialPostDepartmentInfo } from '@/features/official-posts/components/OfficialPostDepartmentInfo';
import { OfficialPostDetails } from '@/features/official-posts/components/OfficialPostDetails';
import { OfficialPostEligibilityBottomSheet } from '@/features/official-posts/components/OfficialPostEligibilityBottomSheet';
import { OfficialPostHeroImage } from '@/features/official-posts/components/OfficialPostHeroImage';
import { OfficialPostImageViewer } from '@/features/official-posts/components/OfficialPostImageViewer';
import { OfficialPostSummaryAI } from '@/features/official-posts/components/OfficialPostSummaryAI';
import { OfficialPostTabs, type OfficialPostTab } from '@/features/official-posts/components/OfficialPostTabs';
import { OfficialPostTitleSection } from '@/features/official-posts/components/OfficialPostTitleSection';
import { useOfficialPostDetail } from '@/features/official-posts/hooks/useOfficialPostDetail';
import {
  shouldShowOfficialPostBottomFloating,
  shouldShowOfficialPostDetailsInfo,
} from '@/features/official-posts/utils/officialPostApplication';

const LNB_OVERLAY_HEIGHT = 84;

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
  const heroImageRef = useRef<HTMLDivElement | null>(null);
  const [heroImageHeight, setHeroImageHeight] = useState<number | null>(null);
  const [isLnbSolid, setIsLnbSolid] = useState(false);
  const [activeTab, setActiveTab] = useState<OfficialPostTab>('notice');
  const [viewerInitialIndex, setViewerInitialIndex] = useState<number | null>(null);
  const [isEligibilityBottomSheetOpen, setIsEligibilityBottomSheetOpen] = useState(false);
  const errorMessage = getDetailErrorMessage(error, postId);
  const shouldShowBottomFloating = post
    ? shouldShowOfficialPostBottomFloating({
        endDate: post.endDate,
        requiredDocuments: post.requiredDocuments,
      })
    : false;
  const shouldShowDetailsInfo = post
    ? shouldShowOfficialPostDetailsInfo({
        eligibility: post.eligibility,
        endDate: post.endDate,
        endTime: post.endTime,
        requiredDocuments: post.requiredDocuments,
        startDate: post.startDate,
        startTime: post.startTime,
      })
    : false;
  const lnbSolidScrollY =
    heroImageHeight === null ? Number.POSITIVE_INFINITY : Math.max(heroImageHeight - LNB_OVERLAY_HEIGHT, 0);

  useEffect(() => {
    if (!post) {
      setHeroImageHeight(null);
      return;
    }

    const heroImageElement = heroImageRef.current;

    if (!heroImageElement) {
      return;
    }

    const updateHeroImageHeight = () => {
      setHeroImageHeight(heroImageElement.getBoundingClientRect().height);
    };

    updateHeroImageHeight();

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateHeroImageHeight);
    resizeObserver?.observe(heroImageElement);
    window.addEventListener('resize', updateHeroImageHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateHeroImageHeight);
    };
  }, [post]);

  useEffect(() => {
    const updateLnbState = () => {
      setIsLnbSolid(getCurrentPageScrollY() >= lnbSolidScrollY);
    };

    updateLnbState();
    window.addEventListener('scroll', updateLnbState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateLnbState);
    };
  }, [lnbSolidScrollY]);

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
            <div ref={heroImageRef}>
              <OfficialPostHeroImage
                imageUrls={post.imageUrls}
                title={post.title}
                onImageClick={setViewerInitialIndex}
              />
            </div>

            <article className={['flex flex-col bg-white', shouldShowBottomFloating ? 'pb-[112px]' : ''].filter(Boolean).join(' ')}>
              <OfficialPostTitleSection post={post} />
              {shouldShowDetailsInfo ? (
                <OfficialPostDetails post={post} onEligibilityClick={() => setIsEligibilityBottomSheetOpen(true)} />
              ) : null}
              <OfficialPostAttachments
                attachments={post.attachments}
                hasUnreadAttachments={post.hasUnreadAttachments}
                postId={post.postId}
              />
              <OfficialPostTabs activeTab={activeTab} onTabChange={setActiveTab} />
              {activeTab === 'notice' ? (
                <>
                  <OfficialPostSummaryAI summary={post.summary} />
                  <OfficialPostContent post={post} />
                </>
              ) : (
                <OfficialPostDepartmentInfo post={post} />
              )}
            </article>

            <OfficialPostBottomFloating
              applyMethodDetail={post.applyMethodDetail}
              applyMethodType={post.applyMethodType}
              endDate={post.endDate}
              endTime={post.endTime}
              isApplicable={post.isApplicable}
              isScrapped={post.isScrapped}
              requiredDocuments={post.requiredDocuments}
              startDate={post.startDate}
              startTime={post.startTime}
            />

            {viewerInitialIndex !== null ? (
              <OfficialPostImageViewer
                imageUrls={post.imageUrls}
                initialIndex={viewerInitialIndex}
                title={post.title}
                onClose={() => setViewerInitialIndex(null)}
              />
            ) : null}

            <OfficialPostEligibilityBottomSheet
              eligibility={post.eligibility}
              isOpen={isEligibilityBottomSheetOpen}
              onClose={() => setIsEligibilityBottomSheetOpen(false)}
            />
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

function getCurrentPageScrollY() {
  if (document.body.style.position === 'fixed') {
    const lockedScrollY = Number.parseFloat(document.body.style.top);

    if (Number.isFinite(lockedScrollY)) {
      return Math.abs(lockedScrollY);
    }
  }

  return window.scrollY;
}
