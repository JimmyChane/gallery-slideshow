export function urlServerFilename(
  filenameUrl: string,
  option?: { width?: number; height?: number },
) {
  const url = new URL(filenameUrl);
  if (typeof option?.width === 'number') {
    url.searchParams.append('w', option.width.toString());
  }
  if (typeof option?.height === 'number') {
    url.searchParams.append('h', option.height.toString());
  }

  return url;
}
