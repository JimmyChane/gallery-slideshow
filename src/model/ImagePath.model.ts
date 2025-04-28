import { urlServerFilename } from '../api/ServerFilename.api';
import { ImageModel } from './Image.model';

export class ImagePathModel extends ImageModel {
  constructor(readonly filenameUrl: string) {
    super();
  }

  override async getSrc(): Promise<string | undefined> {
    return urlServerFilename(this.filenameUrl, { height: 350 }).toString();
  }
}
