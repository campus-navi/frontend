import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import type { AcademicPlanType, StudioDocument } from '@/api';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { academicPlanTypeOptions } from '@/features/academic-plans/view-models/useAcademicPlanTargetSelectionViewModel';
import { StudioAnalysisInProgressToast } from '@/features/studio/components/StudioAnalysisInProgressToast';
import { StudioDocumentsView } from '@/features/studio/components/StudioDocumentsView';
import { StudioDraftToast } from '@/features/studio/components/StudioDraftToast';
import { StudioTabButton } from '@/features/studio/components/StudioTabButton';
import { StudioToolsView } from '@/features/studio/components/StudioToolsView';
import {
  getMockAnalyzingDocuments,
  upsertMockAnalyzingDocument,
} from '@/features/studio/mockAnalyzingDocumentStorage';
import { useStudioDocumentsViewModel } from '@/features/studio/view-models/useStudioDocumentsViewModel';

type StudioTab = 'tools' | 'documents';
type StudioRouteState = {
  analyzingDocument?: StudioDocument;
  analyzingDocuments?: StudioDocument[];
  showAnalysisInProgressToast?: boolean;
  showAcademicPlanDraftToast?: boolean;
  showAcademicPlanSavedWithoutAnalysisToast?: boolean;
};

function isStudioRouteState(state: unknown): state is StudioRouteState {
  return typeof state === 'object' && state !== null;
}

export function StudioPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<StudioTab>(() =>
    searchParams.get('tab') === 'documents' ? 'documents' : 'tools',
  );
  const [isPlanTypeSheetOpen, setIsPlanTypeSheetOpen] = useState(false);
  const [isDraftToastVisible, setIsDraftToastVisible] = useState(false);
  const [isSavedWithoutAnalysisToastVisible, setIsSavedWithoutAnalysisToastVisible] = useState(false);
  const [isAnalysisToastVisible, setIsAnalysisToastVisible] = useState(false);
  const [analyzingDocuments, setAnalyzingDocuments] = useState<StudioDocument[]>(() => getMockAnalyzingDocuments());
  const studioDocumentsViewModel = useStudioDocumentsViewModel({
    analyzingDocuments,
  });

  useEffect(() => {
    if (!isStudioRouteState(location.state)) {
      return;
    }

    if (location.state.showAcademicPlanDraftToast === true) {
      setIsDraftToastVisible(true);
    }

    if (location.state.showAcademicPlanSavedWithoutAnalysisToast === true) {
      setIsSavedWithoutAnalysisToastVisible(true);
    }

    if (location.state.showAnalysisInProgressToast === true) {
      setIsAnalysisToastVisible(true);
    }

    if (location.state.analyzingDocument) {
      const nextDocuments = upsertMockAnalyzingDocument(location.state.analyzingDocument);
      setAnalyzingDocuments(nextDocuments);
    } else if (location.state.analyzingDocuments && location.state.analyzingDocuments.length > 0) {
      setAnalyzingDocuments(location.state.analyzingDocuments);
    }

    navigate(
      {
        pathname: location.pathname,
        search: location.search,
      },
      { replace: true, state: null },
    );
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    if (!isDraftToastVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsDraftToastVisible(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [isDraftToastVisible]);

  useEffect(() => {
    if (!isSavedWithoutAnalysisToastVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsSavedWithoutAnalysisToastVisible(false);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [isSavedWithoutAnalysisToastVisible]);

  useEffect(() => {
    if (!isAnalysisToastVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsAnalysisToastVisible(false);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [isAnalysisToastVisible]);

  const openAcademicPlanFlow = () => {
    setIsPlanTypeSheetOpen(true);
  };

  const selectPlanType = (type: AcademicPlanType) => {
    setIsPlanTypeSheetOpen(false);
    navigate(`/studio/academic-plans/target?type=${type}`);
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[calc(54px+max(32px,env(safe-area-inset-bottom)))]">
        <header className="border-b border-[#DCDFE2] bg-white px-4 pt-[max(32px,env(safe-area-inset-top))]">
          <h1 className="pt-5 text-[22px] font-bold leading-none text-[#111111]">스튜디오</h1>
          <div className="mt-8 flex h-14 items-center gap-8">
            <StudioTabButton selected={activeTab === 'tools'} onClick={() => setActiveTab('tools')}>
              도구
            </StudioTabButton>
            <StudioTabButton selected={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
              내 문서{' '}
              <span className={activeTab === 'documents' ? 'text-[#00C99A]' : ''}>
                {studioDocumentsViewModel.counts.all}
              </span>
            </StudioTabButton>
          </div>
        </header>

        {activeTab === 'tools' ? (
          <StudioToolsView onAcademicPlanClick={openAcademicPlanFlow} />
        ) : (
          <StudioDocumentsView viewModel={studioDocumentsViewModel} />
        )}
      </div>

      <MobileGnb activeItem="studio" />
      <StudioDraftToast isVisible={isDraftToastVisible} />
      <StudioDraftToast
        isVisible={isSavedWithoutAnalysisToastVisible}
        message="문서는 저장됐지만 분석을 시작할 수 없어요. 문서함에서 다시 시도해주세요."
      />
      <StudioAnalysisInProgressToast
        isVisible={isAnalysisToastVisible}
        onOpen={() => {
          const latestAnalyzingDocument = analyzingDocuments[0];

          if (latestAnalyzingDocument) {
            studioDocumentsViewModel.openDocument(latestAnalyzingDocument);
          }
        }}
      />

      <BottomSheet
        isOpen={isPlanTypeSheetOpen}
        title="학업계획서 유형"
        type="center"
        onClose={() => setIsPlanTypeSheetOpen(false)}
      >
        <div className="grid w-full grid-cols-2 gap-3 px-4 pb-[max(56px,env(safe-area-inset-bottom))]">
          {academicPlanTypeOptions.map((option) => (
            <button
              type="button"
              key={option.type}
              onClick={() => selectPlanType(option.type)}
              className="h-14 rounded-[8px] border border-[#DADDE1] bg-white text-[16px] font-semibold leading-none text-[#292B2C]"
            >
              {option.label}
            </button>
          ))}
        </div>
      </BottomSheet>
    </main>
  );
}

