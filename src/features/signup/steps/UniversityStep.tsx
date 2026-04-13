import { SearchSelectField } from '@/features/signup/components/SearchSelectField';

type UniversityStepProps = {
  query: string;
  suggestions: string[];
  onChange: (value: string) => void;
  onClear: () => void;
  onSelect: (value: string) => void;
};

export function UniversityStep({ query, suggestions, onChange, onClear, onSelect }: UniversityStepProps) {
  return (
    <SearchSelectField
      label="대학인증"
      title={
        <>
          현재 다니고 계시는
          <br />
          대학교 이름을 입력해주세요.
        </>
      }
      placeholder="대학교 이름을 작성해주세요"
      value={query}
      suggestions={suggestions}
      onChange={onChange}
      onClear={onClear}
      onSelect={onSelect}
    />
  );
}
