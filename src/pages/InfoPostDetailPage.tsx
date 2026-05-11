import { useParams } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';

function parsePostId(value: string | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue || !/^[1-9]\d*$/.test(normalizedValue)) {
    return null;
  }

  const postId = Number(normalizedValue);

  return Number.isInteger(postId) && postId > 0 ? postId : null;
}

export default function InfoPostDetailPage() {
  const { postId: postIdParam } = useParams();
  const postId = parsePostId(postIdParam);

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="교내정보" />

        <section className="flex flex-1 flex-col justify-center px-5 py-10 text-center">
          <p className="text-[14px] font-medium leading-[1.4] text-[#9D9D9D]">
            교내정보 글 상세
          </p>
          <h1 className="mt-3 text-[24px] font-bold leading-[1.4] text-[#292B2C]">
            상세 페이지 준비 중
          </h1>
          {postId === null ? (
            <p className="mt-4 text-[16px] font-medium leading-[1.5] text-[#565656]">
              올바른 교내정보 글을 찾을 수 없어요.
            </p>
          ) : (
            <p className="mt-4 text-[16px] font-medium leading-[1.5] text-[#565656]">
              postId: {postId}
            </p>
          )}
          <p className="mt-2 text-[14px] font-normal leading-[1.5] text-[#9D9D9D]">
            상세 API 연동 후 공지 본문과 첨부파일 정보를 표시할 예정이에요.
          </p>
        </section>
      </div>
    </main>
  );
}
