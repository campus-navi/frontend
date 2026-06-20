import { useEffect, useRef, useState, type ChangeEventHandler, type MouseEventHandler, type PointerEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

import { isApiError } from '@/api';
import { useCreateScrapFolder } from '@/features/mypage/hooks/useCreateScrapFolder';
import { useMyPageScraps } from '@/features/mypage/hooks/useMyPageScraps';
import type { MyPageRecentScrapCardItem, MyPageScrapFolderListItem } from '@/features/mypage/types';

const SCRAP_FOLDER_INPUT_MAX_LENGTH = 20;
const MAX_RECENT_SCRAPS = 8;

export function useMyPageScrapsViewModel() {
  const navigate = useNavigate();
  const [isCreateFolderSheetOpen, setIsCreateFolderSheetOpen] = useState(false);
  const [createFolderName, setCreateFolderName] = useState('');
  const [createFolderDescription, setCreateFolderDescription] = useState('');
  const [isEditFolderSheetOpen, setIsEditFolderSheetOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<MyPageScrapFolderListItem | null>(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [editFolderDescription, setEditFolderDescription] = useState('');
  const [selectedMoreMenuFolder, setSelectedMoreMenuFolder] = useState<MyPageScrapFolderListItem | null>(null);
  const createScrapFolderMutation = useCreateScrapFolder();
  const { data: scraps, isError, isLoading } = useMyPageScraps();
  const recentScraps = (scraps?.recentScraps ?? [])
    .slice(0, MAX_RECENT_SCRAPS)
    .map<MyPageRecentScrapCardItem>((scrap) => ({
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

  const handleOpenFolderMoreMenu = (folder: MyPageScrapFolderListItem) => {
    setSelectedMoreMenuFolder(folder);
  };

  const handleCloseFolderMoreMenu = () => {
    setSelectedMoreMenuFolder(null);
  };

  const resetEditFolderInputs = () => {
    setEditingFolder(null);
    setEditFolderName('');
    setEditFolderDescription('');
  };

  const handleEditFolder = () => {
    if (!selectedMoreMenuFolder) {
      return;
    }

    setEditingFolder(selectedMoreMenuFolder);
    setEditFolderName(selectedMoreMenuFolder.name);
    setEditFolderDescription(selectedMoreMenuFolder.description);
    setIsEditFolderSheetOpen(true);
    handleCloseFolderMoreMenu();
  };

  const handleCloseEditFolderSheet = () => {
    setIsEditFolderSheetOpen(false);
    resetEditFolderInputs();
  };

  const handleChangeEditFolderName: ChangeEventHandler<HTMLInputElement> = (event) => {
    setEditFolderName(event.target.value.slice(0, SCRAP_FOLDER_INPUT_MAX_LENGTH));
  };

  const handleChangeEditFolderDescription: ChangeEventHandler<HTMLInputElement> = (event) => {
    setEditFolderDescription(event.target.value.slice(0, SCRAP_FOLDER_INPUT_MAX_LENGTH));
  };

  const handleClearEditFolderName = () => {
    setEditFolderName('');
  };

  const handleClearEditFolderDescription = () => {
    setEditFolderDescription('');
  };

  const handleSubmitEditFolder = () => {
    const trimmedName = editFolderName.trim();

    if (!trimmedName) {
      return;
    }

    // TODO: Connect PATCH /api/v1/scrap-folders/{id} in a later issue.
    handleCloseEditFolderSheet();
  };

  const handleDeleteFolder = () => {
    // Folder delete flow will be connected in a later issue.
    handleCloseFolderMoreMenu();
  };

  const resetCreateFolderInputs = () => {
    setCreateFolderName('');
    setCreateFolderDescription('');
  };

  const handleOpenCreateFolderSheet = () => {
    createScrapFolderMutation.reset();
    setIsCreateFolderSheetOpen(true);
  };

  const closeCreateFolderSheet = () => {
    setIsCreateFolderSheetOpen(false);
    createScrapFolderMutation.reset();
    resetCreateFolderInputs();
  };

  const handleCloseCreateFolderSheet = () => {
    if (createScrapFolderMutation.isPending) {
      return;
    }

    closeCreateFolderSheet();
  };

  const handleCreateFolderNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    createScrapFolderMutation.reset();
    setCreateFolderName(event.target.value.slice(0, SCRAP_FOLDER_INPUT_MAX_LENGTH));
  };

  const handleCreateFolderDescriptionChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    createScrapFolderMutation.reset();
    setCreateFolderDescription(event.target.value.slice(0, SCRAP_FOLDER_INPUT_MAX_LENGTH));
  };

  const handleClearCreateFolderName = () => {
    createScrapFolderMutation.reset();
    setCreateFolderName('');
  };

  const handleClearCreateFolderDescription = () => {
    createScrapFolderMutation.reset();
    setCreateFolderDescription('');
  };

  const handleCreateFolderSubmit = () => {
    const trimmedName = createFolderName.trim();
    const trimmedDescription = createFolderDescription.trim();

    if (!trimmedName || createScrapFolderMutation.isPending) {
      return;
    }

    createScrapFolderMutation.mutate(
      {
        ...(trimmedDescription ? { description: trimmedDescription } : {}),
        name: trimmedName,
      },
      {
        onSuccess: () => {
          closeCreateFolderSheet();
        },
      },
    );
  };

  const createFolderErrorMessage = (() => {
    const error = createScrapFolderMutation.error;

    if (!error) {
      return null;
    }

    if (isApiError(error) && error.status === 409) {
      return '이미 같은 이름의 폴더가 있습니다.';
    }

    if (isApiError(error) && error.status === 400) {
      return '폴더를 더 이상 만들 수 없습니다.';
    }

    return '폴더를 생성하지 못했습니다.';
  })();

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
    createFolderDescription,
    createFolderDescriptionMaxLength: SCRAP_FOLDER_INPUT_MAX_LENGTH,
    createFolderErrorMessage,
    createFolderName,
    createFolderNameMaxLength: SCRAP_FOLDER_INPUT_MAX_LENGTH,
    editFolderDescription,
    editFolderDescriptionMaxLength: SCRAP_FOLDER_INPUT_MAX_LENGTH,
    editFolderName,
    editFolderNameMaxLength: SCRAP_FOLDER_INPUT_MAX_LENGTH,
    editingFolder,
    isCreateFolderPending: createScrapFolderMutation.isPending,
    isCreateFolderSheetOpen,
    isCreateFolderSubmitDisabled: createFolderName.trim().length === 0 || createScrapFolderMutation.isPending,
    isEditFolderSheetOpen,
    isEditFolderSubmitDisabled: editFolderName.trim().length === 0,
    isFolderMoreMenuOpen: selectedMoreMenuFolder !== null,
    onBack: handleBack,
    onChangeCreateFolderDescription: handleCreateFolderDescriptionChange,
    onChangeCreateFolderName: handleCreateFolderNameChange,
    onChangeEditFolderDescription: handleChangeEditFolderDescription,
    onChangeEditFolderName: handleChangeEditFolderName,
    onClearCreateFolderDescription: handleClearCreateFolderDescription,
    onClearCreateFolderName: handleClearCreateFolderName,
    onClearEditFolderDescription: handleClearEditFolderDescription,
    onClearEditFolderName: handleClearEditFolderName,
    onCloseCreateFolderSheet: handleCloseCreateFolderSheet,
    onCloseEditFolderSheet: handleCloseEditFolderSheet,
    onCloseFolderMoreMenu: handleCloseFolderMoreMenu,
    onDeleteFolder: handleDeleteFolder,
    onEditFolder: handleEditFolder,
    onFolderMoreClick: handleOpenFolderMoreMenu,
    onOpenCreateFolderSheet: handleOpenCreateFolderSheet,
    onSubmitCreateFolder: handleCreateFolderSubmit,
    onSubmitEditFolder: handleSubmitEditFolder,
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
    selectedMoreMenuFolder,
  };
}
