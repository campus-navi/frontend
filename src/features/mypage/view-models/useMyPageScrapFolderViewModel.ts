import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { isApiError } from '@/api';
import { useMoveFolderScrap } from '@/features/mypage/hooks/useMoveFolderScrap';
import { useMyPageScrapFolderScraps } from '@/features/mypage/hooks/useMyPageScrapFolderScraps';
import { useRemoveFolderScraps } from '@/features/mypage/hooks/useRemoveFolderScraps';
import { useScrapFolders } from '@/features/mypage/hooks/useScrapFolders';
import type {
  MyPageFolderScrapListItem,
  MyPageScrapFolderRouteState,
} from '@/features/mypage/types';

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
  const location = useLocation();
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();
  const [selectedScrapMoreMenu, setSelectedScrapMoreMenu] =
    useState<MyPageFolderScrapListItem | null>(null);
  const [movingScrap, setMovingScrap] = useState<MyPageFolderScrapListItem | null>(null);
  const [selectedTargetFolderId, setSelectedTargetFolderId] = useState<number | null>(null);
  const [moveValidationError, setMoveValidationError] = useState<string | null>(null);
  const parsedFolderId = parseFolderId(folderId);
  const moveFolderScrapMutation = useMoveFolderScrap();
  const removeFolderScrapsMutation = useRemoveFolderScraps();
  const { data: scraps, error, isError, isLoading } = useMyPageScrapFolderScraps(parsedFolderId);
  const { data: scrapFolders, isLoading: isMoveFoldersLoading } = useScrapFolders();
  const routeState = location.state as MyPageScrapFolderRouteState | null;
  const displayFolderId = parsedFolderId?.toString() ?? '알 수 없음';
  const folderName = routeState?.folderName?.trim() || `스크랩 폴더 ${displayFolderId}`;
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
  const availableMoveFolders = (scrapFolders ?? []).filter(
    (folder) => folder.folderId !== parsedFolderId,
  );

  const handleBack = () => {
    navigate('/mypage/scraps');
  };

  const handleScrapMoreClick = (item: MyPageFolderScrapListItem) => {
    if (removeFolderScrapsMutation.isPending || moveFolderScrapMutation.isPending) {
      return;
    }

    removeFolderScrapsMutation.reset();
    setSelectedScrapMoreMenu(item);
  };

  const handleCloseScrapMoreMenu = () => {
    if (removeFolderScrapsMutation.isPending) {
      return;
    }

    removeFolderScrapsMutation.reset();
    setSelectedScrapMoreMenu(null);
  };

  const handleMoveScrap = (item: MyPageFolderScrapListItem) => {
    if (
      selectedScrapMoreMenu?.scrapId !== item.scrapId ||
      removeFolderScrapsMutation.isPending ||
      moveFolderScrapMutation.isPending
    ) {
      return;
    }

    moveFolderScrapMutation.reset();
    setMoveValidationError(null);
    setMovingScrap(item);
    setSelectedTargetFolderId(null);
    setSelectedScrapMoreMenu(null);
  };

  const handleCloseMoveSheet = () => {
    if (moveFolderScrapMutation.isPending) {
      return;
    }

    moveFolderScrapMutation.reset();
    setMoveValidationError(null);
    setMovingScrap(null);
    setSelectedTargetFolderId(null);
  };

  const handleSelectMoveTargetFolder = (targetFolderId: number) => {
    if (moveFolderScrapMutation.isPending) {
      return;
    }

    moveFolderScrapMutation.reset();
    setMoveValidationError(null);
    setSelectedTargetFolderId(targetFolderId);
  };

  const handleConfirmMoveScrap = () => {
    if (parsedFolderId === null || movingScrap === null || moveFolderScrapMutation.isPending) {
      return;
    }

    if (selectedTargetFolderId === null) {
      setMoveValidationError('이동할 폴더를 선택해주세요.');
      return;
    }

    setMoveValidationError(null);
    moveFolderScrapMutation.mutate(
      {
        postId: movingScrap.postId,
        scrapId: movingScrap.scrapId,
        sourceFolderId: parsedFolderId,
        targetFolderId: selectedTargetFolderId,
      },
      {
        onSuccess: () => {
          moveFolderScrapMutation.reset();
          setMovingScrap(null);
          setSelectedTargetFolderId(null);
        },
      },
    );
  };

  const handleOpenCreateFolderFromMoveSheet = () => {
    // TODO: Reuse the scrap folder creation flow when sheet coordination is added.
  };

  const handleDeleteScrap = (item: MyPageFolderScrapListItem) => {
    if (
      parsedFolderId === null ||
      selectedScrapMoreMenu?.scrapId !== item.scrapId ||
      removeFolderScrapsMutation.isPending ||
      moveFolderScrapMutation.isPending
    ) {
      return;
    }

    removeFolderScrapsMutation.mutate(
      {
        folderId: parsedFolderId,
        request: {
          scrapIds: [item.scrapId],
        },
      },
      {
        onSuccess: () => {
          removeFolderScrapsMutation.reset();
          setSelectedScrapMoreMenu(null);
        },
      },
    );
  };

  const handleEnterMultiSelectMode = () => {
    // TODO: Connect the multi-select flow in a later issue.
  };

  const removeScrapErrorMessage = (() => {
    const mutationError = removeFolderScrapsMutation.error;

    if (!mutationError) {
      return null;
    }

    if (isApiError(mutationError) && mutationError.status === 400) {
      return '제거할 스크랩을 선택해주세요.';
    }

    if (isApiError(mutationError) && mutationError.status === 404) {
      return '폴더를 찾을 수 없습니다.';
    }

    return '스크랩을 제거하지 못했습니다.';
  })();

  const moveScrapErrorMessage = (() => {
    if (moveValidationError) {
      return moveValidationError;
    }

    const mutationError = moveFolderScrapMutation.error;

    if (!mutationError) {
      return null;
    }

    if (isApiError(mutationError) && mutationError.status === 400) {
      return '이동할 스크랩 정보를 확인해주세요.';
    }

    if (isApiError(mutationError) && mutationError.status === 404) {
      return '폴더를 찾을 수 없습니다.';
    }

    return '스크랩을 이동하지 못했습니다.';
  })();

  return {
    availableMoveFolders,
    emptyMessage: '이 폴더에 저장된 스크랩이 없습니다.',
    errorMessage: isNotFoundError ? '폴더를 찾을 수 없습니다.' : '스크랩 목록을 불러오지 못했습니다.',
    folderName,
    invalidFolderMessage: '올바르지 않은 스크랩 폴더입니다.',
    isError,
    isInvalidFolderId,
    isLoading,
    isMoveFoldersLoading,
    isMoveScrapPending: moveFolderScrapMutation.isPending,
    isMoveSheetOpen: movingScrap !== null,
    isRemoveScrapPending: removeFolderScrapsMutation.isPending,
    items,
    moveScrapErrorMessage,
    movingScrap,
    onBack: handleBack,
    onCloseMoveSheet: handleCloseMoveSheet,
    onCloseScrapMoreMenu: handleCloseScrapMoreMenu,
    onConfirmMoveScrap: handleConfirmMoveScrap,
    onDeleteScrap: handleDeleteScrap,
    onEnterMultiSelectMode: handleEnterMultiSelectMode,
    onMoveScrap: handleMoveScrap,
    onOpenCreateFolderFromMoveSheet: handleOpenCreateFolderFromMoveSheet,
    onScrapMoreClick: handleScrapMoreClick,
    onSelectMoveTargetFolder: handleSelectMoveTargetFolder,
    removeScrapErrorMessage,
    scrapCount: items.length,
    selectedTargetFolderId,
    selectedScrapMoreMenu,
    shouldShowEmptyMessage: !isInvalidFolderId && !isLoading && !isError && items.length === 0,
  };
}
