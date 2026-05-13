export function triggerBrowserDownload(downloadUrl: string, fileName?: string) {
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.style.display = 'none';

  if (fileName) {
    anchor.download = fileName;
  }

  anchor.rel = 'noopener noreferrer';
  anchor.target = '_blank';

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
