const ASPECT_RATIOS: { value: number; ratio: [number, number] }[] = [
  { value: 1, ratio: [1, 1] },
  { value: 4 / 3, ratio: [4, 3] },
  { value: 16 / 9, ratio: [16, 9] },
  { value: 3 / 2, ratio: [3, 2] },
  { value: 21 / 9, ratio: [21, 9] },
];

export class ImageHolderModel {
  src: string = '';

  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;
  screenX: number = 0;
  screenY: number = 0;

  isHovering: boolean = false;

  constructor(readonly file: File) {}

  getBestAspectRatio(): [number, number] | undefined {
    if (this.width === 0 || this.height === 0) return;

    const actualRatio = this.width / this.height;
    let bestMatch = ASPECT_RATIOS.reduce((previous, current) => {
      return Math.abs(current.value - actualRatio) <
        Math.abs(previous.value - actualRatio)
        ? current
        : previous;
    });

    return bestMatch.ratio;
  }
}
