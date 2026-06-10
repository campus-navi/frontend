import { useMyPageScrapFolderViewModel } from '@/features/mypage/view-models/useMyPageScrapFolderViewModel';
import { MyPageScrapFolderView } from '@/features/mypage/views/MyPageScrapFolderView';

export function MyPageScrapFolderPage() {
  const viewModel = useMyPageScrapFolderViewModel();

  return <MyPageScrapFolderView {...viewModel} />;
}
