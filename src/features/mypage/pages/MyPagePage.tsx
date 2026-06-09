import { useMyPageViewModel } from '@/features/mypage/view-models/useMyPageViewModel';
import { MyPageView } from '@/features/mypage/views/MyPageView';

export function MyPagePage() {
  const viewModel = useMyPageViewModel();

  return <MyPageView {...viewModel} />;
}
