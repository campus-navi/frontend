import { useNavigate, useParams } from 'react-router-dom';

import { isApiError } from '@/api';
import { useMyPageScrapFolderScraps } from '@/features/mypage/hooks/useMyPageScrapFolderScraps';
import type { MyPageFolderScrapListItem } from '@/features/mypage/types';

function parseFolderId(folderId: string | undefined) {
  if (!folderId) {
    return null;
  }

  const parsedFolderId = Number(folderId);

  if (!Number.isInteger(parsedFolderId) || parsedFolderId <= 0) {
    return null;
  }

  return parsedFolderId;
}

export function useMyPageScrapFolderViewModel() {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();
  const parsedFolderId = parseFolderId(folderId);
  const { data: scraps, error, isError, isLoading } = useMyPageScrapFolderScraps(parsedFolderId);
  const displayFolderId = parsedFolderId?.toString() ?? '알 수 없음';
  const title = `스크랩 폴더 ${displayFolderId}`;
  const items = (scraps ?? []).map<MyPageFolderScrapListItem>((scrap) => ({
    detailPath: scrap.isActive ? `/info/posts/${scrap.postId}` : null,
    endDate: scrap.endDate,
    isActive: scrap.isActive,
    postId: scrap.postId,
    publishedAt: scrap.publishedAt,
    scrapId: scrap.scrapId,
    tagName: scrap.tagName,
    title: scrap.title,
  }));
  const isInvalidFolderId = parsedFolderId === null;
  const isNotFoundError = isApiError(error) && error.status === 404;

  const handleBack = () => {
    navigate('/mypage/scraps');
  };

  return {
    displayFolderId,
    emptyMessage: '이 폴더에 저장된 스크랩이 없습니다.',
    errorMessage: isNotFoundError ? '폴더를 찾을 수 없습니다.' : '스크랩 목록을 불러오지 못했습니다.',
    invalidFolderMessage: '올바르지 않은 스크랩 폴더입니다.',
    isError,
    isInvalidFolderId,
    isLoading,
    items,
    onBack: handleBack,
    shouldShowEmptyMessage: !isInvalidFolderId && !isLoading && !isError && items.length === 0,
    title,
  };
}
