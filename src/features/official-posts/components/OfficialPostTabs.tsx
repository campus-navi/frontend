export type OfficialPostTab = 'notice' | 'department';

const tabs: { label: string; value: OfficialPostTab }[] = [
  { label: '공지사항', value: 'notice' },
  { label: '관련부서', value: 'department' },
];

type OfficialPostTabsProps = {
  activeTab: OfficialPostTab;
  onTabChange: (tab: OfficialPostTab) => void;
};

export function OfficialPostTabs({ activeTab, onTabChange }: OfficialPostTabsProps) {
  return (
    <section className="bg-white" aria-label="공지 상세 탭">
      <div className="grid grid-cols-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              className={[
                'flex h-11 items-center justify-center border-b text-center text-[14px] leading-none tracking-[0.015em] transition-colors',
                isActive
                  ? 'border-[#292B2C] font-semibold text-[#292B2C]'
                  : 'border-[#BFC4C8] font-medium text-[#292B2C] opacity-30',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={isActive}
              onClick={() => onTabChange(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
