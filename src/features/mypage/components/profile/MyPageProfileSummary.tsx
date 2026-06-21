import { SvgIcon } from '@/components/ui/SvgIcon';
import { MyPageProfileAvatar } from '@/features/mypage/components/profile/MyPageProfileAvatar';

type MyPageProfileSummaryProps = {
  email: string;
  name: string;
  onEdit: () => void;
};

export function MyPageProfileSummary({ email, name, onEdit }: MyPageProfileSummaryProps) {
  return (
    <section className="relative rounded-xl bg-white px-4 pb-5 pt-3" aria-labelledby="mypage-profile-title">
      <MyPageProfileAvatar className="absolute right-4 top-[-48px]" />

      <div className="flex max-w-[210px] flex-col items-start gap-1">
        <div className="flex max-w-full items-center gap-1">
          <h2
            id="mypage-profile-title"
            className="min-w-0 truncate text-[20px] font-semibold leading-[1.4] tracking-normal text-black"
          >
            {name}
          </h2>
          <button
            type="button"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#565656] transition-colors hover:bg-[#F3F5FA]"
            aria-label="프로필 수정"
            onClick={onEdit}
          >
            <EditIcon />
          </button>
        </div>

        <p className="max-w-full truncate text-[12px] font-normal leading-[1.2] tracking-[-0.02em] text-[#4B5157]">
          {email}
        </p>
      </div>
    </section>
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
