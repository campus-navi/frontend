import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  academicPlanApi,
  isApiError,
  type AcademicPlanDocumentSectionKey,
  type CreateAcademicPlanDocumentRequest,
} from '@/api';
import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';
import { AcademicPlanExitModal } from '@/features/academic-plans/components/AcademicPlanExitModal';
import {
  academicPlanSectionConfigs,
  getAcademicPlanEditorRouteState,
} from '@/features/academic-plans/academicPlanEditorState';
import type { AcademicPlanEditorRouteState, AcademicPlanSectionId } from '@/features/academic-plans/types';
import { useMyPageSummary } from '@/features/mypage/hooks/useMyPageSummary';

const academicPlanDocumentSectionKeyMap: Record<AcademicPlanSectionId, AcademicPlanDocumentSectionKey> = {
  etc: 'etc',
  interest: 'interest_field',
  motivation: 'application_motive',
  studyPlan: 'study_plan',
};

const academicPlanDraftDocumentSectionKeyMap: Record<AcademicPlanSectionId, AcademicPlanDocumentSectionKey> = {
  etc: 'academic_plan_etc',
  interest: 'interest_field',
  motivation: 'application_motive',
  studyPlan: 'study_plan',
};

function createAcademicPlanDocumentPayload(
  editorState: AcademicPlanEditorRouteState,
  sectionKeyMap: Record<AcademicPlanSectionId, AcademicPlanDocumentSectionKey> = academicPlanDocumentSectionKeyMap,
): CreateAcademicPlanDocumentRequest {
  return {
    majorType: editorState.selectedPlanType,
    sections: academicPlanSectionConfigs
      .filter((section) => editorState.sections[section.id].isSaved)
      .map((section) => ({
        content: editorState.sections[section.id].value.trim(),
        sectionKey: sectionKeyMap[section.id],
      }))
      .filter((section) => section.content.length > 0),
    targetId: editorState.selectedTargetId,
  };
}

function getDraftSaveErrorMessage(error: unknown) {
  if (isApiError(error) && (error.status === 400 || error.status === 404)) {
    return '임시 저장할 수 없어요. 선택한 대상과 작성 내용을 확인해주세요.';
  }

  return '임시 저장에 실패했어요. 잠시 후 다시 시도해주세요.';
}

export function AcademicPlanEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const editorState = getAcademicPlanEditorRouteState(location.state);
  const { data: summary } = useMyPageSummary();
  const createDocumentMutation = useMutation({
    mutationFn: academicPlanApi.createDocument,
  });
  const saveDraftMutation = useMutation({
    mutationFn: academicPlanApi.createDocument,
  });
  const nickname = summary?.nickname?.trim() || '사용자';

  useEffect(() => {
    if (!editorState) {
      navigate('/studio/academic-plans/target', { replace: true });
    }
  }, [editorState, navigate]);

  if (!editorState) {
    return null;
  }

  const handleSectionClick = (sectionId: string) => {
    navigate(`/studio/academic-plans/editor/${sectionId}`, { replace: true, state: editorState });
  };
  const handleExit = (shouldSaveDraft: boolean) => {
    if (saveDraftMutation.isPending) {
      return;
    }

    if (shouldSaveDraft) {
      saveDraftMutation.mutate(createAcademicPlanDocumentPayload(editorState, academicPlanDraftDocumentSectionKeyMap), {
        onSuccess: () => {
          navigate('/studio?tab=documents', { replace: true, state: { showAcademicPlanDraftToast: true } });
        },
      });
      return;
    }

    navigate('/studio', { replace: true });
  };
  const isAnalysisCtaEnabled = academicPlanSectionConfigs
    .filter((section) => section.required)
    .every((section) => editorState.sections[section.id].isSaved);
  const analysisErrorMessage = createDocumentMutation.isError
    ? '학업계획서 분석을 시작하지 못했어요. 잠시 후 다시 시도해주세요.'
    : '';
  const draftSaveErrorMessage = saveDraftMutation.isError
    ? getDraftSaveErrorMessage(saveDraftMutation.error)
    : '';
  const handleAnalysisStart = () => {
    if (!isAnalysisCtaEnabled || createDocumentMutation.isPending) {
      return;
    }

    createDocumentMutation.mutate(createAcademicPlanDocumentPayload(editorState));
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="학업계획서" onBack={() => setIsExitModalOpen(true)} />

        <section className="px-4 pb-[calc(128px+env(safe-area-inset-bottom))] pt-12">
          <h1 className="text-[24px] font-bold leading-[1.42] text-[#292B2C]">
            {nickname}님의 서류양식을
            <br />
            완성해 주세요.
          </h1>

          <div className="mt-10 flex flex-col gap-2.5">
            {academicPlanSectionConfigs.map((section) => {
              const isSaved = editorState.sections[section.id].isSaved;

              return (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className="flex h-[60px] w-full items-center justify-between rounded-[10px] bg-white px-4 text-left shadow-[0_4px_18px_rgba(27,35,45,0.06)]"
                >
                  <span className="text-[16px] font-semibold leading-[22px] text-[#292B2C]">
                    {section.icon} {section.title}
                    {section.required ? <span className="text-[#FF5E47]"> *</span> : null}
                  </span>
                  <span className="flex items-center gap-1">
                    <span
                      className={[
                        'rounded-full px-3 py-1.5 text-[13px] font-semibold leading-none',
                        isSaved ? 'bg-[#EDF1FF] text-[#5576FF]' : 'bg-[#F2F4F6] text-[#292B2C]',
                      ].join(' ')}
                    >
                      {isSaved ? '입력완료' : '미입력'}
                    </span>
                    <span className={isSaved ? 'text-[#292B2C]' : 'text-[#BFC4C8]'} aria-hidden="true">
                      {isSaved ? '›' : '+'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[393px] -translate-x-1/2 bg-white px-4 pb-[max(36px,env(safe-area-inset-bottom))] pt-3">
          {analysisErrorMessage ? (
            <p className="mb-2 text-center text-[14px] font-medium leading-5 text-[#FF5E47]">
              {analysisErrorMessage}
            </p>
          ) : null}
          <CtaButton disabled={!isAnalysisCtaEnabled || createDocumentMutation.isPending} onClick={handleAnalysisStart}>
            분석 시작
          </CtaButton>
        </div>
      </div>
      <AcademicPlanExitModal
        errorMessage={draftSaveErrorMessage}
        isOpen={isExitModalOpen}
        isPending={saveDraftMutation.isPending}
        onClose={() => setIsExitModalOpen(false)}
        onExit={handleExit}
        variant="draft"
      />
    </main>
  );
}
