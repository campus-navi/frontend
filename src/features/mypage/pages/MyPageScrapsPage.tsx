import { useMyPageScrapsViewModel } from '@/features/mypage/view-models/useMyPageScrapsViewModel';
import { MyPageScrapsView } from '@/features/mypage/views/MyPageScrapsView';

export function MyPageScrapsPage() {
  const viewModel = useMyPageScrapsViewModel();

  return <MyPageScrapsView {...viewModel} />;
}
