import { SearchSelectField } from '@/features/signup/components/SearchSelectField';
import { shouldHideSearchEmptyState } from '@/features/signup/utils';

type DepartmentStepProps = {
  errorMessage?: string;
  isLoading: boolean;
  isResultsVisible: boolean;
  query: string;
  selectedDepartmentId: number | null;
  suggestions: Array<{
    id: number | string;
    label: string;
  }>;
  onChange: (value: string) => void;
  onClear: () => void;
  onRetry: () => void;
  onSelect: (value: { id: number | string; label: string }) => void;
};

export function DepartmentStep({
  errorMessage,
  isLoading,
  isResultsVisible,
  query,
  selectedDepartmentId,
  suggestions,
  onChange,
  onClear,
  onRetry,
  onSelect,
}: DepartmentStepProps) {
  const shouldHideEmptyState = shouldHideSearchEmptyState(query);

  return (
    <SearchSelectField
      emptyDescription="학과 이름을 다시 확인해 주세요. 띄어쓰기 없이 입력해도 검색할 수 있어요."
      emptyMessage="조회된 학과가 없어요."
      errorMessage={errorMessage}
      hideEmptyState={shouldHideEmptyState}
      isLoading={isLoading}
      isResultsVisible={isResultsVisible}
      label="학과선택"
      loadingMessage="학과 목록을 불러오는 중입니다."
      resultsLabel="검색 결과"
      title={
        <>
          재학 중인
          <br />
          학과를 선택해주세요.
        </>
      }
      placeholder="학과 선택"
      selectedSuggestionId={selectedDepartmentId}
      value={query}
      suggestions={suggestions}
      onChange={onChange}
      onClear={onClear}
      onRetry={onRetry}
      onSelect={onSelect}
    />
  );
}
