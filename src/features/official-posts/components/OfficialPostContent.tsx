import { useMemo } from 'react';

import type { OfficialPostDetail } from '@/api/modules/officialPost';

type OfficialPostContentProps = {
  post: Pick<OfficialPostDetail, 'contactEmail' | 'contactPhone' | 'contentHtml' | 'publisher' | 'sourceUrl'>;
};

export function OfficialPostContent({ post }: OfficialPostContentProps) {
  const contentText = useMemo(() => getTextFromHtml(post.contentHtml), [post.contentHtml]);

  return (
    <section className="flex flex-col gap-4 px-4 py-5" aria-labelledby="official-post-content-title">
      <h2 id="official-post-content-title" className="sr-only">
        공지사항 본문
      </h2>

      <div className="flex flex-col gap-3 text-[14px] font-normal leading-[1.7] text-[#292B2C]">
        <p className="whitespace-pre-line">{contentText || '본문 내용이 없어요.'}</p>
      </div>

     
    </section>
  );
}


function getTextFromHtml(contentHtml: string) {
  if (!contentHtml.trim()) {
    return '';
  }

  if (typeof DOMParser === 'undefined') {
    return contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const parsedDocument = new DOMParser().parseFromString(contentHtml, 'text/html');

  return parsedDocument.body.textContent?.replace(/\n{3,}/g, '\n\n').trim() ?? '';
}