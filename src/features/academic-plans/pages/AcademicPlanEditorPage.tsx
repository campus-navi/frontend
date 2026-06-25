import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';
import {
  academicPlanSectionConfigs,
  getAcademicPlanEditorRouteState,
} from '@/features/academic-plans/academicPlanEditorState';

export function AcademicPlanEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editorState = getAcademicPlanEditorRouteState(location.state);

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

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="학업계획서" onBack={() => navigate(-1)} />

        <section className="px-4 pb-[calc(128px+env(safe-area-inset-bottom))] pt-12">
          <h1 className="text-[24px] font-bold leading-[1.42] text-[#292B2C]">
            정현우님의 서류양식을
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
          <CtaButton>분석 시작</CtaButton>
        </div>
      </div>
    </main>
  );
}
