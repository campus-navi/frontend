type OfficialPostSummaryAIProps = {
  summary: string;
};

export function OfficialPostSummaryAI({ summary }: OfficialPostSummaryAIProps) {
  return (
    <section className="px-4 py-4" aria-labelledby="official-post-summary-title">
      <div className="flex flex-col gap-3 rounded-[12px] border border-[#0BC798] bg-white px-3 py-4">
        <h2 id="official-post-summary-title" className="flex items-center gap-1 text-[16px] font-semibold leading-[1.4] tracking-normal">
          <span className="text-[#0BC798]">캠퍼스 네비</span>
          <span className="text-[#292B2C]">요약 +</span>
        </h2>
        <p className="whitespace-pre-line text-[14px] font-medium leading-[1.4] tracking-normal text-[#565656]">
          {summary}
        </p>
      </div>
    </section>
  );
}
