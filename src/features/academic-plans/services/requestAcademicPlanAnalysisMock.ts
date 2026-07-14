const MOCK_ANALYSIS_DOCUMENT_ID = -320;
const MOCK_ANALYSIS_REQUEST_DELAY_MS = 350;

export type AcademicPlanAnalysisMockResult = {
  documentId: number;
};

export async function requestAcademicPlanAnalysisMock(
  documentId: number | undefined,
): Promise<AcademicPlanAnalysisMockResult> {
  // TODO(#320): replace this mock with POST /studio/documents/{documentId}/analyze when the API is finalized.
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        documentId: documentId ?? MOCK_ANALYSIS_DOCUMENT_ID,
      });
    }, MOCK_ANALYSIS_REQUEST_DELAY_MS);
  });
}
