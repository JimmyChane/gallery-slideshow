import { type MaybeUndefined, optArray } from '@chanzor/utils';

import { ENV_ACCESS_TOKEN, ENV_BACKEND_API_BASE } from '@/config/env';
import type { ColorPaletteData, ImagePathData } from '@/model/ImagePath.model';

import { API } from './api';

export async function getApiImgList(): Promise<ImagePathData[]> {
  const result =
    await API.get<MaybeUndefined<ImagePathData[]>>('/api/img/list');
  return optArray(result.data);
}

// TODO: use blob
export function getApiImgPath(filename: string): string {
  const url = new URL(`${ENV_BACKEND_API_BASE}/api/img/one/${filename}`);
  url.searchParams.append('t', ENV_ACCESS_TOKEN);
  return url.toString();
}

export async function getApiImgPalette(
  filename: string,
): Promise<ColorPaletteData> {
  const result = await API.get<ColorPaletteData>(
    `/api/img/one/${filename}/palette`,
  );
  return result.data;
}
