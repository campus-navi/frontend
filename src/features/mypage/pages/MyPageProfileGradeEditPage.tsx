import { useMyPageProfileGradeEditViewModel } from '@/features/mypage/view-models/useMyPageProfileGradeEditViewModel';
import { MyPageProfileGradeEditView } from '@/features/mypage/views/MyPageProfileGradeEditView';

export function MyPageProfileGradeEditPage() {
  const viewModel = useMyPageProfileGradeEditViewModel();

  return <MyPageProfileGradeEditView {...viewModel} />;
}
