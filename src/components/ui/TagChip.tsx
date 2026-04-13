type TagChipProps = {
  label: string;
};

export function TagChip({ label }: TagChipProps) {
  return (
    <span className="inline-flex min-h-[30px] items-center justify-center rounded-lg bg-[#D9D9D9] px-[clamp(12px,3.5vw,14px)] py-[8px] text-[clamp(11px,3vw,12px)] font-medium leading-[1.2] text-[#838383]">
      {label}
    </span>
  );
}
