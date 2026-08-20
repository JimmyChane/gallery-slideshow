import { API_SERVER } from '@/api/api';

async function getApiImgPalette(filename: string): Promise<ColorPaletteData> {
  const result = await API_SERVER.get<ColorPaletteData>(`/api/img/one/${filename}/palette`);
  return result.data;
}

export type ColorPaletteData = {
  vibrant?: string;
  vibrantDark?: string;
  vibrantLight?: string;
  muted?: string;
  mutedDark?: string;
  mutedLight?: string;
};

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
