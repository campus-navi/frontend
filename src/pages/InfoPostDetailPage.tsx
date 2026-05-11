import { useParams } from 'react-router-dom';

import { isApiError } from '@/api';
import { AppHeader } from '@/components/ui/AppHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useOfficialPostDetail } from '@/features/info/hooks/useOfficialPostDetail';

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
  const {
    data: post,
    error,
    isError,
    isLoading,
  } = useOfficialPostDetail(postId);
  const errorMessage = getDetailErrorMessage(error, postId);

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="교내정보" />

        {postId === null || isError ? <DetailMessage message={errorMessage} /> : null}
        {isLoading ? <DetailLoading /> : null}
        {post ? (
          <article className="flex flex-1 flex-col gap-6 px-5 py-6">
            <header className="flex flex-col gap-3">
              <span className="w-fit rounded-lg bg-[#F1F3F5] px-2.5 py-1 text-[13px] font-semibold leading-[1.4] text-[#565656]">
                {post.tagName}
              </span>
              <h1 className="text-[24px] font-bold leading-[1.35] text-[#292B2C]">
                {post.title}
              </h1>
              <div className="flex flex-col gap-1 text-[13px] font-normal leading-[1.5] text-[#767676]">
                <p>{post.publisher}</p>
                <p>{post.publishedAt}</p>
              </div>
              <div className="flex gap-2 text-[13px] font-medium leading-[1.4] text-[#565656]">
                <span>스크랩 {formatBoolean(post.isScrapped)}</span>
                <span aria-hidden="true">/</span>
                <span>알림 {formatBoolean(post.isNotificationOn)}</span>
              </div>
            </header>

            <section className="flex flex-col gap-2 border-y border-[#ECEEF0] py-4">
              <DetailRow label="시작" value={formatDateTime(post.startDate, post.startTime)} />
              <DetailRow label="종료" value={formatDateTime(post.endDate, post.endTime)} />
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-[16px] font-semibold leading-[1.4] text-[#292B2C]">요약</h2>
              <p className="whitespace-pre-line text-[15px] font-normal leading-[1.6] text-[#565656]">
                {post.summary || '요약이 없어요.'}
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-[16px] font-semibold leading-[1.4] text-[#292B2C]">본문</h2>
              <p className="text-[15px] font-normal leading-[1.6] text-[#9D9D9D]">
                본문 내용은 상세 UI 작업에서 표시할 예정입니다.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-[16px] font-semibold leading-[1.4] text-[#292B2C]">원문</h2>
              {post.sourceUrl ? (
                <a
                  className="break-all text-[15px] font-normal leading-[1.5] text-[#007AFF] underline"
                  href={post.sourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {post.sourceUrl}
                </a>
              ) : (
                <p className="text-[15px] font-normal leading-[1.5] text-[#9D9D9D]">원문 링크가 없어요.</p>
              )}
            </section>

            <section className="flex flex-col gap-2 pb-8">
              <h2 className="text-[16px] font-semibold leading-[1.4] text-[#292B2C]">첨부파일</h2>
              {post.attachments.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {post.attachments.map((attachment) => (
                    <li
                      key={attachment.id}
                      className="rounded-lg border border-[#ECEEF0] px-3 py-2 text-[14px] font-normal leading-[1.5] text-[#565656]"
                    >
                      {attachment.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[15px] font-normal leading-[1.5] text-[#9D9D9D]">첨부파일이 없어요.</p>
              )}
            </section>
          </article>
        ) : null}
      </div>
    </main>
  );
}

function DetailLoading() {
  return (
    <section className="flex flex-1 items-center justify-center px-5 py-10">
      <LoadingSpinner ariaLabel="교내정보 글을 불러오는 중" className="h-8 w-8 text-[#292B2C]" />
    </section>
  );
}

function DetailMessage({ message }: { message: string }) {
  return (
    <section className="flex flex-1 items-center justify-center px-5 py-10 text-center">
      <p className="text-[16px] font-medium leading-[1.5] text-[#565656]">{message}</p>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-[14px] leading-[1.5]">
      <span className="w-10 shrink-0 font-semibold text-[#292B2C]">{label}</span>
      <span className="min-w-0 flex-1 font-normal text-[#565656]">{value}</span>
    </div>
  );
}

function formatDateTime(date: string | null, time: string | null) {
  return [date, time].filter(Boolean).join(' ') || '-';
}

function formatBoolean(value: boolean) {
  return value ? 'ON' : 'OFF';
}

function getDetailErrorMessage(error: unknown, postId: number | null) {
  if (postId === null) {
    return '교내정보 글을 찾을 수 없어요.';
  }

  if (isApiError(error) && error.status === 404) {
    return '교내정보 글을 찾을 수 없어요.';
  }

  if (isApiError(error) && error.status === 425) {
    return '아직 정보를 정리하는 중이에요. 잠시 후 다시 확인해주세요.';
  }

  return '교내정보 글을 불러오지 못했어요.';
}
