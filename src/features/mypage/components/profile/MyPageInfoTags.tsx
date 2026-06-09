import { Tags } from '@/components/ui/Tags';

type MyPageInfoTagsProps = {
  admissionYear: number;
  campus: string;
  departments: string[];
  grade: number;
};

export function MyPageInfoTags({
  admissionYear,
  campus,
  departments,
  grade,
}: MyPageInfoTagsProps) {
  const infoTags = [
    campus,
    admissionYear > 0 ? `${admissionYear}학번` : '',
    grade > 0 ? `${grade}학년` : '',
    ...departments,
  ].filter((tag) => tag.length > 0);

  return (
    <section aria-labelledby="mypage-info-tags-title">
      <h2 id="mypage-info-tags-title" className="sr-only">
        사용자 정보
      </h2>
      <ul className="flex flex-wrap gap-2">
        {infoTags.map((tag) => (
          <li key={tag}>
            <Tags size="lg" type="tertiary">
              {tag}
            </Tags>
          </li>
        ))}
      </ul>
    </section>
  );
}
