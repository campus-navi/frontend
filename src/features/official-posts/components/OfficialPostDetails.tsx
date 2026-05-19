import type { OfficialPostDetail } from '@/api/modules/officialPost';
import { SvgIcon } from '@/components/ui/SvgIcon';
import {
  hasOfficialPostDateTime,
  hasOfficialPostRequiredDocuments,
  hasOfficialPostText,
} from '@/features/official-posts/utils/officialPostApplication';

type OfficialPostDetailsProps = {
  post: Pick<OfficialPostDetail, 'eligibility' | 'endDate' | 'endTime' | 'requiredDocuments' | 'startDate' | 'startTime'>;
  onEligibilityClick?: () => void;
};

export function OfficialPostDetails({ post, onEligibilityClick }: OfficialPostDetailsProps) {
  const applicationStart = hasOfficialPostDateTime(post.startDate, post.startTime)
    ? formatDateTime(post.startDate, post.startTime)
    : null;
  const applicationEnd = hasOfficialPostDateTime(post.endDate, post.endTime)
    ? formatDateTime(post.endDate, post.endTime)
    : null;
  const requiredDocuments = hasOfficialPostRequiredDocuments(post.requiredDocuments) ? post.requiredDocuments : null;
  const hasEligibility = hasOfficialPostText(post.eligibility);

  return (
    <section className="bg-white px-4 py-3" aria-labelledby="official-post-details-title">
      <h2 id="official-post-details-title" className="sr-only">
        상세 정보
      </h2>
      <dl className="flex flex-col gap-2">
        {applicationStart ? <DetailRow label="신청일시" suffix="부터" value={applicationStart} /> : null}
        {applicationEnd ? <DetailRow label="신청마감" suffix="까지" value={applicationEnd} /> : null}
        {requiredDocuments ? <DetailRow label="제출서류" value={requiredDocuments} /> : null}
        {hasEligibility ? <DetailRow isLink label="지원자격" value="자세히 보기" onClick={onEligibilityClick} /> : null}
      </dl>
    </section>
  );
}

function DetailRow({
  isLink = false,
  label,
  suffix,
  value,
  onClick,
}: {
  isLink?: boolean;
  label: string;
  suffix?: string;
  value: string;
  onClick?: () => void;
}) {
  const valueContent = (
    <>
      <span className="min-w-0 truncate">{value}</span>
      {suffix ? <span className="shrink-0 text-[#BFC4C8]">{suffix}</span> : null}
      {isLink && value !== '-' ? (
        <SvgIcon className="shrink-0" size={20} viewBox="0 0 20 20">
          <path
            d="m8.75 6.7 3.3 3.3-3.3 3.3"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </SvgIcon>
      ) : null}
    </>
  );

  return (
    <div className="flex h-[22px] items-center justify-between gap-4 text-[14px] font-medium leading-[1.4] tracking-normal">
      <dt className="flex shrink-0 items-center gap-1 text-[#707376]">
        <span className="h-4 w-4 rounded-[2px] bg-[#F1F1F1]" aria-hidden="true" />
        <span>{label}</span>
      </dt>
      <dd className="flex min-w-0 items-center gap-0.5 text-right text-[#292B2C]">
        {isLink ? (
          <button
            type="button"
            className="flex min-w-0 items-center gap-0.5 text-right text-[#292B2C]"
            onClick={onClick}
          >
            {valueContent}
          </button>
        ) : (
          valueContent
        )}
      </dd>
    </div>
  );
}

function formatDateTime(date: string | null, time: string | null) {
  return [date, time].filter(hasOfficialPostText).join(' ');
}
