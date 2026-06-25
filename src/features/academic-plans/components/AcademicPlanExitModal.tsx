import { useState } from 'react';

import { CtaButton } from '@/components/ui/CtaButton';
import { DimmedOverlay } from '@/components/ui/DimmedOverlay';
import { useBodyScrollLock } from '@/components/ui/useBodyScrollLock';

type AcademicPlanExitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onExit: (shouldSaveDraft: boolean) => void;
};

export function AcademicPlanExitModal({ isOpen, onClose, onExit }: AcademicPlanExitModalProps) {
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
        className="flex w-full max-w-[353px] flex-col rounded-[28px] bg-white px-5 pb-5 pt-6 shadow-[0_20px_48px_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="academic-plan-exit-modal-title"
          className="text-center text-[18px] font-semibold leading-[1.4] text-[#292B2C]"
        >
          임시 저장
        </h2>
        <p className="mt-6 whitespace-pre-line text-center text-[16px] font-medium leading-[1.4] text-[#5E5E5E]">
          저장하지 않고 나가시면
          {'\n'}
          현재 작성 중인 내용은 반영되지 않습니다.
        </p>

        <label className="mx-auto mt-6 flex h-6 items-center justify-center gap-2">
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

        <div className="mt-6 flex gap-2">
          <CtaButton variant="tertiary" size="md" onClick={onClose}>
            취소
          </CtaButton>
          <CtaButton variant="primary" size="md" onClick={() => onExit(shouldSaveDraft)}>
            나가기
          </CtaButton>
        </div>
      </div>
    </DimmedOverlay>
  );
}
