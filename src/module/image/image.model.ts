import { newUniqueTimestamp } from '@chanzor/utils';

import { API_SERVER } from '@/api/api';
import { ENV_BACKEND_API_BASE } from '@/config/env';

import { useFileReaderStore } from '../file-reader/file-reader.store';
import { IMAGE_ASPECT_RATIO_LIST } from './image-aspect-ratio.model';
import { ColorPaletteModel } from './image-color-palette.model';
import { ImagePositionModel } from './image-position.model';

function queryDimension(option?: { width?: number; height?: number }): URLSearchParams | undefined {
  if (option === undefined) return;

  const searchParams = new URLSearchParams();
  if (typeof option?.width === 'number') searchParams.append('w', option.width.toString());
  if (typeof option?.height === 'number') searchParams.append('h', option.height.toString());

  return searchParams;
}

// function parseName(filename: string) {
//   const parts = filename.split('.');
//   if (parts.length > 1) {
//     return parts.slice(0, -1).join('.');
//   }
//   return filename;
// }

// function parseExt(filename: string) {
//   const parts = filename.split('.');
//   const ext = parts.length > 1 ? parts[parts.length - 1] : 'PNG';
//   return (ext || 'PNG').toUpperCase();
// }

export function urlServerFilename(filenameUrl: string, option?: { width?: number; height?: number }) {
  const url = new URL(filenameUrl);
  if (typeof option?.width === 'number') {
    url.searchParams.append('w', option.width.toString());
  }
  if (typeof option?.height === 'number') {
    url.searchParams.append('h', option.height.toString());
  }

  return url;
}

export function getApiImgPath(filename: string): string {
  const url = new URL(`${ENV_BACKEND_API_BASE}/api/img/one/${filename}`);
  return url.toString();
}

export async function getApiImgDownload(filename: string, option?: { width?: number; height?: number }): Promise<void> {
  const query = queryDimension(option);
  const link = query ? `/api/img/one/${filename}/download?${query.toString()}` : `/api/img/one/${filename}/download`;
  const res = await API_SERVER.get(link, { responseType: 'blob' });

  const blob = new Blob([res.data]);
  const url = window.URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  anchor.click();

  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export abstract class ImageModel {
  readonly id = newUniqueTimestamp();

  readonly holderPosition = new ImagePositionModel();
  isPositionReady: boolean = false;

  isHovering: boolean = false;

  abstract getSrc(width: number | undefined, height: number | undefined): Promise<string | undefined>;

  getBestAspectRatio(): [number, number] | undefined {
    if (this.holderPosition.width === 0 || this.holderPosition.height === 0) return;

    const actualRatio = this.holderPosition.width / this.holderPosition.height;
    let bestMatch = IMAGE_ASPECT_RATIO_LIST.reduce((previous, current) => {
      return Math.abs(current.value - actualRatio) < Math.abs(previous.value - actualRatio) ? current : previous;
    });

    return bestMatch.ratio;
  }
}

// FILE

export class ImageFileModel extends ImageModel {
  readonly type = 'file';

  src: string = '';

  constructor(readonly file: File) {
    super();
  }

  async getSrc(): Promise<string | undefined> {
    return useFileReaderStore().queue.next(async () => {
      if (this.src.length) return this.src;

      const file = this.file;

      const content = await new Promise<string>((r) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
          r(event.target?.result as string);
        });
        reader.readAsDataURL(file);
      });

      this.src = content;
      return content;
    });
  }
}

// PATH

export type ImagePathData = { filename?: string };

export class ImagePathModel extends ImageModel {
  readonly type = 'path';

  readonly fullPath: string;
  readonly colorPalette: ColorPaletteModel;

  constructor(readonly filename: string) {
    super();
    this.fullPath = getApiImgPath(filename);
    this.colorPalette = new ColorPaletteModel(filename);
  }

  override async getSrc(width: number | undefined, height: number | undefined): Promise<string | undefined> {
    return urlServerFilename(this.fullPath, { width, height }).toString();
  }
}

// BLOB

export type ImageBlobData = { filename?: string };

export class ImageBlobModel extends ImageModel {
  readonly type = 'blob';

  readonly fullPath: string;
  readonly colorPalette: ColorPaletteModel;

  constructor(readonly filename: string) {
    super();
    this.fullPath = getApiImgPath(filename);
    this.colorPalette = new ColorPaletteModel(filename);
  }

  override async getSrc(width: number | undefined, height: number | undefined): Promise<string | undefined> {
    const url = urlServerFilename(this.fullPath, { width, height }).toString();
    const response = await API_SERVER.get(url, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  }
}
