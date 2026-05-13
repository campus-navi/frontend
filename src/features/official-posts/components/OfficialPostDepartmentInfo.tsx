import type { ReactNode } from 'react';

import type { OfficialPostDetail } from '@/api/modules/officialPost';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Tags } from '@/components/ui/Tags';

type OfficialPostDepartmentInfoProps = {
  post: Pick<OfficialPostDetail, 'contactEmail' | 'contactPhone' | 'publisher' | 'sourceUrl'>;
};

export function OfficialPostDepartmentInfo({ post }: OfficialPostDepartmentInfoProps) {
  const publisher = post.publisher?.trim();
  const contactPhone = post.contactPhone?.trim();
  const contactEmail = post.contactEmail?.trim();
  const sourceUrl = post.sourceUrl?.trim();

  return (
    <section className="flex flex-col bg-white" aria-labelledby="official-post-department-title">
      <h2 id="official-post-department-title" className="sr-only">
        관련부서 정보
      </h2>

      <DepartmentSection title="부서">
        <div className="flex flex-wrap items-start gap-2">
          {publisher ? (
            <Tags size="lg" type="tertiary" className="bg-[#F3F5FA]">
              {publisher}
            </Tags>
          ) : (
            <EmptyText />
          )}
        </div>
      </DepartmentSection>

      <DepartmentSection title="문의">
        <div className="flex w-full flex-col items-start gap-1">
          {contactPhone ? <ContactText>{contactPhone}</ContactText> : null}
          {contactEmail ? <ContactText>{contactEmail}</ContactText> : null}
          {!contactPhone && !contactEmail ? <EmptyText /> : null}
        </div>
      </DepartmentSection>

      <DepartmentSection title="원문 링크">
        {sourceUrl ? (
          <a
            className="flex w-full items-center justify-between gap-4 text-[14px] font-normal leading-[1.4] tracking-normal text-[#565656]"
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="min-w-0 truncate">사이트 이동하기</span>
            <span className="flex h-[22px] shrink-0 items-center text-[#292B2C]" aria-hidden="true">
              <ChevronRightIcon />
            </span>
          </a>
        ) : (
          <EmptyText />
        )}
      </DepartmentSection>
    </section>
  );
}

function DepartmentSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="flex flex-col items-start justify-center gap-2 px-4 py-6">
      <h3 className="text-[16px] font-semibold leading-[1.4] tracking-normal text-[#292B2C]">{title}</h3>
      {children}
    </section>
  );
}

function ContactText({ children }: { children: string }) {
  return (
    <p className="w-full break-words text-[14px] font-normal leading-[1.4] tracking-normal text-[#565656]">
      {children}
    </p>
  );
}

function EmptyText() {
  return <p className="text-[14px] font-normal leading-[1.4] tracking-normal text-[#BFC4C8]">정보가 없어요.</p>;
}

function ChevronRightIcon() {
  return (
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
  );
}
