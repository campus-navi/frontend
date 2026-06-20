import type { ChangeEventHandler, MouseEventHandler, PointerEventHandler, RefObject } from 'react';

import { AppHeader } from '@/components/ui/AppHeader';
import { EmptyStateMessage } from '@/features/mypage/components/scraps/EmptyStateMessage';
import { RecentScrapCard } from '@/features/mypage/components/scraps/RecentScrapCard';
import { ScrapFolderCreateBottomSheet } from '@/features/mypage/components/scraps/ScrapFolderCreateBottomSheet';
import { ScrapFolderDeleteConfirmModal } from '@/features/mypage/components/scraps/ScrapFolderDeleteConfirmModal';
import { ScrapFolderEditBottomSheet } from '@/features/mypage/components/scraps/ScrapFolderEditBottomSheet';
import { ScrapFolderRow } from '@/features/mypage/components/scraps/ScrapFolderRow';
import { PlusIcon } from '@/features/mypage/components/scraps/ScrapIcons';
import type { MyPageRecentScrapCardItem, MyPageScrapFolderListItem } from '@/features/mypage/types';

type RecentScrapsHandlers = {
  onClickCapture: MouseEventHandler<HTMLDivElement>;
  onPointerCancel: PointerEventHandler<HTMLDivElement>;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerUp: PointerEventHandler<HTMLDivElement>;
};

type MyPageScrapsViewProps = {
  createFolderDescription: string;
  createFolderDescriptionMaxLength: number;
  createFolderErrorMessage: string | null;
  createFolderName: string;
  createFolderNameMaxLength: number;
  deleteFolderErrorMessage: string | null;
  deletingFolder: MyPageScrapFolderListItem | null;
  editFolderDescription: string;
  editFolderDescriptionMaxLength: number;
  editFolderErrorMessage: string | null;
  editFolderName: string;
  editFolderNameMaxLength: number;
  editingFolder: MyPageScrapFolderListItem | null;
  isCreateFolderPending: boolean;
  folders: MyPageScrapFolderListItem[];
  isCreateFolderSheetOpen: boolean;
  isCreateFolderSubmitDisabled: boolean;
  isDeleteFolderModalOpen: boolean;
  isDeleteFolderPending: boolean;
  isEditFolderSheetOpen: boolean;
  isEditFolderPending: boolean;
  isEditFolderSubmitDisabled: boolean;
  isFolderMoreMenuOpen: boolean;
  onBack: () => void;
  onChangeCreateFolderDescription: ChangeEventHandler<HTMLInputElement>;
  onChangeCreateFolderName: ChangeEventHandler<HTMLInputElement>;
  onChangeEditFolderDescription: ChangeEventHandler<HTMLInputElement>;
  onChangeEditFolderName: ChangeEventHandler<HTMLInputElement>;
  onClearCreateFolderDescription: () => void;
  onClearCreateFolderName: () => void;
  onClearEditFolderDescription: () => void;
  onClearEditFolderName: () => void;
  onCloseCreateFolderSheet: () => void;
  onCloseDeleteFolderModal: () => void;
  onCloseEditFolderSheet: () => void;
  onCloseFolderMoreMenu: () => void;
  onDeleteFolder: () => void;
  onEditFolder: () => void;
  onFolderMoreClick: (folder: MyPageScrapFolderListItem) => void;
  onConfirmDeleteFolder: () => void;
  onOpenCreateFolderSheet: () => void;
  onSubmitCreateFolder: () => void;
  onSubmitEditFolder: () => void;
  recentScraps: MyPageRecentScrapCardItem[];
  recentScrapsHandlers: RecentScrapsHandlers;
  recentScrapsRef: RefObject<HTMLDivElement>;
  shouldShowErrorMessage: boolean;
  shouldShowFoldersEmptyState: boolean;
  shouldShowLoadingMessage: boolean;
  shouldShowRecentScrapsEmptyState: boolean;
  selectedMoreMenuFolder: MyPageScrapFolderListItem | null;
};

