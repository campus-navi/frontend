import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';
import { AcademicPlanExitModal } from '@/features/academic-plans/components/AcademicPlanExitModal';
import {
  ACADEMIC_PLAN_MAX_SECTION_LENGTH,
  getAcademicPlanEditorRouteState,
  getAcademicPlanSectionConfig,
} from '@/features/academic-plans/academicPlanEditorState';

export function AcademicPlanSectionInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const editorState = getAcademicPlanEditorRouteState(location.state);
  const sectionConfig = getAcademicPlanSectionConfig(sectionId);
  const [value, setValue] = useState(() => {
    if (!editorState || !sectionConfig) {
      return '';
    }

    return editorState.sections[sectionConfig.id].value;
  });
  const trimmedValue = value.trim();
  const isSaveEnabled = trimmedValue.length > 0;

  useEffect(() => {
    if (!editorState || !sectionConfig) {
      navigate('/studio/academic-plans/target', { replace: true });
    }
  }, [editorState, navigate, sectionConfig]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  if (!editorState || !sectionConfig) {
    return null;
  }

  const handleChange = (nextValue: string) => {
    setValue(nextValue.slice(0, ACADEMIC_PLAN_MAX_SECTION_LENGTH));
  };

  const handleSave = () => {
    if (!isSaveEnabled) {
      return;
    }

    navigate('/studio/academic-plans/editor', {
      replace: true,
      state: {
        ...editorState,
        sections: {
          ...editorState.sections,
          [sectionConfig.id]: {
            isSaved: true,
            value,
          },
        },
      },
    });
  };
  const handleExit = () => {
    navigate('/studio/academic-plans/editor', { replace: true, state: editorState });
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader
          onBack={() => setIsExitModalOpen(true)}
          rightSlot={
            <button
              type="button"
              disabled={!isSaveEnabled}
              onClick={handleSave}
              className={[
                'h-10 px-1 text-[16px] font-semibold leading-none transition-colors',
                isSaveEnabled ? 'text-[#292B2C]' : 'cursor-not-allowed text-[#BFC4C8]',
              ].join(' ')}
            >
              저장
            </button>
          }
        />

        <section className="flex min-h-0 flex-1 flex-col px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-12">
          <h1 className="text-[22px] font-bold leading-[25px] text-[#292B2C]">{sectionConfig.title}</h1>
          <p className="mt-4 text-[15px] font-medium leading-[22px] text-[#BFC4C8]">
            {sectionConfig.description}
          </p>

          <div className="mt-4 flex h-9 items-center justify-end text-[15px] font-medium leading-5 text-[#BFC4C8]">
            <span>{value.length}</span>
            <span>/</span>
            <span>{ACADEMIC_PLAN_MAX_SECTION_LENGTH}</span>
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            maxLength={ACADEMIC_PLAN_MAX_SECTION_LENGTH}
            onChange={(event) => handleChange(event.target.value)}
            className="mt-2 min-h-0 flex-1 resize-none border-0 bg-transparent text-[17px] font-medium leading-7 text-[#292B2C] outline-none placeholder:text-[#C7CCD1]"
            aria-label={`${sectionConfig.title} 입력`}
          />
        </section>
      </div>
      <AcademicPlanExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onExit={handleExit}
        variant="leave"
      />
    </main>
  );
}
