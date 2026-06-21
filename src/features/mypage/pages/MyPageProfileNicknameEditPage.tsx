import { useMyPageProfileNicknameEditViewModel } from '@/features/mypage/view-models/useMyPageProfileNicknameEditViewModel';
import { MyPageProfileNicknameEditView } from '@/features/mypage/views/MyPageProfileNicknameEditView';

export function MyPageProfileNicknameEditPage() {
  const viewModel = useMyPageProfileNicknameEditViewModel();

  return <MyPageProfileNicknameEditView {...viewModel} />;
}
