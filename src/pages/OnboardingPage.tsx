import { useNavigate } from 'react-router-dom';

import { CtaButton } from '@/components/ui/CtaButton';
import { SubTitle } from '@/components/ui/SubTitle';
import { TagChip } from '@/components/ui/TagChip';
import { Title } from '@/components/ui/Title';

const onboardingTags = ['머시기', '머시기', '머시기'];

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <div className="mx-auto h-[100svh] w-full max-w-[393px] bg-white">
        <section className="mx-auto flex h-full w-full max-w-[393px] flex-col justify-between bg-white px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-[clamp(72px,16vh,176px)]">
          <div className="flex flex-col items-start gap-[clamp(12px,3vw,16px)]">
            <Title>우리 대학 정보를 하나로</Title>
            <SubTitle className="max-w-[clamp(182px,46vw,220px)]">
              머시기머시기, 머시기머시기 머시기해서 만나보세요
            </SubTitle>
            <div className="flex flex-wrap items-center gap-[6px]">
              {onboardingTags.map((label) => (
                <TagChip key={label} label={label} />
              ))}
            </div>
          </div>

          <div className="w-full space-y-4 pt-[clamp(24px,8vh,72px)]">
            <CtaButton onClick={() => navigate('/login')}>로그인</CtaButton>
            <CtaButton onClick={() => navigate('/signup')}>회원가입</CtaButton>
          </div>
        </section>
      </div>
    </main>
  );
}
