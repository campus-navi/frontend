import { useEffect, useRef, type MouseEventHandler, type PointerEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMyPageScraps } from '@/features/mypage/hooks/useMyPageScraps';
import type { MyPageRecentScrapCardItem, MyPageScrapFolderListItem } from '@/features/mypage/types';

export function useMyPageScrapsViewModel() {
  const navigate = useNavigate();
  const { data: scraps, isError, isLoading } = useMyPageScraps();
  const recentScraps = (scraps?.recentScraps ?? []).map<MyPageRecentScrapCardItem>((scrap) => ({
    detailPath: `/info/posts/${scrap.postId}`,
    endDate: scrap.endDate,
    publishedAt: scrap.publishedAt,
    tagName: scrap.tagName,
    title: scrap.title,
  }));
  const folders = (scraps?.folders ?? []).map<MyPageScrapFolderListItem>((folder) => ({
    description: folder.description,
    detailPath: `/mypage/scraps/folders/${folder.folderId}`,
    folderId: folder.folderId,
    name: folder.name,
    scrapCount: folder.scrapCount,
  }));
  const recentScrapsRef = useRef<HTMLDivElement>(null);
  const cleanupRecentScrapsDragListenersRef = useRef<(() => void) | null>(null);
  const dragStateRef = useRef({
    isDragging: false,
    hasDragged: false,
    startX: 0,
    scrollLeft: 0,
  });

  const cleanupRecentScrapsDragListeners = () => {
    cleanupRecentScrapsDragListenersRef.current?.();
    cleanupRecentScrapsDragListenersRef.current = null;
  };

  const endRecentScrapsDrag = () => {
    dragStateRef.current.isDragging = false;
    cleanupRecentScrapsDragListeners();
  };

  useEffect(() => cleanupRecentScrapsDragListeners, []);

  const handleBack = () => {
    navigate('/mypage', { replace: true });
  };

  const handleFolderMoreClick = () => {
    // Folder edit/delete actions will be connected in a later flow.
  };

  const handleRecentScrapsPointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    const container = recentScrapsRef.current;
    if (!container) {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      hasDragged: false,
      startX: event.clientX,
      scrollLeft: container.scrollLeft,
    };

    cleanupRecentScrapsDragListeners();

    const handleWindowPointerEnd = () => {
      endRecentScrapsDrag();
    };

    window.addEventListener('pointerup', handleWindowPointerEnd);
    window.addEventListener('pointercancel', handleWindowPointerEnd);
    cleanupRecentScrapsDragListenersRef.current = () => {
      window.removeEventListener('pointerup', handleWindowPointerEnd);
      window.removeEventListener('pointercancel', handleWindowPointerEnd);
    };
  };

  const handleRecentScrapsPointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    const container = recentScrapsRef.current;
    const dragState = dragStateRef.current;
    if (!container || !dragState.isDragging) {
      return;
    }

    const moveDistance = event.clientX - dragState.startX;
    if (Math.abs(moveDistance) < 6) {
      return;
    }

    dragState.hasDragged = true;
    if (event.pointerType === 'touch') {
      return;
    }

    event.preventDefault();
    container.scrollLeft = dragState.scrollLeft - moveDistance;
  };

  const handleRecentScrapsClickCapture: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!dragStateRef.current.hasDragged) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current.hasDragged = false;
  };

  return {
    folders,
    onFolderMoreClick: handleFolderMoreClick,
    onBack: handleBack,
    recentScraps,
    recentScrapsHandlers: {
      onClickCapture: handleRecentScrapsClickCapture,
      onPointerCancel: endRecentScrapsDrag,
      onPointerDown: handleRecentScrapsPointerDown,
      onPointerMove: handleRecentScrapsPointerMove,
      onPointerUp: endRecentScrapsDrag,
    },
    recentScrapsRef,
    shouldShowErrorMessage: isError,
    shouldShowFoldersEmptyState: !isLoading && !isError && folders.length === 0,
    shouldShowLoadingMessage: isLoading,
    shouldShowRecentScrapsEmptyState: !isLoading && !isError && recentScraps.length === 0,
  };
}
