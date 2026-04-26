import { getApiImgPalette } from '@/api/img.api';
import { ENV_ACCESS_TOKEN, ENV_BACKEND_API_HOST } from '@/config/env';

import { urlServerFilename } from '../composables/urlServerFilename';
import { ImageModel } from './Image.model';

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

    const url = new URL(`${ENV_BACKEND_API_HOST}/public/${filename} `);
    url.searchParams.append('t', ENV_ACCESS_TOKEN);
    this.fullPath = url.toString();
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
