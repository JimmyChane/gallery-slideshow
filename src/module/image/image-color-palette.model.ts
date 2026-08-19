import type { ColorPaletteData } from './image-color-palette.data';
import { getApiImgPalette } from './img.api';

export class ColorPaletteModel {
  private data?: Readonly<ColorPaletteData>;

  constructor(readonly filename: string) {}

  async getColorPalette(): Promise<Readonly<ColorPaletteData> | undefined> {
    if (this.data) return this.data;

    const dataFetched = await getApiImgPalette(this.filename).catch((e: Error) => e);
    if (dataFetched instanceof Error) {
      console.error(dataFetched);
      this.data = undefined;
    }

    return this.data;
  }
}
