import { useFileReaderStore } from '../stores/file-reader.store';
import { ImageModel } from './Image.model';

export class ImageFileModel extends ImageModel {
  src: string = '';

  constructor(readonly file: File) {
    super();
  }

  async getSrc(): Promise<string | undefined> {
    return useFileReaderStore().queue.next(async () => {
      if (this.src.length) return this.src;

      const file = this.file;

      const content = await new Promise<string>((r) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
          r(event.target?.result as string);
        });
        reader.readAsDataURL(file);
      });

      this.src = content;
      return content;
    });
  }
}
