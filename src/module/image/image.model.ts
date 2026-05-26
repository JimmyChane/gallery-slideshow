import { newUniqueTimestamp } from '@chanzor/utils';

import { IMAGE_ASPECT_RATIO_LIST } from './image-aspect-ratio.model';

export class Position {
  width: number = -1;
  height: number = -1;
  x: number = -1;
  y: number = -1;

  screenX: number = -1;
  screenY: number = -1;
}

export abstract class ImageModel {
  readonly id = newUniqueTimestamp();

  readonly holderPosition = new Position();
  isPositionReady: boolean = false;

  isHovering: boolean = false;

  abstract getSrc(
    width: number | undefined,
    height: number | undefined,
  ): Promise<string | undefined>;

  getBestAspectRatio(): [number, number] | undefined {
    if (this.holderPosition.width === 0 || this.holderPosition.height === 0)
      return;

    const actualRatio = this.holderPosition.width / this.holderPosition.height;
    let bestMatch = IMAGE_ASPECT_RATIO_LIST.reduce((previous, current) => {
      return Math.abs(current.value - actualRatio) <
        Math.abs(previous.value - actualRatio)
        ? current
        : previous;
    });

    return bestMatch.ratio;
  }
}
