import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';

export default function NoticeInterestsCompletePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader title="맞춤 설정" />

        <section className="flex flex-1 flex-col items-center px-5 pb-[148px] pt-24 text-center">
          <div className="flex h-40 w-40 items-center justify-center">
            <svg
              aria-hidden="true"
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[120px] w-[120px]"
            >
              <path
                d="M67.9666 51.0333C69.1279 50.7221 70.1905 51.7848 69.8794 52.9461L57.7832 98.0896C57.3321 99.7732 54.8799 99.5647 54.7195 97.8292L52.1614 70.1626C52.0922 69.4137 51.499 68.8205 50.75 68.7513L23.0835 66.1932C21.348 66.0327 21.1395 63.5806 22.8231 63.1295L67.9666 51.0333Z"
                fill="#292B2C"
              />
              <path
                d="M52.5544 68.9154C51.3983 69.2214 50.3357 68.1587 50.6416 67.0026L62.5356 22.0613C62.9792 20.3853 65.4234 20.6016 65.5895 22.3316L68.2362 49.9095C68.3079 50.656 68.9011 51.2492 69.6476 51.3208L97.2254 53.9676C98.9554 54.1336 99.1718 56.5778 97.4958 57.0214L52.5544 68.9154Z"
                fill="#292B2C"
              />
            </svg>
          </div>
          <h1 className="mt-3 whitespace-pre-line text-[24px] font-bold leading-[1.4] tracking-normal text-[#202020]">
            맞춤 설정 완료!
          </h1>
          <p className="mt-2 whitespace-pre-line text-[16px] font-medium leading-[1.5] tracking-normal text-[#5E5E5E]">
            {'이제 나에게 꼭 필요한 공지만\n쏙쏙 골라 드릴게요.'}
          </p>
        </section>

        <div className="absolute bottom-0 left-0 right-0 flex h-32 flex-col justify-center px-4 pb-[max(60px,env(safe-area-inset-bottom))] pt-3">
          <CtaButton
            type="button"
            variant="primary"
            state="default"
            size="xlg"
            onClick={() => navigate('/home')}
          >
            홈으로
          </CtaButton>
        </div>
      </div>
    </main>
  );
}
