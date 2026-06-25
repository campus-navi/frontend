import { useState } from 'react';

import { CtaButton } from '@/components/ui/CtaButton';
import { DimmedOverlay } from '@/components/ui/DimmedOverlay';
import { useBodyScrollLock } from '@/components/ui/useBodyScrollLock';

type AcademicPlanExitModalVariant = 'draft' | 'leave';

type AcademicPlanExitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onExit: (shouldSaveDraft: boolean) => void;
  variant?: AcademicPlanExitModalVariant;
};

export function AcademicPlanExitModal({
  isOpen,
  onClose,
  onExit,
  variant = 'draft',
}: AcademicPlanExitModalProps) {
  const [shouldSaveDraft, setShouldSaveDraft] = useState(false);
  useBodyScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <DimmedOverlay
      className="fixed inset-0 z-[70] flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="academic-plan-exit-modal-title"
      onClick={onClose}
    >
      <div
        className={[
          'relative flex w-full max-w-[353px] flex-col bg-white shadow-[0_20px_48px_rgba(0,0,0,0.18)]',
          variant === 'leave' ? 'rounded-[22px] px-4 pb-4 pt-6' : 'rounded-[28px] px-5 pb-5 pt-6',
        ].join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        {variant === 'leave' ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center text-[28px] font-light leading-none text-[#292B2C]"
            aria-label="닫기"
          >
            ×
          </button>
        ) : null}
        <h2
          id="academic-plan-exit-modal-title"
          className={[
            'text-center font-semibold text-[#292B2C]',
            variant === 'leave' ? 'text-[16px] leading-[22px]' : 'text-[18px] leading-[1.4]',
          ].join(' ')}
        >
          {variant === 'leave' ? '나가기' : '임시 저장'}
        </h2>
        <p
          className={[
            'whitespace-pre-line text-center font-medium',
            variant === 'leave'
              ? 'mt-7 text-[14px] leading-[20px] text-[#292B2C]'
              : 'mt-6 text-[16px] leading-[1.4] text-[#5E5E5E]',
          ].join(' ')}
        >
          저장하지 않고 나가시면
          {'\n'}
          현재 작성 중인 내용은 반영되지 않습니다.
        </p>

        {variant === 'draft' ? (
          <label className="mx-auto mt-6 flex h-6 items-center justify-center gap-2 whitespace-nowrap">
            <input
              type="checkbox"
              checked={shouldSaveDraft}
              onChange={(event) => setShouldSaveDraft(event.target.checked)}
              className="sr-only"
            />
            <span
              className={[
                'flex h-6 min-h-6 max-h-6 w-6 min-w-6 max-w-6 shrink-0 items-center justify-center rounded-full border-[1.25px]',
                shouldSaveDraft ? 'border-transparent bg-[#292B2C]' : 'border-[#DCDFE2] bg-white',
              ].join(' ')}
              aria-hidden="true"
            >
              {shouldSaveDraft ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
            </span>
            <span className="text-[16px] font-semibold leading-none text-[#292B2C]">임시 저장하고 나가기</span>
          </label>
        ) : null}

        <div className="mt-6 flex gap-2">
          <CtaButton variant="tertiary" size="md" onClick={onClose}>
            취소
          </CtaButton>
          <CtaButton variant="primary" size="md" onClick={() => onExit(variant === 'draft' && shouldSaveDraft)}>
            나가기
          </CtaButton>
        </div>
      </div>
    </DimmedOverlay>
  );
}
