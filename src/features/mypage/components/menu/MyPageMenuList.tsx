import { Link } from 'react-router-dom';

import { SvgIcon } from '@/components/ui/SvgIcon';

const applicationMenu = {
  label: '신청 정보 등록',
};

const settingMenus = [
  { label: '스크랩 설정', to: '/mypage/scraps' },
  { label: '리마인드 설정' },
] as const;

const postMenus = [
  { label: '최근 본 게시물' },
  { label: '임시저장 게시물', count: 2 },
] as const;

const menuSections = [
  {
    title: '고객지원',
    items: ['공지사항', '자주하는 질문(FAQ)', '문의하기'],
  },
  {
    title: '정책',
    items: ['약관 및 정책', '개인정보 보호정책', '제품 및 서비스 환불 정책'],
  },
] as const;

const accountActions = ['로그아웃', '회원탈퇴'] as const;

export function MyPageMenuList() {
  return (
    <section className="flex flex-col gap-3" aria-label="주요 메뉴">
      <div className="flex h-[52px] items-center justify-center rounded-xl bg-[#31FFCC] px-4 text-[16px] font-semibold leading-none tracking-normal text-[#202020]">
        <span aria-hidden="true" className="mr-2 text-[20px] font-normal leading-none">
          +
        </span>
        <span>{applicationMenu.label}</span>
      </div>

      <MenuCard>
        {settingMenus.map((item) => (
          <MenuRow key={item.label} label={item.label} to={'to' in item ? item.to : undefined} />
        ))}
      </MenuCard>

      <ul className="grid h-[52px] grid-cols-[1fr_auto_1fr] items-center rounded-xl bg-white px-3">
        <PostMenuItem label={postMenus[0].label} />
        <li className="h-3 w-px bg-[#DCDFE2]" aria-hidden="true" />
        <PostMenuItem label={postMenus[1].label} count={postMenus[1].count} />
      </ul>

      {menuSections.map((section) => (
        <MenuCard key={section.title}>
          <li className="flex h-11 items-center px-4 text-[14px] font-normal leading-[1.4] tracking-normal text-[#BFC4C8]">
            {section.title}
          </li>
          {section.items.map((label) => (
            <MenuRow key={label} label={label} />
          ))}
        </MenuCard>
      ))}

      <ul className="mt-3 flex items-center justify-center gap-3">
        <li className="text-[14px] font-medium leading-[1.4] tracking-normal text-[#636A70]">
          {accountActions[0]}
        </li>
        <li className="h-3 w-px bg-[#DCDFE2]" aria-hidden="true" />
        <li className="text-[14px] font-medium leading-[1.4] tracking-normal text-[#FF5E47]">
          {accountActions[1]}
        </li>
      </ul>
    </section>
  );
}

function MenuCard({ children }: { children: React.ReactNode }) {
  return <ul className="overflow-hidden rounded-xl bg-white">{children}</ul>;
}

function MenuRow({ label, to }: { label: string; to?: string }) {
  const rowClassName =
    'flex h-11 items-center justify-between gap-3 px-4 text-[14px] font-normal leading-[1.4] tracking-normal text-[#292B2C]';
  const content = (
    <>
      <span className="min-w-0 truncate">{label}</span>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#202020]" aria-hidden="true">
        <ChevronIcon />
      </span>
    </>
  );

  return (
    <li>
      {to ? (
        <Link to={to} className={rowClassName}>
          {content}
        </Link>
      ) : (
        <div className={rowClassName}>{content}</div>
      )}
    </li>
  );
}

function PostMenuItem({ label, count }: { label: string; count?: number }) {
  return (
    <li className="flex min-w-0 items-center justify-center gap-1 text-[14px] font-normal leading-[1.4] tracking-normal text-[#292B2C]">
      <span className="truncate">{label}</span>
      {typeof count === 'number' ? (
        <span className="shrink-0 font-semibold text-[#0BC798]">{count}</span>
      ) : null}
    </li>
  );
}

function ChevronIcon() {
  return (
    <SvgIcon size={20} viewBox="0 0 20 20">
      <path
        d="M8 5.5 12.5 10 8 14.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </SvgIcon>
  );
}
