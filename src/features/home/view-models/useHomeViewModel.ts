import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { FeedCardPost } from '@/api';
import { useDeadlinePreview } from '@/features/deadlines/hooks/useDeadlinePreview';
import { useFeedCards } from '@/features/home/hooks/useFeedCards';
import { useMemberMe } from '@/features/home/hooks/useMemberMe';
import {
  dismissNoticeInterestPrompt,
  useHasDismissedNoticeInterestPrompt,
} from '@/features/home/noticeInterestPromptDismissState';
import type {
  FeaturedNoticeTab,
  HomeCommunityPost,
  HomeViewModel,
} from '@/features/home/types';

const TEMP_NICKNAME = '익명';

const communityPosts: HomeCommunityPost[] = [
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

export function useHomeViewModel(): HomeViewModel {
  const navigate = useNavigate();
  const [featuredNoticeTab, setFeaturedNoticeTab] = useState<FeaturedNoticeTab>('new');
  const {
    data: feedCards,
    isError: isFeaturedNoticeError,
    isLoading: isFeaturedNoticeLoading,
  } = useFeedCards();
  const {
    data: deadlinePreview,
    isError: isDeadlinePreviewError,
    isLoading: isDeadlinePreviewLoading,
  } = useDeadlinePreview();
  const { data: memberMe } = useMemberMe();
  const hasDismissedNoticeInterestPrompt = useHasDismissedNoticeInterestPrompt();
  const featuredPosts =
    featuredNoticeTab === 'new'
      ? feedCards?.newPosts ?? []
      : feedCards?.recommendedPosts ?? [];
  const nickname = memberMe?.nickname ?? TEMP_NICKNAME;
  const isNoticeInterestPromptOpen =
    memberMe?.hasSetInterests === false && !hasDismissedNoticeInterestPrompt;

  const handleOpenCardNews = (post: FeedCardPost) => {
    navigate(`/card-news/${post.postId}`, {
      state: {
        cards: featuredPosts.map(({ imageUrl, postId, summary, tagName, title }) => ({
          imageUrl,
          postId,
          summary,
          tagName,
          title,
        })),
        imageUrl: post.imageUrl,
        postId: post.postId,
        summary: post.summary,
        tagName: post.tagName,
        title: post.title,
      },
    });
  };

  return {
    communityPosts,
    deadlinePreviewPosts: deadlinePreview?.posts ?? [],
    featuredNoticeTab,
    featuredPosts,
    isDeadlinePreviewError,
    isDeadlinePreviewLoading,
    isFeaturedNoticeError,
    isFeaturedNoticeLoading,
    isNoticeInterestPromptOpen,
    nickname,
    onCloseNoticeInterestPrompt: dismissNoticeInterestPrompt,
    onDeadlinePostClick: (postId: number) => navigate(`/info/posts/${postId}`),
    onFeaturedNoticeCardClick: handleOpenCardNews,
    onFeaturedNoticeDetailClick: (postId: number) => navigate(`/info/posts/${postId}`),
    onFeaturedNoticeTabChange: setFeaturedNoticeTab,
    onNotificationClick: () => navigate('/notifications/activity'),
    onOpenDeadlineList: () => navigate('/deadlines'),
    onOpenNoticeInterests: () => navigate('/notice-interests'),
    shouldShowDeadlinePreviewEmpty:
      !isDeadlinePreviewLoading &&
      !isDeadlinePreviewError &&
      (deadlinePreview?.posts.length ?? 0) === 0,
    shouldShowFeaturedNoticeEmpty:
      !isFeaturedNoticeLoading && !isFeaturedNoticeError && featuredPosts.length === 0,
  };
}
