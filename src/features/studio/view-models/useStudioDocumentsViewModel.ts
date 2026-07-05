import { useMemo, useState } from 'react';

import type { StudioDocument } from '@/api';
import { useStudioDocuments } from '@/features/studio/hooks/useStudioDocuments';

export type StudioDocumentFilter = 'all' | 'completed' | 'draft';

const EMPTY_STUDIO_DOCUMENTS: StudioDocument[] = [];

export function useStudioDocumentsViewModel() {
  const [selectedFilter, setSelectedFilter] = useState<StudioDocumentFilter>('all');
  const studioDocumentsQuery = useStudioDocuments();
  const documents = studioDocumentsQuery.data ?? EMPTY_STUDIO_DOCUMENTS;
  const counts = useMemo(
    () => ({
      all: documents.length,
      completed: documents.filter((document) => document.status === 'COMPLETED').length,
      draft: documents.filter((document) => document.status === 'DRAFT').length,
    }),
    [documents],
  );
  const filteredDocuments = useMemo(() => {
    if (selectedFilter === 'all') {
      return documents;
    }

    return documents.filter((document) => {
      if (selectedFilter === 'completed') {
        return document.status === 'COMPLETED';
      }

      return document.status === 'DRAFT';
    });
  }, [documents, selectedFilter]);

  return {
    counts,
    filteredDocuments,
    isError: studioDocumentsQuery.isError,
    isLoading: studioDocumentsQuery.isLoading,
    retry: () => void studioDocumentsQuery.refetch(),
    selectedFilter,
    setSelectedFilter,
  };
}

export type StudioDocumentsViewModel = ReturnType<typeof useStudioDocumentsViewModel>;
