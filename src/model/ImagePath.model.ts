import { urlServerFilename } from '../api/ServerFilename.api';
import { ImageModel } from './Image.model';

export class ImagePathModel extends ImageModel {
  constructor(readonly filenameUrl: string) {
    super();
  }

  override async getSrc(
    width: number | undefined,
    height: number | undefined,
  ): Promise<string | undefined> {
    return urlServerFilename(this.filenameUrl, { width, height }).toString();
  }
}
