import { SvgIcon } from '@/components/ui/SvgIcon';

type MyPageProfileAvatarProps = {
  className?: string;
};

export function MyPageProfileAvatar({ className = '' }: MyPageProfileAvatarProps) {
  return (
    <div
      className={[
        'flex h-24 w-24 items-center justify-center rounded-full bg-[#CCFFF2] text-[#00B285] shadow-[0_0_12px_rgba(0,27,59,0.06)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="프로필 이미지"
      role="img"
    >
      <SvgIcon size={72} viewBox="0 0 72 72">
        <circle cx="36" cy="23" r="13" fill="none" stroke="currentColor" strokeWidth="3" />
        <path
          d="M14 63c3.5-15.2 12.8-22.5 22-22.5S54.5 47.8 58 63"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </SvgIcon>
    </div>
  );
}
