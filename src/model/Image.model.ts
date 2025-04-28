import { newKey } from '@chanzor/utils';

import { ASPECT_RATIOS } from './ImageAspectRatio.model';

export abstract class ImageModel {
  readonly id = newKey();

  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;
  screenX: number = 0;
  screenY: number = 0;

  isHovering: boolean = false;

  abstract getSrc(): Promise<string | undefined>;

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
