import type { UniversitySummary } from '@/api/modules/university';
import { SearchSelectField } from '@/features/signup/components/SearchSelectField';
import type { SelectedUniversity } from '@/features/signup/types';
import { shouldHideUniversityEmptyState } from '@/features/signup/utils';

type UniversityStepProps = {
  isLoading: boolean;
  isResultsVisible: boolean;
  onRetry: () => void;
  query: string;
  selectedUniversity: SelectedUniversity | null;
  suggestions: UniversitySummary[];
  errorMessage?: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSelect: (value: UniversitySummary) => void;
};

export function UniversityStep({
  isLoading,
  isResultsVisible,
  onRetry,
  query,
  selectedUniversity,
  suggestions,
  errorMessage,
  onChange,
  onClear,
  onSelect,
}: UniversityStepProps) {
  const mappedSuggestions = suggestions.map((item) => ({
    id: item.campusId,
    label: item.universityName,
  }));

  return (
    <SearchSelectField
      emptyDescription="학교 이름을 다시 확인해 주세요. 띄어쓰기 없이 입력해도 검색할 수 있어요."
      emptyMessage="조회된 대학이 없어요."
      errorMessage={errorMessage}
      hideEmptyState={shouldHideUniversityEmptyState(query)}
      isLoading={isLoading}
      isResultsVisible={isResultsVisible}
      label="대학인증"
      loadingMessage="대학 목록을 불러오는 중입니다."
      onChange={onChange}
      onClear={onClear}
      onRetry={onRetry}
      onSelect={(value) => {
        const selectedUniversitySummary = suggestions.find((item) => item.campusId === value.id);

        if (!selectedUniversitySummary) {
          return;
        }

        onSelect(selectedUniversitySummary);
      }}
      placeholder="대학교 이름을 작성해주세요"
      resultsLabel="검색 결과"
      selectedSuggestionId={selectedUniversity?.campusId ?? null}
      suggestions={mappedSuggestions}
      title={
        <>
          현재 다니고 계시는
          <br />
          대학교 이름을 입력해주세요.
        </>
      }
      value={query}
    />
  );
}
