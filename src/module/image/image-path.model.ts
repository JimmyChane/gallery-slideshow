import { urlServerFilename } from '@/composables/urlServerFilename';

import { ColorPaletteModel } from './image-color-palette.model';
import { ImageModel } from './image.model';
import { getApiImgPath } from './img.api';

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
