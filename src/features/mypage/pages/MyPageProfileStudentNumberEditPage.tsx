import { useMyPageProfileStudentNumberEditViewModel } from '@/features/mypage/view-models/useMyPageProfileStudentNumberEditViewModel';
import { MyPageProfileStudentNumberEditView } from '@/features/mypage/views/MyPageProfileStudentNumberEditView';

export function MyPageProfileStudentNumberEditPage() {
  const viewModel = useMyPageProfileStudentNumberEditViewModel();

  return <MyPageProfileStudentNumberEditView {...viewModel} />;
}