export function MyPageScrapsView({
  createFolderDescription,
  createFolderDescriptionMaxLength,
  createFolderErrorMessage,
  createFolderName,
  createFolderNameMaxLength,
  deleteFolderErrorMessage,
  deletingFolder,
  editFolderDescription,
  editFolderDescriptionMaxLength,
  editFolderErrorMessage,
  editFolderName,
  editFolderNameMaxLength,
  editingFolder,
  folders,
  isCreateFolderPending,
  isCreateFolderSheetOpen,
  isCreateFolderSubmitDisabled,
  isDeleteFolderModalOpen,
  isDeleteFolderPending,
  isEditFolderSheetOpen,
  isEditFolderPending,
  isEditFolderSubmitDisabled,
  isFolderMoreMenuOpen,
  onBack,
  onChangeCreateFolderDescription,
  onChangeCreateFolderName,
  onChangeEditFolderDescription,
  onChangeEditFolderName,
  onClearCreateFolderDescription,
  onClearCreateFolderName,
  onClearEditFolderDescription,
  onClearEditFolderName,
  onCloseCreateFolderSheet,
  onCloseDeleteFolderModal,
  onCloseEditFolderSheet,
  onCloseFolderMoreMenu,
  onDeleteFolder,
  onEditFolder,
  onFolderMoreClick,
  onConfirmDeleteFolder,
  onOpenCreateFolderSheet,
  onSubmitCreateFolder,
  onSubmitEditFolder,
  recentScraps,
  recentScrapsHandlers,
  recentScrapsRef,
  shouldShowErrorMessage,
  shouldShowFoldersEmptyState,
  shouldShowLoadingMessage,
  shouldShowRecentScrapsEmptyState,
  selectedMoreMenuFolder,
}: MyPageScrapsViewProps) {
  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader
          title="스크랩 설정"
          onBack={onBack}
          className="fixed left-1/2 top-0 z-10 w-full max-w-[393px] -translate-x-1/2 bg-white"
        />
        <div className="h-[calc(64px+max(20px,env(safe-area-inset-top)))] shrink-0" aria-hidden="true" />

        <section className="flex flex-1 flex-col gap-1.5 pb-[max(32px,env(safe-area-inset-bottom))]">
          <h1 className="sr-only">스크랩 설정</h1>

          {shouldShowLoadingMessage ? (
            <div className="mx-4 mt-4 rounded-xl bg-[#F6F7F9] px-4 py-3 text-[14px] font-medium leading-[1.4] text-[#565656]">
              스크랩 정보를 불러오는 중이에요.
            </div>
          ) : null}

          {shouldShowErrorMessage ? (
            <div className="mx-4 mt-4 rounded-xl bg-[#FFF4F2] px-4 py-3 text-[14px] font-medium leading-[1.4] text-[#FF5E47]">
              스크랩 정보를 불러오지 못했어요.
            </div>
          ) : null}

          <section className="bg-white pb-5 pt-4" aria-labelledby="recent-scraps-title">
            <div className="px-4">
              <h2
                id="recent-scraps-title"
                className="text-base font-semibold leading-[1.4] tracking-normal text-[#292B2C]"
              >
                최근 스크랩
              </h2>
            </div>

            <div
              ref={recentScrapsRef}
              className="mt-3 flex cursor-grab gap-3 overflow-x-auto px-4 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="최근 스크랩 목록"
              onPointerDown={recentScrapsHandlers.onPointerDown}
              onPointerMove={recentScrapsHandlers.onPointerMove}
              onPointerUp={recentScrapsHandlers.onPointerUp}
              onPointerCancel={recentScrapsHandlers.onPointerCancel}
              onClickCapture={recentScrapsHandlers.onClickCapture}
            >
              {recentScraps.map((scrap) => (
                <RecentScrapCard key={scrap.detailPath} scrap={scrap} />
              ))}

              {shouldShowRecentScrapsEmptyState ? (
                <EmptyStateMessage message="최근 스크랩한 공지가 없습니다." />
              ) : null}
            </div>
          </section>

          <section className="flex flex-col bg-white pb-6 pt-2" aria-labelledby="scrap-folders-title">
            <h2 id="scrap-folders-title" className="sr-only">
              스크랩 폴더
            </h2>

            <div className="flex h-[52px] items-center px-4 py-2">
              <div className="flex h-9 items-center gap-0 rounded-full border border-[#DCDFE2] py-2.5 pl-4 pr-3 text-base font-medium leading-none text-[#565656]">
                <span>최근 저장</span>
                <span className="ml-1 flex h-4 w-4 items-center justify-center" aria-hidden="true">
                  <span className="h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-[#565656]" />
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-col">
              {folders.map((folder) => (
                <ScrapFolderRow
                  key={folder.folderId}
                  folder={folder}
                  isMoreMenuOpen={isFolderMoreMenuOpen && selectedMoreMenuFolder?.folderId === folder.folderId}
                  onMoreClick={onFolderMoreClick}
                  onMoreMenuClose={onCloseFolderMoreMenu}
                  onEditFolder={onEditFolder}
                  onDeleteFolder={onDeleteFolder}
                />
              ))}

              {shouldShowFoldersEmptyState ? (
                <div className="px-4">
                  <EmptyStateMessage message="스크랩 폴더가 없습니다." />
                </div>
              ) : null}
            </div>

            <div className="h-[127px] shrink-0" aria-hidden="true" />

            <div className="fixed bottom-[59px] left-1/2 z-10 flex w-full max-w-[393px] -translate-x-1/2 justify-center px-4">
              <button
                type="button"
                className="inline-flex h-[52px] items-center gap-1.5 rounded-full bg-[#292B2C] px-7 text-base font-semibold leading-none text-white"
                onClick={onOpenCreateFolderSheet}
                aria-label="새 폴더 추가"
              >
                <PlusIcon />
                <span>새폴더 추가</span>
              </button>
            </div>
          </section>
        </section>
      </div>

      <ScrapFolderCreateBottomSheet
        isOpen={isCreateFolderSheetOpen}
        name={createFolderName}
        nameMaxLength={createFolderNameMaxLength}
        description={createFolderDescription}
        descriptionMaxLength={createFolderDescriptionMaxLength}
        errorMessage={createFolderErrorMessage}
        isPending={isCreateFolderPending}
        isSubmitDisabled={isCreateFolderSubmitDisabled}
        onChangeName={onChangeCreateFolderName}
        onChangeDescription={onChangeCreateFolderDescription}
        onClearName={onClearCreateFolderName}
        onClearDescription={onClearCreateFolderDescription}
        onClose={onCloseCreateFolderSheet}
        onSubmit={onSubmitCreateFolder}
      />

      <ScrapFolderEditBottomSheet
        isOpen={isEditFolderSheetOpen}
        folderName={editingFolder?.name ?? ''}
        name={editFolderName}
        nameMaxLength={editFolderNameMaxLength}
        description={editFolderDescription}
        descriptionMaxLength={editFolderDescriptionMaxLength}
        errorMessage={editFolderErrorMessage}
        isPending={isEditFolderPending}
        isSubmitDisabled={isEditFolderSubmitDisabled}
        onChangeName={onChangeEditFolderName}
        onChangeDescription={onChangeEditFolderDescription}
        onClearName={onClearEditFolderName}
        onClearDescription={onClearEditFolderDescription}
        onClose={onCloseEditFolderSheet}
        onSubmit={onSubmitEditFolder}
      />

      <ScrapFolderDeleteConfirmModal
        errorMessage={deleteFolderErrorMessage}
        folderName={deletingFolder?.name ?? ''}
        isOpen={isDeleteFolderModalOpen}
        isPending={isDeleteFolderPending}
        onCancel={onCloseDeleteFolderModal}
        onConfirm={onConfirmDeleteFolder}
      />
    </main>
  );
}
