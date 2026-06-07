import { Link } from 'react-router-dom';

import { SvgIcon } from '@/components/ui/SvgIcon';

const interestGuideCopy = {
  title: '맞춤 공지를 위해 참여해주세요.',
  cta: '맞춤 카테고리 선택하기',
};

type MyPageInterestGuideCardProps = {
  onClose: () => void;
};

export function MyPageInterestGuideCard({ onClose }: MyPageInterestGuideCardProps) {
  return (
    <section
      className="flex h-[72px] items-center gap-2 rounded-xl bg-white px-3 py-4"
      aria-labelledby="mypage-interest-guide-title"
    >
      <BrandIcon />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2
          id="mypage-interest-guide-title"
          className="truncate text-[14px] font-normal leading-[1.4] tracking-normal text-[#292B2C]"
        >
          {interestGuideCopy.title}
        </h2>

        <Link
          to="/notice-interests"
          state={{ from: '/mypage' }}
          className="w-fit text-[16px] font-semibold leading-none tracking-[0.015em] text-[#292B2C]"
        >
          {interestGuideCopy.cta}
        </Link>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-5 w-5 shrink-0 items-center justify-center text-[#565656]"
        aria-label="맞춤 카테고리 안내 닫기"
      >
        <CloseIcon />
      </button>
    </section>
  );
}

function BrandIcon() {
  return (
    <SvgIcon size={32} viewBox="0 0 32 32" className="shrink-0">
      <path
        d="M18.1247 13.6072C18.4344 13.5242 18.7178 13.8076 18.6348 14.1173L15.4091 26.1555C15.2888 26.6045 14.6349 26.5489 14.5922 26.0861L13.91 18.7083C13.8915 18.5086 13.7333 18.3504 13.5336 18.332L6.1559 17.6498C5.69308 17.607 5.6375 16.9531 6.08645 16.8328L18.1247 13.6072Z"
        fill="#31FFCC"
      />
      <path
        d="M14.0144 18.3782C13.7061 18.4598 13.4227 18.1764 13.5043 17.8681L16.676 5.8838C16.7943 5.43686 17.4461 5.49455 17.4904 5.95588L18.1962 13.31C18.2153 13.509 18.3735 13.6672 18.5726 13.6863L25.9266 14.3921C26.388 14.4364 26.4457 15.0882 25.9987 15.2065L14.0144 18.3782Z"
        fill="#31FFCC"
      />
    </SvgIcon>
  );
}

function CloseIcon() {
  return (
    <SvgIcon size={20} viewBox="0 0 20 20">
      <path
        d="M13 13L10 10M10 10L7 7M10 10L13 7M10 10L7 13"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </SvgIcon>
  );
}
