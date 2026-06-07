import { Tags } from '@/components/ui/Tags';

const infoTags = [
  '컴퓨터공학과',
  '3학년',
  '2022학번',
  '장학',
  '취업',
  '동아리',
] as const;

export function MyPageInfoTags() {
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
