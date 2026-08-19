import { APP_API } from '@/api/api';
import { urlServerFilename } from '@/composables/urlServerFilename';

import { ColorPaletteModel } from './image-color-palette.model';
import { ImageModel } from './image.model';
import { getApiImgPath } from './img.api';

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
    const response = await APP_API.get(url, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  }
}
