import { LinearQueueHandler } from '@chanzor/utils';
import { defineStore } from 'pinia';

export const useFileReaderStore = defineStore('file-reader', () => {
  const queue = new LinearQueueHandler();

  return { queue };
});
