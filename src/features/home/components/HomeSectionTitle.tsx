export function HomeSectionTitle({
  nickname,
  suffix,
}: {
  nickname: string;
  suffix: string;
}) {
  return (
    <h1 className="flex items-center gap-1 text-[20px] font-bold leading-[1.2] tracking-[-0.02em] text-[#333333]">
      <span>{nickname}님을 위한</span>
      <span className="text-[#939393]">{suffix}</span>
    </h1>
  );
}
