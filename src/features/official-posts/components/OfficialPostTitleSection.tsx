import type { OfficialPostDetail } from '@/api/modules/officialPost';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Tags } from '@/components/ui/Tags';

type OfficialPostTitleSectionProps = {
  post: Pick<OfficialPostDetail, 'isNotificationOn' | 'publishedAt' | 'tagName' | 'title'>;
};

export function OfficialPostTitleSection({ post }: OfficialPostTitleSectionProps) {
  return (
    <header className="flex flex-col gap-2 px-4 pb-3 pt-4">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="text-[12px] font-normal leading-[1.4] tracking-normal text-[#6D6D6D]">{post.publishedAt}</p>
          <h1 className="text-[18px] font-medium leading-[1.4] tracking-normal text-[#1A1A1A]">{post.title}</h1>
        </div>

        <button
          type="button"
          className={[
            'flex h-7 w-7 shrink-0 items-center justify-center text-[#BFC4C8]',
            post.isNotificationOn ? 'text-[#292B2C]' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label={post.isNotificationOn ? '알림 설정됨' : '알림 설정 안 됨'}
          aria-pressed={post.isNotificationOn}
        >
          <SvgIcon size={28} viewBox="0 0 28 28">
            <path
              d="M20.5 12.4a6.5 6.5 0 0 0-13 0v3.35l-1.45 2.55a1.05 1.05 0 0 0 .92 1.57h14.06a1.05 1.05 0 0 0 .92-1.57l-1.45-2.55V12.4Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.25"
            />
            <path
              d="M11.45 22.05a2.75 2.75 0 0 0 5.1 0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.25"
            />
          </SvgIcon>
        </button>
      </div>

      <div className="flex w-full items-center gap-1">
        <Tags size="lg" type="primary">
          공지
        </Tags>
        <Tags size="lg" type="tertiary">
          {post.tagName}
        </Tags>
      </div>
    </header>
  );
}
