import { SvgIcon } from '@/components/ui/SvgIcon';

type MyPageProfileSummaryProps = {
  nickname: string;
  email: string;
};

export function MyPageProfileSummary({ nickname, email }: MyPageProfileSummaryProps) {
  return (
    <section className="relative rounded-xl bg-white px-4 pb-5 pt-3" aria-labelledby="mypage-profile-title">
      <ProfileImagePlaceholder />

      <div className="flex max-w-[210px] flex-col items-start gap-1">
        <div className="flex max-w-full items-center gap-1">
          <h2
            id="mypage-profile-title"
            className="min-w-0 truncate text-[20px] font-semibold leading-[1.4] tracking-normal text-black"
          >
            {nickname}
          </h2>
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center text-[#565656]"
            aria-hidden="true"
          >
            <EditIcon />
          </span>
        </div>

        <p className="max-w-full truncate text-[12px] font-normal leading-[1.2] tracking-[-0.02em] text-[#4B5157]">
          {email}
        </p>
      </div>
    </section>
  );
}

function ProfileImagePlaceholder() {
  return (
    <div
      className="absolute right-4 top-[-48px] flex h-24 w-24 items-center justify-center rounded-full bg-[#C8FFF0] text-[#0CA98D]"
      aria-label="프로필 이미지"
      role="img"
    >
      <SvgIcon size={72} viewBox="0 0 72 72">
        <circle cx="36" cy="22" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M14 63c3.5-15.2 12.8-22.5 22-22.5S54.5 47.8 58 63"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      </SvgIcon>
    </div>
  );
}

function EditIcon() {
  return (
    <SvgIcon size={16} viewBox="0 0 16 16">
      <path
        d="M8.00033 5.33211L2.66699 10.6654V13.3321H13.3337M2.66699 13.3321H5.33366L10.667 7.99877M8.00033 5.33211L9.91274 3.41967L9.91389 3.41854C10.1772 3.15528 10.309 3.02342 10.461 2.97404C10.5949 2.93053 10.7392 2.93053 10.873 2.97404C11.0249 3.02339 11.1567 3.1551 11.4195 3.41798L12.5794 4.57785C12.8434 4.84186 12.9755 4.97392 13.0249 5.12614C13.0684 5.26004 13.0684 5.40427 13.0249 5.53816C12.9755 5.69027 12.8436 5.82214 12.58 6.08577L12.5794 6.08634L10.667 7.99877M8.00033 5.33211L10.667 7.99877"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </SvgIcon>
  );
}
