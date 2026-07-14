import { useLocation, useNavigate, useParams } from 'react-router-dom';

import type { StudioDocument } from '@/api';
import { AppHeader } from '@/components/ui/AppHeader';

type StudioDocumentAnalyzingRouteState = {
  document?: StudioDocument;
};

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

function getStudioDocumentAnalyzingRouteState(state: unknown): StudioDocumentAnalyzingRouteState {
  if (!state || typeof state !== 'object') {
    return {};
  }

  const partialState = state as Partial<StudioDocumentAnalyzingRouteState>;

  return partialState.document ? { document: partialState.document } : {};
}

function formatAnalyzingDocumentDate(value: string | undefined) {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return '방금전';
  }

  const isAfternoon = date.getHours() >= 12;
  const hour = date.getHours() % 12 || 12;
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${date.getMonth() + 1}.${date.getDate()}(${weekdays[date.getDay()]}) ${isAfternoon ? '오후' : '오전'} ${hour}:${minute}`;
}

function SkeletonParagraph({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-3 rounded-full bg-[#EEF1F4]"
          style={{ width: index === lines - 1 ? '63%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function StudioDocumentAnalyzingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { documentId } = useParams();
  const { document } = getStudioDocumentAnalyzingRouteState(location.state);

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="학업계획서" onBack={() => navigate('/studio?tab=documents')} />

        <section className="px-5 pb-[180px] pt-3">
          <p className="text-[12px] font-medium leading-[17px] text-[#8F969D]">
            {formatAnalyzingDocumentDate(document?.updatedAt)}
          </p>
          <h1 className="mt-1 text-[20px] font-bold leading-7 text-[#292B2C]">검출된 팩트 오류</h1>
          <div className="mt-1.5 h-[31px] w-[75px] rounded-[8px] bg-[#EEF1F4]" />
        </section>

        <section className="flex flex-1 flex-col gap-7 px-4 pb-[180px] pt-2" aria-label="분석 중 본문">
          <SkeletonParagraph />
          <SkeletonParagraph lines={4} />
          <SkeletonParagraph />
          <SkeletonParagraph />
          <SkeletonParagraph />
        </section>

        <div className="fixed bottom-[max(24px,env(safe-area-inset-bottom))] left-1/2 z-30 w-full max-w-[393px] -translate-x-1/2 px-4">
          <div className="rounded-[16px] bg-[#101112] px-4 pb-4 pt-5 text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold leading-none">분석 중...</span>
              <span className="min-w-[40px] text-right text-[15px] font-semibold leading-none text-[#31FFCC]">
                50%
              </span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#34383D]">
              <div className="h-full w-1/2 rounded-full bg-[#31FFCC]" />
            </div>
            <p className="mt-4 text-[12px] font-medium leading-[18px] text-[#D7DBDF]">
              문서 분석 완료되기 전에 화면을 닫거나, 앱을 종료하는 경우 분석이 중단될 수 있습니다.
            </p>
            {documentId ? (
              <p className="mt-2 text-[11px] font-medium leading-none text-[#777E86]">문서 ID {documentId}</p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
