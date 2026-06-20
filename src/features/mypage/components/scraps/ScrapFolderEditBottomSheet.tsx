import type { ChangeEventHandler } from 'react';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SvgIcon } from '@/components/ui/SvgIcon';

type ScrapFolderEditBottomSheetProps = {
  description: string;
  descriptionMaxLength: number;
  errorMessage: string | null;
  folderName: string;
  isOpen: boolean;
  isPending: boolean;
  isSubmitDisabled: boolean;
  name: string;
  nameMaxLength: number;
  onChangeDescription: ChangeEventHandler<HTMLInputElement>;
  onChangeName: ChangeEventHandler<HTMLInputElement>;
  onClearDescription: () => void;
  onClearName: () => void;
  onClose: () => void;
  onSubmit: () => void;
};

type ScrapFolderEditFieldProps = {
  clearAriaLabel: string;
  disabled: boolean;
  label: string;
  maxLength: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  placeholder: string;
  required?: boolean;
  value: string;
};

function ScrapFolderEditClearIcon() {
  return (
    <SvgIcon size={20} viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="currentColor" />
      <path
        d="M7 7L13 13M13 7L7 13"
        fill="none"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </SvgIcon>
  );
}

function ScrapFolderEditField({
  clearAriaLabel,
  disabled,
  label,
  maxLength,
  onChange,
  onClear,
  placeholder,
  required = false,
  value,
}: ScrapFolderEditFieldProps) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="flex h-5 items-center text-[14px] font-semibold leading-[1.4] tracking-[0.015em] text-[#292B2C]">
        {label}
        {required ? <span className="ml-0.5 text-[#FF5E47]">*</span> : null}
        {!required ? <span className="text-[#BFC4C8]">(선택)</span> : null}
      </span>

      <span className="flex h-12 items-center rounded-xl bg-[#F5F7FA] px-2 py-3">
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-base font-normal leading-[1.4] text-[#292B2C] outline-none placeholder:text-[#BFC4C8] disabled:text-[#8A9299]"
        />
        {value ? (
          <button
            type="button"
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-[#BFC4C8]"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onClear}
            aria-label={clearAriaLabel}
          >
            <ScrapFolderEditClearIcon />
          </button>
        ) : null}
        <span className="ml-3 shrink-0 text-[14px] font-normal leading-[1.4]" aria-label={`${value.length}/${maxLength}`}>
          <span className="text-[#565656]">{value.length}</span>
          <span className="text-[#BFC4C8]">/{maxLength}</span>
        </span>
      </span>
    </label>
  );
}

export function ScrapFolderEditBottomSheet({
  description,
  descriptionMaxLength,
  errorMessage,
  folderName,
  isOpen,
  isPending,
  isSubmitDisabled,
  name,
  nameMaxLength,
  onChangeDescription,
  onChangeName,
  onClearDescription,
  onClearName,
  onClose,
  onSubmit,
}: ScrapFolderEditBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      title="폴더명 수정"
      type="center"
      onClose={onClose}
      footerClassName="pb-[max(60px,env(safe-area-inset-bottom))]"
      footer={
        <button
          type="button"
          className={[
            'h-14 w-full rounded-xl text-base font-semibold leading-none tracking-[0.015em]',
            isSubmitDisabled ? 'border border-[#DCDFE2] bg-[#EBEDF0] text-[#BFC4C8]' : 'bg-[#31FFCC] text-[#292B2C]',
          ].join(' ')}
          disabled={isSubmitDisabled}
          onClick={onSubmit}
        >
          {isPending ? <LoadingSpinner ariaLabel="폴더 수정 중" className="h-5 w-5" /> : '저장'}
        </button>
      }
    >
      <div className="flex h-[284px] w-full flex-col gap-5 px-4">
        <p className="sr-only">{folderName} 폴더 정보를 수정합니다.</p>
        <ScrapFolderEditField
          disabled={isPending}
          label="폴더명"
          required
          value={name}
          maxLength={nameMaxLength}
          placeholder="폴더명을 입력해주세요"
          onChange={onChangeName}
          onClear={onClearName}
          clearAriaLabel="폴더명 입력 지우기"
        />
        <ScrapFolderEditField
          disabled={isPending}
          label="설명"
          value={description}
          maxLength={descriptionMaxLength}
          placeholder="메모를 작성해주세요."
          onChange={onChangeDescription}
          onClear={onClearDescription}
          clearAriaLabel="설명 입력 지우기"
        />
        {errorMessage ? (
          <p className="-mt-2 text-sm font-medium leading-[1.4] text-[#FF5E47]" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </BottomSheet>
  );
}
