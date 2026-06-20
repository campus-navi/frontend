import { useEffect, useRef, useState, type ChangeEventHandler, type MouseEventHandler, type PointerEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

import { isApiError, type MyPageScrapFolderSort } from '@/api';
import { useCreateScrapFolder } from '@/features/mypage/hooks/useCreateScrapFolder';
import { useDeleteScrapFolder } from '@/features/mypage/hooks/useDeleteScrapFolder';
import { useMyPageScraps } from '@/features/mypage/hooks/useMyPageScraps';
import { useScrapFolders } from '@/features/mypage/hooks/useScrapFolders';
import { useUpdateScrapFolder } from '@/features/mypage/hooks/useUpdateScrapFolder';
import type { MyPageRecentScrapCardItem, MyPageScrapFolderListItem } from '@/features/mypage/types';

const SCRAP_FOLDER_INPUT_MAX_LENGTH = 20;
const MAX_RECENT_SCRAPS = 8;
const DEFAULT_SCRAP_FOLDER_SORT: MyPageScrapFolderSort = 'RECENT_SAVED';

const scrapFolderSortLabels: Record<MyPageScrapFolderSort, string> = {
  RECENT_SAVED: '최근 저장',
  NAME_ASC: '이름 순(A-Z)',
  NAME_DESC: '이름 순(Z-A)',
  LIST_ADDED: '리스트 추가 순',
};

export function useMyPageScrapsViewModel() {
  const navigate = useNavigate();
  const [currentSort, setCurrentSort] =
    useState<MyPageScrapFolderSort>(DEFAULT_SCRAP_FOLDER_SORT);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [isCreateFolderSheetOpen, setIsCreateFolderSheetOpen] = useState(false);
  const [createFolderName, setCreateFolderName] = useState('');
  const [createFolderDescription, setCreateFolderDescription] = useState('');
  const [isEditFolderSheetOpen, setIsEditFolderSheetOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<MyPageScrapFolderListItem | null>(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [editFolderDescription, setEditFolderDescription] = useState('');
  const [selectedMoreMenuFolder, setSelectedMoreMenuFolder] = useState<MyPageScrapFolderListItem | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<MyPageScrapFolderListItem | null>(null);
  const createScrapFolderMutation = useCreateScrapFolder();
  const deleteScrapFolderMutation = useDeleteScrapFolder();
  const updateScrapFolderMutation = useUpdateScrapFolder();
  const {
    data: scraps,
    isError: isScrapsError,
    isLoading: isScrapsLoading,
  } = useMyPageScraps();
  const {
    data: scrapFolders,
    isError: isScrapFoldersError,
    isLoading: isScrapFoldersLoading,
  } = useScrapFolders(currentSort);
  const recentScraps = (scraps?.recentScraps ?? [])
    .slice(0, MAX_RECENT_SCRAPS)
    .map<MyPageRecentScrapCardItem>((scrap) => ({
      detailPath: `/info/posts/${scrap.postId}`,
      endDate: scrap.endDate,
      publishedAt: scrap.publishedAt,
      tagName: scrap.tagName,
      title: scrap.title,
    }));
  const folders = (scrapFolders ?? scraps?.folders ?? []).map<MyPageScrapFolderListItem>((folder) => ({
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

  const handleOpenSortSheet = () => {
    setIsSortSheetOpen(true);
  };

  const handleCloseSortSheet = () => {
    setIsSortSheetOpen(false);
  };

  const handleSelectSortOption = (sort: MyPageScrapFolderSort) => {
    if (sort !== currentSort) {
      setCurrentSort(sort);
    }

    setIsSortSheetOpen(false);
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

    updateScrapFolderMutation.reset();
    setEditingFolder(selectedMoreMenuFolder);
    setEditFolderName(selectedMoreMenuFolder.name);
    setEditFolderDescription(selectedMoreMenuFolder.description);
    setIsEditFolderSheetOpen(true);
    handleCloseFolderMoreMenu();
  };

  const handleCloseEditFolderSheet = () => {
    if (updateScrapFolderMutation.isPending) {
      return;
    }

    setIsEditFolderSheetOpen(false);
    updateScrapFolderMutation.reset();
    resetEditFolderInputs();
  };

  const handleChangeEditFolderName: ChangeEventHandler<HTMLInputElement> = (event) => {
    updateScrapFolderMutation.reset();
    setEditFolderName(event.target.value.slice(0, SCRAP_FOLDER_INPUT_MAX_LENGTH));
  };

  const handleChangeEditFolderDescription: ChangeEventHandler<HTMLInputElement> = (event) => {
    updateScrapFolderMutation.reset();
    setEditFolderDescription(event.target.value.slice(0, SCRAP_FOLDER_INPUT_MAX_LENGTH));
  };

  const handleClearEditFolderName = () => {
    updateScrapFolderMutation.reset();
    setEditFolderName('');
  };

  const handleClearEditFolderDescription = () => {
    updateScrapFolderMutation.reset();
    setEditFolderDescription('');
  };

  const handleSubmitEditFolder = () => {
    const trimmedName = editFolderName.trim();
    const trimmedDescription = editFolderDescription.trim();

    if (!editingFolder || !trimmedName || updateScrapFolderMutation.isPending) {
      return;
    }

    updateScrapFolderMutation.mutate(
      {
        folderId: editingFolder.folderId,
        request: {
          description: trimmedDescription,
          name: trimmedName,
        },
      },
      {
        onSuccess: () => {
          setIsEditFolderSheetOpen(false);
          updateScrapFolderMutation.reset();
          resetEditFolderInputs();
        },
      },
    );
  };

  const handleDeleteFolder = () => {
    if (!selectedMoreMenuFolder) {
      return;
    }

    deleteScrapFolderMutation.reset();
    setDeletingFolder(selectedMoreMenuFolder);
    handleCloseFolderMoreMenu();
  };

  const handleCloseDeleteFolderModal = () => {
    if (deleteScrapFolderMutation.isPending) {
      return;
    }

    deleteScrapFolderMutation.reset();
    setDeletingFolder(null);
  };

  const handleConfirmDeleteFolder = () => {
    if (!deletingFolder || deleteScrapFolderMutation.isPending) {
      return;
    }

    deleteScrapFolderMutation.mutate(deletingFolder.folderId, {
      onSuccess: () => {
        deleteScrapFolderMutation.reset();
        setDeletingFolder(null);
      },
    });
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

  const editFolderErrorMessage = (() => {
    const error = updateScrapFolderMutation.error;

    if (!error) {
      return null;
    }

    if (isApiError(error) && error.status === 409) {
      return '이미 같은 이름의 폴더가 있습니다.';
    }

    if (isApiError(error) && error.status === 404) {
      return '폴더를 찾을 수 없습니다.';
    }

    return '폴더를 수정하지 못했습니다.';
  })();

  const deleteFolderErrorMessage = (() => {
    const error = deleteScrapFolderMutation.error;

    if (!error) {
      return null;
    }

    if (isApiError(error) && error.status === 404) {
      return '폴더를 찾을 수 없습니다.';
    }

    return '폴더를 삭제하지 못했습니다.';
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
    currentSort,
    currentSortLabel: scrapFolderSortLabels[currentSort],
    deleteFolderErrorMessage,
    deletingFolder,
    editFolderDescription,
    editFolderDescriptionMaxLength: SCRAP_FOLDER_INPUT_MAX_LENGTH,
    editFolderErrorMessage,
    editFolderName,
    editFolderNameMaxLength: SCRAP_FOLDER_INPUT_MAX_LENGTH,
    editingFolder,
    isCreateFolderPending: createScrapFolderMutation.isPending,
    isCreateFolderSheetOpen,
    isCreateFolderSubmitDisabled: createFolderName.trim().length === 0 || createScrapFolderMutation.isPending,
    isDeleteFolderModalOpen: deletingFolder !== null,
    isDeleteFolderPending: deleteScrapFolderMutation.isPending,
    isEditFolderSheetOpen,
    isEditFolderPending: updateScrapFolderMutation.isPending,
    isEditFolderSubmitDisabled:
      editFolderName.trim().length === 0 || updateScrapFolderMutation.isPending,
    isFolderMoreMenuOpen: selectedMoreMenuFolder !== null,
    isSortSheetOpen,
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
    onCloseDeleteFolderModal: handleCloseDeleteFolderModal,
    onCloseEditFolderSheet: handleCloseEditFolderSheet,
    onCloseFolderMoreMenu: handleCloseFolderMoreMenu,
    onCloseSortSheet: handleCloseSortSheet,
    onDeleteFolder: handleDeleteFolder,
    onEditFolder: handleEditFolder,
    onFolderMoreClick: handleOpenFolderMoreMenu,
    onConfirmDeleteFolder: handleConfirmDeleteFolder,
    onOpenCreateFolderSheet: handleOpenCreateFolderSheet,
    onOpenSortSheet: handleOpenSortSheet,
    onSelectSortOption: handleSelectSortOption,
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
    shouldShowErrorMessage: isScrapsError || isScrapFoldersError,
    shouldShowFoldersEmptyState:
      !isScrapFoldersLoading && !isScrapFoldersError && folders.length === 0,
    shouldShowLoadingMessage: isScrapsLoading || isScrapFoldersLoading,
    shouldShowRecentScrapsEmptyState:
      !isScrapsLoading && !isScrapsError && recentScraps.length === 0,
    selectedMoreMenuFolder,
  };
}
