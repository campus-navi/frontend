import type { OfficialPostDetail } from '@/api/modules/officialPost';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { hasOfficialPostRequiredDocuments } from '@/features/official-posts/utils/officialPostApplication';

type OfficialPostDetailsProps = {
  post: Pick<OfficialPostDetail, 'eligibility' | 'endDate' | 'endTime' | 'requiredDocuments' | 'startDate' | 'startTime'>;
};

export function OfficialPostDetails({ post }: OfficialPostDetailsProps) {
  const requiredDocuments = hasOfficialPostRequiredDocuments(post.requiredDocuments) ? post.requiredDocuments : null;

  return (
    <section className="bg-white px-4 py-3" aria-labelledby="official-post-details-title">
      <h2 id="official-post-details-title" className="sr-only">
        상세 정보
      </h2>
      <dl className="flex flex-col gap-2">
        <DetailRow label="신청일시" suffix="부터" value={formatDateTime(post.startDate, post.startTime)} />
        <DetailRow label="신청마감" suffix="까지" value={formatDateTime(post.endDate, post.endTime)} />
        {requiredDocuments ? <DetailRow label="제출서류" value={requiredDocuments} /> : null}
        <DetailRow isLink label="지원자격" value={post.eligibility ? '자세히 보기' : '-'} />
      </dl>
    </section>
  );
}

function DetailRow({
  isLink = false,
  label,
  suffix,
  value,
}: {
  isLink?: boolean;
  label: string;
  suffix?: string;
  value: string;
}) {
  return (
    <div className="flex h-[22px] items-center justify-between gap-4 text-[14px] font-medium leading-[1.4] tracking-normal">
      <dt className="flex shrink-0 items-center gap-1 text-[#707376]">
        <span className="h-4 w-4 rounded-[2px] bg-[#F1F1F1]" aria-hidden="true" />
        <span>{label}</span>
      </dt>
      <dd className="flex min-w-0 items-center gap-0.5 text-right text-[#292B2C]">
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
      </dd>
    </div>
  );
}

function formatDateTime(date: string | null, time: string | null) {
  return [date, time].filter(Boolean).join(' ') || '-';
}
