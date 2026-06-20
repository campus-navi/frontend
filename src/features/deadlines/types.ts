import type { DeadlinePost } from '@/api';

export type DeadlinesViewModel = {
  onBack: () => void;
  onPostClick: (postId: number) => void;
  posts: DeadlinePost[];
  shouldShowEmptyMessage: boolean;
  shouldShowErrorMessage: boolean;
  shouldShowLoadingMessage: boolean;
};
