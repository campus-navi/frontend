import type { StudioDocument } from '@/api';
import { StudioSparkIcon } from '@/features/studio/components/StudioSparkIcon';
import { formatStudioDocumentUpdatedAt } from '@/features/studio/utils/formatStudioDocumentUpdatedAt';

export function StudioDocumentCard({ document }: { document: StudioDocument }) {
  return (
    <article className="flex h-[106px] rounded-[10px] bg-white px-3 py-4 shadow-[0_6px_22px_rgba(25,31,40,0.06)]">
      <div className="pt-[17px]">
        <StudioSparkIcon />
      </div>
      <div className="ml-4 flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[17px] font-bold leading-[22px] text-[#292B2C]">{document.title}</h3>
              {document.status !== 'COMPLETED' ? (
                <span className="rounded-[5px] bg-[#FF5E47] px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
                  N
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[13px] font-medium leading-[17px] text-[#7E858C]">
              {formatStudioDocumentUpdatedAt(document.updatedAt)}
            </p>
          </div>
          {document.status === 'DRAFT' ? (
            <span className="rounded-[6px] bg-[#EDF1FF] px-2 py-1 text-[13px] font-semibold leading-none text-[#5576FF]">
              임시저장
            </span>
          ) : null}
        </div>

        {document.status === 'ANALYZING' ? (
          <div className="mt-auto flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E8F8F5]">
              <div className="h-full w-[86%] rounded-full bg-[#31E7BC]" />
            </div>
            <span className="text-[13px] font-semibold leading-none text-[#00B88D]">분석중</span>
          </div>
        ) : (
          <div className="mt-auto flex gap-1">
            <span className="rounded-[5px] bg-[#F2F4F6] px-1.5 py-1 text-[12px] font-medium leading-none text-[#59616A]">
              {document.metadata.campusName}
            </span>
            <span className="rounded-[5px] bg-[#F2F4F6] px-1.5 py-1 text-[12px] font-medium leading-none text-[#59616A]">
              {document.metadata.targetName}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
