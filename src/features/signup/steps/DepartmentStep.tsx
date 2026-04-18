import { SearchSelectField } from '@/features/signup/components/SearchSelectField';

type DepartmentStepProps = {
  query: string;
  selectedDepartmentId: number | null;
  suggestions: Array<{
    id: number | string;
    label: string;
  }>;
  onChange: (value: string) => void;
  onClear: () => void;
  onSelect: (value: { id: number | string; label: string }) => void;
};

export function DepartmentStep({
  query,
  selectedDepartmentId,
  suggestions,
  onChange,
  onClear,
  onSelect,
}: DepartmentStepProps) {
  return (
    <SearchSelectField
      label="학과선택"
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
      onSelect={onSelect}
    />
  );
}
