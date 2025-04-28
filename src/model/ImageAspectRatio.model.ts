export interface AspectRatioModel {
  readonly value: number;
  readonly ratio: [number, number];
}

export const ASPECT_RATIOS: AspectRatioModel[] = [
  { value: 1, ratio: [1, 1] },
  { value: 4 / 3, ratio: [4, 3] },
  { value: 16 / 9, ratio: [16, 9] },
  { value: 3 / 2, ratio: [3, 2] },
  { value: 21 / 9, ratio: [21, 9] },
];
