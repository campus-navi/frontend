import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';
import { Modal } from '@/components/ui/Modal';

const NOTICE_INTEREST_PROMPT_SEEN_KEY = 'notice-interest-prompt-seen';
const NOTICE_INTEREST_PROMPT_IMAGE_SRC = '/images/notice-interest-prompt.svg';

function hasSeenNoticeInterestPrompt() {
  try {
    return sessionStorage.getItem(NOTICE_INTEREST_PROMPT_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

function markNoticeInterestPromptSeen() {
  try {
    sessionStorage.setItem(NOTICE_INTEREST_PROMPT_SEEN_KEY, 'true');
  } catch {
    // If sessionStorage is unavailable, keep the in-memory close behavior.
  }
}

export default function HomePage() {
  const navigate = useNavigate();
  const [isNoticeInterestPromptOpen, setIsNoticeInterestPromptOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenNoticeInterestPrompt()) {
      setIsNoticeInterestPromptOpen(true);
    }
  }, []);

  const closeNoticeInterestPrompt = () => {
    markNoticeInterestPromptSeen();
    setIsNoticeInterestPromptOpen(false);
  };

  const goToNoticeInterests = () => {
    markNoticeInterestPromptSeen();
    setIsNoticeInterestPromptOpen(false);
    navigate('/notice-interests');
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader variant="main" />

        <section className="flex flex-1 flex-col px-5 py-8">
          <h1 className="text-[24px] font-bold leading-[1.4] tracking-normal text-[#303030]">
            홈
          </h1>
          <p className="mt-3 text-[15px] font-medium leading-[1.5] tracking-normal text-[#8E8E8E]">
            로그인 이후 홈 화면 임시 페이지입니다.
          </p>
        </section>
      </div>

      <Modal
        isOpen={isNoticeInterestPromptOpen}
        title={<span className="sr-only">어떤 공지를 보여드릴까요?</span>}
        titleId="notice-interest-prompt-title"
        footerLayout="vertical"
        footer={
          <>
            <CtaButton type="button" variant="primary" state="default" size="xlg" onClick={goToNoticeInterests}>
              맞춤 공지 설정하기
            </CtaButton>
            <CtaButton type="button" variant="tertiary" state="default" size="xlg" onClick={closeNoticeInterestPrompt}>
              다음에 할게요
            </CtaButton>
          </>
        }
      >
        <div className="flex w-full flex-col items-center px-5 pb-5 pt-1">
          <img
            src={NOTICE_INTEREST_PROMPT_IMAGE_SRC}
            alt=""
            className="h-[150px] w-full object-contain"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-center text-[18px] font-semibold leading-[1.4] tracking-normal text-[#292B2C]">
            어떤 공지를 보여드릴까요?
          </h3>
          <p className="mt-3 whitespace-pre-line text-center text-[16px] font-medium leading-[1.5] tracking-normal text-[#5E5E5E]">
            {'나에게 맞는 공지를 위해\n간단한 설문조사에 참여해주세요.'}
          </p>
        </div>
      </Modal>
    </main>
  );
}
