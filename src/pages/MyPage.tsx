import { MobileGnb } from '@/components/ui/MobileGnb';
import { MyPageProfileSummary } from '@/features/mypage/components/MyPageProfileSummary';

const profileSummary = {
  nickname: '캠퍼스네비',
  email: 'campusnavi@example.com',
};

export default function MyPage() {
  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[calc(54px+max(32px,env(safe-area-inset-bottom)))]">
        <section className="flex flex-1 flex-col px-4 pt-[calc(40px+max(20px,env(safe-area-inset-top)))]">
          <h1 className="text-[24px] font-bold leading-[1.4] tracking-normal text-[#202020]">
            마이페이지
          </h1>

          <div className="mt-20">
            <MyPageProfileSummary
              nickname={profileSummary.nickname}
              email={profileSummary.email}
            />
          </div>
        </section>
      </div>

      <MobileGnb activeItem="my" />
    </main>
  );
}
