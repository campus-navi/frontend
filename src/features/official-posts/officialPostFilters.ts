import type { OfficialPostListSort, OfficialPostTagCode } from '@/api';
import type {
  OfficialPostCategoryFilter,
  OfficialPostSortFilter,
} from '@/features/official-posts/components/OfficialPostListControls';

export const officialPostCategoryTagCodeMap = {
  전체: undefined,
  수강: 'COURSE',
  학사: 'ACADEMIC',
  '장학/금융': 'SCHOLARSHIP',
  '학생 지원': 'STUDENT_SUPPORT',
  활동: 'ACTIVITY',
  시설: 'FACILITY',
} satisfies Record<OfficialPostCategoryFilter, OfficialPostTagCode | undefined>;

export const officialPostSortMap = {
  최신순: 'LATEST',
  마감순: 'DEADLINE',
} satisfies Record<OfficialPostSortFilter, OfficialPostListSort>;
