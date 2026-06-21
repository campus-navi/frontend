import { useMyPageProfileEditViewModel } from '@/features/mypage/view-models/useMyPageProfileEditViewModel';
import { MyPageProfileEditView } from '@/features/mypage/views/MyPageProfileEditView';

export function MyPageProfileEditPage() {
  const viewModel = useMyPageProfileEditViewModel();

  return <MyPageProfileEditView {...viewModel} />;
}
