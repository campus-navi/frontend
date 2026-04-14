import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { universityApi } from '@/api';
import { isApiError } from '@/api/errors';
import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';

type SearchResult = Awaited<ReturnType<typeof universityApi.search>>;

export default function ApiUniversityTestPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSearch() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await universityApi.search(keyword.trim() ? { keyword: keyword.trim() } : undefined);
      setResult(response);
    } catch (error) {
      setResult(null);
      setErrorMessage(isApiError(error) ? `[${error.code}] ${error.message}` : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="대학 API 테스트" onBack={() => navigate(-1)} />

        <section className="flex flex-1 flex-col gap-5 px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-6">
          <div className="space-y-2">
            <h2 className="text-[24px] font-bold tracking-[-0.03em] text-[#2B2B2B]">공통 API 연동 확인</h2>
            <p className="text-[14px] leading-6 text-[#6D6D6D]">
              대학 검색 API를 호출해서 로딩, 성공 응답, 에러 응답을 한 화면에서 확인할 수 있습니다.
            </p>
          </div>

          <label className="space-y-2">
            <span className="text-[14px] font-semibold text-[#3D3D3D]">검색어</span>
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="예: 서울, 연세, 고려"
              className="h-14 w-full rounded-[8px] border border-[#D9D9D9] px-4 text-[#202020] placeholder:text-[#B6B6B6] focus:border-[#565656] focus:outline-none"
            />
          </label>

          <CtaButton active={!isLoading} disabled={isLoading} onClick={handleSearch}>
            {isLoading ? '조회 중...' : '대학 API 호출'}
          </CtaButton>

          {errorMessage ? (
            <div className="rounded-[8px] border border-[#F0C7C7] bg-[#FFF7F7] px-4 py-3 text-[14px] leading-6 text-[#C13D3D]">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex-1 rounded-[12px] bg-[#F7F7F7] p-4">
            <p className="mb-3 text-[14px] font-semibold text-[#3D3D3D]">응답 미리보기</p>
            <pre className="overflow-x-auto whitespace-pre-wrap break-all text-[13px] leading-6 text-[#4A4A4A]">
              {result ? JSON.stringify(result, null, 2) : '아직 응답이 없습니다.'}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
