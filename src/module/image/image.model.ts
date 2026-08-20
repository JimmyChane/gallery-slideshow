import { newUniqueTimestamp } from '@chanzor/utils';

import { API_SERVER } from '@/api/api';
import { urlServerFilename } from '@/composables/urlServerFilename';
import { ENV_ACCESS_TOKEN, ENV_BACKEND_API_BASE } from '@/config/env';

import { useFileReaderStore } from '../file-reader/file-reader.store';
import { IMAGE_ASPECT_RATIO_LIST } from './image-aspect-ratio.model';
import { ColorPaletteModel } from './image-color-palette.model';
import { ImagePositionModel } from './image-position.model';

// TODO: use blob
function getApiImgPath(filename: string): string {
  const url = new URL(`${ENV_BACKEND_API_BASE}/api/img/one/${filename}`);
  url.searchParams.append('t', ENV_ACCESS_TOKEN);
  return url.toString();
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
