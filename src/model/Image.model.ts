import { newKey } from '@chanzor/utils';

import { ASPECT_RATIOS } from './ImageAspectRatio.model';

export class Position {
  width: number = -1;
  height: number = -1;
  x: number = -1;
  y: number = -1;

  screenX: number = -1;
  screenY: number = -1;
}

export abstract class ImageModel {
  readonly id = newKey();

  readonly holderPosition = new Position();

  isHovering: boolean = false;

  abstract getSrc(
    width: number | undefined,
    height: number | undefined,
  ): Promise<string | undefined>;

  getBestAspectRatio(): [number, number] | undefined {
    if (this.holderPosition.width === 0 || this.holderPosition.height === 0)
      return;

    const actualRatio = this.holderPosition.width / this.holderPosition.height;
    let bestMatch = ASPECT_RATIOS.reduce((previous, current) => {
      return Math.abs(current.value - actualRatio) <
        Math.abs(previous.value - actualRatio)
        ? current
        : previous;
    });

    return bestMatch.ratio;
  }
}
