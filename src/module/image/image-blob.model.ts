import { APP_API } from '@/api/api';
import { urlServerFilename } from '@/composables/urlServerFilename';

import type { ColorPaletteData } from './image-color-palette.data';
import { ImageModel } from './image.model';
import { getApiImgPalette, getApiImgPath } from './img.api';

export type ImageBlobData = { filename?: string };

export class ImageBlobModel extends ImageModel {
  fullPath: string;

  constructor(readonly filename: string) {
    super();
    this.fullPath = getApiImgPath(filename);
  }

  override async getSrc(
    width: number | undefined,
    height: number | undefined,
  ): Promise<string | undefined> {
    const url = urlServerFilename(this.fullPath, { width, height }).toString();
    const response = await APP_API.get(url, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  }

  async getColorPalette(): Promise<ColorPaletteData> {
    return getApiImgPalette(this.filename);
  }
}
