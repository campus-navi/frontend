import { useNavigate, useParams } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';

function parsePostId(value: string | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue || !/^[1-9]\d*$/.test(normalizedValue)) {
    return null;
  }

  const postId = Number(normalizedValue);

  return Number.isInteger(postId) && postId > 0 ? postId : null;
}

export default function CardNewsDetailPage() {
  const navigate = useNavigate();
  const { postId: postIdParam } = useParams();
  const postId = parsePostId(postIdParam);

  const handleNoticeDetailClick = () => {
    if (postId === null) {
      return;
    }

    navigate(`/info/posts/${postId}`);
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="카드뉴스" />

        <section className="flex flex-1 flex-col justify-center px-5 py-10 text-center">
          <p className="text-[14px] font-medium leading-[1.4] text-[#9D9D9D]">
            카드뉴스 상세 페이지
          </p>
          <h1 className="mt-3 text-[24px] font-bold leading-[1.4] text-[#292B2C]">
            {postId === null ? '올바른 카드뉴스를 찾을 수 없어요.' : `postId: ${postId}`}
          </h1>
          <p className="mt-4 text-[16px] font-medium leading-[1.5] text-[#565656]">
            카드뉴스 상세 UI는 후속 이슈에서 구현됩니다.
          </p>
          {postId !== null ? (
            <button
              type="button"
              className="mt-8 flex h-12 items-center justify-center rounded-[10px] bg-[#292B2C] px-4 text-[16px] font-medium leading-none text-white"
              onClick={handleNoticeDetailClick}
            >
              공지 자세히 보기
            </button>
          ) : null}
        </section>
      </div>
    </main>
  );
}
