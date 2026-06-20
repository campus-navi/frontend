import type { DeadlinePost, FeedCardPost } from '@/api';

export type FeaturedNoticeTab = 'new' | 'recommended';

export type HomeCommunityPost = {
  body: string;
  hasImage: boolean;
  id: number;
  title: string;
};

export type HomeViewModel = {
  communityPosts: HomeCommunityPost[];
  deadlinePreviewPosts: DeadlinePost[];
  featuredNoticeTab: FeaturedNoticeTab;
  featuredPosts: FeedCardPost[];
  isDeadlinePreviewError: boolean;
  isDeadlinePreviewLoading: boolean;
  isFeaturedNoticeError: boolean;
  isFeaturedNoticeLoading: boolean;
  isNoticeInterestPromptOpen: boolean;
  nickname: string;
  onCloseNoticeInterestPrompt: () => void;
  onDeadlinePostClick: (postId: number) => void;
  onFeaturedNoticeCardClick: (post: FeedCardPost) => void;
  onFeaturedNoticeDetailClick: (postId: number) => void;
  onFeaturedNoticeTabChange: (tab: FeaturedNoticeTab) => void;
  onOpenDeadlineList: () => void;
  onOpenNoticeInterests: () => void;
  shouldShowDeadlinePreviewEmpty: boolean;
  shouldShowFeaturedNoticeEmpty: boolean;
};
