import { RadioChip } from '@/components/ui/RadioChip';
import { StudioDocumentCard } from '@/features/studio/components/StudioDocumentCard';
import type { StudioDocumentsViewModel } from '@/features/studio/view-models/useStudioDocumentsViewModel';

export function StudioDocumentsView({ viewModel }: { viewModel: StudioDocumentsViewModel }) {
  return (
    <section className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="flex gap-2">
        <RadioChip selected={viewModel.selectedFilter === 'all'} onClick={() => viewModel.setSelectedFilter('all')}>
          전체 {viewModel.counts.all}
        </RadioChip>
        <RadioChip
          selected={viewModel.selectedFilter === 'completed'}
          onClick={() => viewModel.setSelectedFilter('completed')}
        >
          분석완료 {viewModel.counts.completed}
        </RadioChip>
        <RadioChip selected={viewModel.selectedFilter === 'draft'} onClick={() => viewModel.setSelectedFilter('draft')}>
          임시저장 {viewModel.counts.draft}
        </RadioChip>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {viewModel.isLoading ? (
          <div className="flex min-h-[148px] items-center justify-center rounded-[10px] bg-white px-4 text-center text-[15px] font-medium leading-6 text-[#A0A7AF] shadow-[0_6px_22px_rgba(25,31,40,0.06)]">
            문서함을 불러오는 중이에요.
          </div>
        ) : null}
        {!viewModel.isLoading && viewModel.isError ? (
          <div className="flex min-h-[148px] flex-col items-center justify-center rounded-[10px] bg-white px-4 text-center shadow-[0_6px_22px_rgba(25,31,40,0.06)]">
            <p className="text-[15px] font-medium leading-6 text-[#A0A7AF]">문서함을 불러오지 못했어요.</p>
            <button
              type="button"
              onClick={viewModel.retry}
              className="mt-3 rounded-[8px] bg-[#F2F4F6] px-3 py-2 text-[13px] font-semibold leading-none text-[#292B2C]"
            >
              다시 시도
            </button>
          </div>
        ) : null}
        {!viewModel.isLoading && !viewModel.isError
          ? viewModel.filteredDocuments.map((document) => <StudioDocumentCard key={document.id} document={document} />)
          : null}
        {!viewModel.isLoading && !viewModel.isError && viewModel.filteredDocuments.length === 0 ? (
          <div className="flex min-h-[148px] items-center justify-center rounded-[10px] bg-white px-4 text-center text-[15px] font-medium leading-6 text-[#A0A7AF] shadow-[0_6px_22px_rgba(25,31,40,0.06)]">
            표시할 문서가 없어요.
          </div>
        ) : null}
      </div>
    </section>
  );
}
