import { SvgIcon } from '@/components/ui/SvgIcon';
import { ToolTip } from '@/components/ui/ToolTip';

type OfficialPostFileProps = {
  count?: number;
  fileName?: string;
  hasTooltip?: boolean;
  type: 'filedetail' | 'files';
};

export function OfficialPostFile({ count = 0, fileName = '첨부파일', hasTooltip = false, type }: OfficialPostFileProps) {
  const isFilesType = type === 'files';

  return (
    <div className="relative flex w-full flex-col items-start rounded-[8px] bg-[#FAFBFD]">
      {hasTooltip ? (
        <div className="absolute right-0 top-[-34px] z-10 flex justify-end">
          <ToolTip className="h-7 rounded-[8px] px-3 py-1 text-[14px] font-normal leading-[1.4]" type="RightDown"
          >
            확인하지 않은 파일들이 있어요!
          </ToolTip>
        </div>
      ) : null}

      <div className={['flex w-full items-center gap-2 rounded-[8px] px-2', isFilesType ? 'py-1.5' : 'py-4'].join(' ')}>
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <FileBlankIcon />
          {isFilesType ? (
            <div className="flex min-w-0 items-center gap-0.5 text-[14px] leading-[1.2]">
              <span className="shrink-0 font-medium text-[#707376]">첨부파일</span>
              <span className="min-w-0 font-bold text-[#292B2C]">{count}개</span>
            </div>
          ) : (
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-[1.2] text-[#707376]">
              {fileName}
            </span>
          )}
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center justify-center rounded-[8px] bg-[#292B2C] px-3 py-2.5 text-[14px] font-semibold leading-none tracking-[0.015em] text-white"
        >
          다운받기
        </button>
      </div>
    </div>
  );
}

function FileBlankIcon() {
  return (
    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center text-[#707376]" aria-hidden="true">
      <SvgIcon size={24} viewBox="0 0 24 24">
        <path
          d="M7.5 4.75h6.15L17 8.1v11.15H7.5V4.75Z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
        <path
          d="M13.5 5v3.45h3.35"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      </SvgIcon>
    </span>
  );
}
