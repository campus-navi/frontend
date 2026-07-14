import type { StudioDocument } from '@/api';
import { StudioSparkIcon } from '@/features/studio/components/StudioSparkIcon';
import { formatStudioDocumentUpdatedAt } from '@/features/studio/utils/formatStudioDocumentUpdatedAt';

export function StudioDocumentCard({ document, onClick }: { document: StudioDocument; onClick?: () => void }) {
  return (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      className="flex h-[106px] w-full items-center gap-4 rounded-[12px] bg-white px-4 py-3 text-left shadow-[0_0_8px_rgba(0,0,0,0.04)] disabled:cursor-default"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        <StudioSparkIcon />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[16px] font-semibold leading-[1.4] text-[#292B2C]">{document.title}</h3>
              {document.status !== 'COMPLETED' ? (
                <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-[4px] bg-[#FF5E47] px-1 text-[10px] font-bold leading-none text-white">
                  N
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[12px] font-medium leading-[1.4] text-[#707376]">
              {formatStudioDocumentUpdatedAt(document.updatedAt)}
            </p>
          </div>
          {document.status === 'DRAFT' ? (
            <span className="shrink-0 rounded-[6px] bg-[rgba(61,99,232,0.1)] px-2 py-1 text-[12px] font-medium leading-none text-[#3D63E8]">
              임시저장
            </span>
          ) : null}
        </div>

        {document.status === 'ANALYZING' ? (
          <div className="mt-auto flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E8F8F5]">
              <div className="analysis-shimmer-bar h-full w-[86%] rounded-full" />
            </div>
            <span className="text-[12px] font-medium leading-none text-[#0BC798]">분석중</span>
          </div>
        ) : (
          <div className="mt-auto flex min-w-0 gap-1">
            <span className="truncate rounded-[6px] bg-[#F3F5FA] px-2 py-1 text-[12px] font-medium leading-none text-[#292B2C]">
              {document.metadata.campusName}
            </span>
            <span className="truncate rounded-[6px] bg-[#F3F5FA] px-2 py-1 text-[12px] font-medium leading-none text-[#292B2C]">
              {document.metadata.targetName}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
