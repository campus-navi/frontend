import { useDeadlinesViewModel } from '@/features/deadlines/view-models/useDeadlinesViewModel';
import { DeadlinesView } from '@/features/deadlines/views/DeadlinesView';

export function DeadlinesPage() {
  const viewModel = useDeadlinesViewModel();

  return <DeadlinesView {...viewModel} />;
}
