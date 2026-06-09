import { SvgIcon } from '@/components/ui/SvgIcon';

export function MoreIcon() {
  return (
    <SvgIcon size={16} viewBox="0 0 16 16">
      <circle cx="8" cy="3.5" r="1.25" fill="currentColor" />
      <circle cx="8" cy="8" r="1.25" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.25" fill="currentColor" />
    </SvgIcon>
  );
}

export function PlusIcon() {
  return (
    <SvgIcon size={20} viewBox="0 0 20 20">
      <path d="M10 4.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.5 10H15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}
