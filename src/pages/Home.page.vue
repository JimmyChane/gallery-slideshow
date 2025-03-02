<script setup lang="ts">
import { computed, ref } from 'vue';

import { ImageHolderModel } from '@/app.store';

import Images from './components/Images.vue';

const isDirectoryPickerSupported = computed(() => {
  return 'showDirectoryPicker' in window;
});

const supportedFileTypes = computed(() => [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
]);

const isOpened = ref(false);

const holders = ref<ImageHolderModel[]>([]);

const openFolder = async (): Promise<void> => {
  if (isOpened.value) return;
  if (!isDirectoryPickerSupported.value) return;

  const folderHandle = await window
    .showDirectoryPicker()
    .catch((e: Error) => e);
  if (folderHandle instanceof Error) {
    if (folderHandle.message.startsWith('AbortError')) return;

    console.error('Error accessing folder:', folderHandle);
    return;
  }

  const handlers: FileSystemFileHandle[] = [];
  for await (const handle of folderHandle.values()) {
    if (handle.kind !== 'file') continue;

    const filename = handle.name.toLowerCase();
    const isSupported = supportedFileTypes.value.some((ext) => {
      return filename.endsWith(ext);
    });
    if (!isSupported) {
      console.error('Invalid image format!');
      return;
    }

    handlers.push(handle);
  }

  const filePromises = handlers.map((handle) => handle.getFile());
  const files = await Promise.all(filePromises);
  holders.value = files.map((file) => new ImageHolderModel(file));
  holders.value.sort(() => [-1, 0, 1][Math.round(Math.random() * 3)]);

  isOpened.value = true;
};
</script>

<template>
  <div class="home-page">
    <button v-if="!isOpened" style="padding: 1em" @click="openFolder">
      Open Folder
    </button>

    <Images v-if="isOpened" :models="holders" />
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100%;

  display: flex;

  background: linear-gradient(90deg, #333333 0%, #141c1d 100%);
}
</style>
