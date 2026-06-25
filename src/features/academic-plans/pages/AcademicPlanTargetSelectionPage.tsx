import { useAcademicPlanTargetSelectionViewModel } from '@/features/academic-plans/view-models/useAcademicPlanTargetSelectionViewModel';
import { AcademicPlanTargetSelectionView } from '@/features/academic-plans/views/AcademicPlanTargetSelectionView';

export function AcademicPlanTargetSelectionPage() {
  const viewModel = useAcademicPlanTargetSelectionViewModel();

  return <AcademicPlanTargetSelectionView {...viewModel} />;
}
