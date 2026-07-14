import type { StudioDocument } from '@/api';

const MOCK_ANALYZING_DOCUMENT_STORAGE_KEY = 'studio.mockAnalyzingDocument';

function isStudioDocument(value: unknown): value is StudioDocument {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const document = value as Partial<StudioDocument>;

  return (
    typeof document.id === 'number' &&
    typeof document.title === 'string' &&
    typeof document.updatedAt === 'string' &&
    document.status === 'ANALYZING' &&
    typeof document.metadata === 'object' &&
    document.metadata !== null
  );
}

export function getMockAnalyzingDocument() {
  try {
    const rawValue = window.sessionStorage.getItem(MOCK_ANALYZING_DOCUMENT_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    return isStudioDocument(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function setMockAnalyzingDocument(document: StudioDocument) {
  try {
    window.sessionStorage.setItem(MOCK_ANALYZING_DOCUMENT_STORAGE_KEY, JSON.stringify(document));
  } catch {
    // Mock-only persistence should not block the analysis flow.
  }
}
