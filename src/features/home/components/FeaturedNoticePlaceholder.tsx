export function FeaturedNoticePlaceholder({ children }: { children: string }) {
  return (
    <div className="flex h-[481px] items-center justify-center rounded-2xl bg-[#FAFAFC] px-6 text-center text-[14px] font-medium leading-[1.4] text-[#767676]">
      {children}
    </div>
  );
}
