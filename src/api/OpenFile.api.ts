const FILE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

function isDirectoryPickerSupported(): boolean {
  return 'showDirectoryPicker' in window;
}

export async function openImageFolder(): Promise<File[] | undefined> {
  if (!isDirectoryPickerSupported()) return;

  const folderHandle = await window
    // @ts-expect-error
    .showDirectoryPicker()
    .catch((e: Error) => e);
  if (folderHandle instanceof Error) {
    if (folderHandle.message.startsWith('AbortError')) return;

    console.error('Error accessing folder:', folderHandle);
    return;
  }

  const handlers: FileSystemFileHandle[] = [];
  for await (const handle of folderHandle.values()) {
    if (handle.kind !== 'file') continue;

    const filename = handle.name.toLowerCase();
    const isSupported = FILE_TYPES.some((ext) => filename.endsWith(ext));
    if (!isSupported) {
      console.error('Invalid image format!');
      return;
    }

    handlers.push(handle);
  }

  const filePromises = handlers.map((handle) => handle.getFile());
  const files = await Promise.all(filePromises);

  return files;
}
