import { type MaybeUndefined, optArray } from '@chanzor/utils';

import { ENV_ACCESS_TOKEN, ENV_BACKEND_API_HOST } from '@/config/env';
import type { ColorPaletteData, ImagePathData } from '@/model/ImagePath.model';

import { API } from './api';

export async function getApiImgList(): Promise<ImagePathData[]> {
  const url = new URL(`${ENV_BACKEND_API_HOST}/api/img/list`);
  url.searchParams.append('t', ENV_ACCESS_TOKEN);

  const result = await API.get<MaybeUndefined<ImagePathData[]>>(url.toString());

  return optArray(result.data);
}

export async function getApiImgPalette(
  filename: string,
): Promise<ColorPaletteData> {
  const url = new URL(
    `${ENV_BACKEND_API_HOST}/api/img/one/${filename}/palette`,
  );
  url.searchParams.append('t', ENV_ACCESS_TOKEN);

  const result = await API.get<ColorPaletteData>(url.toString());

  return result.data;
}
