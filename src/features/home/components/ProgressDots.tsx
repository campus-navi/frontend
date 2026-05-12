export function ProgressDots({ total, activeIndex }: { total: number; activeIndex: number }) {
  return (
    <div className="flex h-4 items-center justify-center gap-1" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={
            index === activeIndex
              ? 'h-1 w-4 rounded-full bg-[#292B2C]'
              : 'h-1 w-1 rounded-full border border-[rgba(41,43,44,0.4)] bg-[rgba(41,43,44,0.1)]'
          }
        />
      ))}
    </div>
  );
}
