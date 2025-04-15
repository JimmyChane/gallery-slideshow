import { defineStore } from '#imports';
import { LinearQueue } from '@chanzor/utils';

export const useFileReaderStore = defineStore('file-reader', () => {
  const queue = new LinearQueue();

  return { queue };
});
