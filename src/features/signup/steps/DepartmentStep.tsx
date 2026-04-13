import { SearchSelectField } from '@/features/signup/components/SearchSelectField';

type DepartmentStepProps = {
  query: string;
  suggestions: string[];
  onChange: (value: string) => void;
  onClear: () => void;
  onSelect: (value: string) => void;
};

export function DepartmentStep({ query, suggestions, onChange, onClear, onSelect }: DepartmentStepProps) {
  return (
    <SearchSelectField
      label="학과선택"
      title={
        <>
          학과선택해달라는
          <br />
          대충 큰 텍스트 ㅋㅋ
        </>
      }
      placeholder="학과 선택"
      value={query}
      suggestions={suggestions}
      onChange={onChange}
      onClear={onClear}
      onSelect={onSelect}
    />
  );
}
