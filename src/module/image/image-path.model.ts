import { urlServerFilename } from '@/composables/urlServerFilename';

import { ImageModel } from './image.model';
import { getApiImgPalette, getApiImgPath } from './img.api';

export type ColorPaletteData = {
  vibrant?: string;
  vibrantDark?: string;
  vibrantLight?: string;
  muted?: string;
  mutedDark?: string;
  mutedLight?: string;
};

export type ImagePathData = { filename?: string };

export class ImagePathModel extends ImageModel {
  fullPath: string;

  constructor(readonly filename: string) {
    super();

    this.fullPath = getApiImgPath(filename);
  }

  override async getSrc(
    width: number | undefined,
    height: number | undefined,
  ): Promise<string | undefined> {
    return urlServerFilename(this.fullPath, { width, height }).toString();
  }

  async getColorPalette(): Promise<ColorPaletteData> {
    return getApiImgPalette(this.filename);
  }
}
