import { Link } from 'react-router-dom';

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
        item.id === 'scrap' ? (
          <Link key={item.id} to="/mypage/scraps" className="flex flex-col gap-px">
            <SummaryItem count={item.count} label={item.label} />
          </Link>
        ) : (
          <div key={item.id} className="flex flex-col gap-px">
            <SummaryItem count={item.count} label={item.label} />
          </div>
        )
      ))}
    </section>
  );
}

function SummaryItem({ count, label }: { count: number; label: string }) {
  return (
    <>
      <strong className="text-[16px] font-medium leading-[1.4] tracking-normal text-[#0BC798]">
        {count}
      </strong>
      <span className="text-[14px] font-normal leading-[1.4] tracking-normal text-[#565656]">
        {label}
      </span>
    </>
  );
}
