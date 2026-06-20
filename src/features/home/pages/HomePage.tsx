import { useHomeViewModel } from '@/features/home/view-models/useHomeViewModel';
import { HomeView } from '@/features/home/views/HomeView';

export function HomePage() {
  const viewModel = useHomeViewModel();

  return <HomeView {...viewModel} />;
}
