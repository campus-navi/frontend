type MyPageSummaryCardsProps = {
  remindCount: number;
  scrapCount: number;
};

export function MyPageSummaryCards({ remindCount, scrapCount }: MyPageSummaryCardsProps) {
  const summaryItems = [
    { id: 'scrap', label: '스크랩', count: scrapCount },
    { id: 'remind', label: '리마인드', count: remindCount },
  ] as const;

  return (
    <section className="flex items-center gap-10 pl-4" aria-label="스크랩 및 리마인드 요약">
      {summaryItems.map((item) => (
        <div key={item.id} className="flex flex-col gap-px">
          <strong className="text-[16px] font-medium leading-[1.4] tracking-normal text-[#0BC798]">
            {item.count}
          </strong>
          <span className="text-[14px] font-normal leading-[1.4] tracking-normal text-[#565656]">
            {item.label}
          </span>
        </div>
      ))}
    </section>
  );
}
