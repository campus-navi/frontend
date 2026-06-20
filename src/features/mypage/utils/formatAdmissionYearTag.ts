export function formatAdmissionYearTag(admissionYear: number) {
  if (admissionYear <= 0) {
    return '';
  }

  return `${String(admissionYear).slice(-2)}학번`;
}
