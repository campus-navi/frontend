import { useNavigate } from 'react-router-dom';

import { useDeadlines } from '@/features/deadlines/hooks/useDeadlines';
import type { DeadlinesViewModel } from '@/features/deadlines/types';

export function useDeadlinesViewModel(): DeadlinesViewModel {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useDeadlines();
  const posts = data?.posts ?? [];

  return {
    onBack: () => navigate(-1),
    onPostClick: (postId: number) => navigate(`/info/posts/${postId}`),
    posts,
    shouldShowEmptyMessage: !isLoading && !isError && posts.length === 0,
    shouldShowErrorMessage: isError,
    shouldShowLoadingMessage: isLoading,
  };
}
