import type { StudioDocument } from '@/api';

const MOCK_ANALYZING_DOCUMENTS_STORAGE_KEY = 'studio.mockAnalyzingDocuments';
const LEGACY_MOCK_ANALYZING_DOCUMENT_STORAGE_KEY = 'studio.mockAnalyzingDocument';

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

function getStoredMockAnalyzingDocuments() {
  try {
    const rawValue = window.sessionStorage.getItem(MOCK_ANALYZING_DOCUMENTS_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    return Array.isArray(parsedValue) ? parsedValue.filter(isStudioDocument) : [];
  } catch {
    return [];
  }
}

function getLegacyMockAnalyzingDocument() {
  try {
    const rawValue = window.sessionStorage.getItem(LEGACY_MOCK_ANALYZING_DOCUMENT_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    return isStudioDocument(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function getMockAnalyzingDocuments() {
  const storedDocuments = getStoredMockAnalyzingDocuments();

  if (storedDocuments.length > 0) {
    return storedDocuments;
  }

  const legacyDocument = getLegacyMockAnalyzingDocument();

  return legacyDocument ? [legacyDocument] : [];
}

function setMockAnalyzingDocuments(documents: StudioDocument[]) {
  try {
    window.sessionStorage.setItem(MOCK_ANALYZING_DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
  } catch {
    // Mock-only persistence should not block the analysis flow.
  }
}

export function upsertMockAnalyzingDocument(document: StudioDocument) {
  const documents = getMockAnalyzingDocuments();
  const nextDocuments = [
    document,
    ...documents.filter((storedDocument) => storedDocument.id !== document.id),
  ];

  setMockAnalyzingDocuments(nextDocuments);

  return nextDocuments;
}
