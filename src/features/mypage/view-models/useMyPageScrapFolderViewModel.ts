import { useNavigate, useParams } from 'react-router-dom';

export function useMyPageScrapFolderViewModel() {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();
  const displayFolderId = folderId ?? '알 수 없음';
  const title = `스크랩 폴더 ${displayFolderId}`;

  const handleBack = () => {
    navigate('/mypage/scraps');
  };

  return {
    displayFolderId,
    emptyMessage: '아직 이 폴더에 표시할 스크랩이 없습니다.',
    onBack: handleBack,
    title,
  };
}
