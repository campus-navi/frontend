import { Tags } from '@/components/ui/Tags';
import { formatAdmissionYearTag } from '@/features/mypage/utils/formatAdmissionYearTag';

type MyPageInfoTagsProps = {
  admissionYear: number;
  campus: string;
  departments: string[];
  nickname: string;
};

export function MyPageInfoTags({
  admissionYear,
  campus,
  departments,
  nickname,
}: MyPageInfoTagsProps) {
  const admissionYearTag = formatAdmissionYearTag(admissionYear);
  const infoTags = [
    nickname,
    ...departments,
    campus,
    admissionYearTag,
  ].map((tag) => tag.trim()).filter((tag) => tag.length > 0);

  return (
    <section aria-labelledby="mypage-info-tags-title">
      <h2 id="mypage-info-tags-title" className="sr-only">
        사용자 정보
      </h2>
      <ul className="flex flex-wrap gap-2">
        {infoTags.map((tag, index) => (
          <li key={`${tag}-${index}`}>
            <Tags size="lg" type="tertiary">
              {tag}
            </Tags>
          </li>
        ))}
      </ul>
    </section>
  );
}
