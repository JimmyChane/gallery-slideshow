<script setup lang="ts">
import { ref } from 'vue';
import { openImageFolder } from '~/src/api/OpenFile.api';
import { ImageHolderModel } from '~/src/model/ImageHolder.model';
import Slideshow from '~/src/pages/home/components/Slideshow.vue';

const isOpened = ref(false);

const holders = ref<ImageHolderModel[]>([]);

async function openFolder(): Promise<void> {
  if (isOpened.value) return;

  const files = await openImageFolder();
  if (!files) return;

  holders.value = files.map((file) => new ImageHolderModel(file));
  holders.value.sort(() => [-1, 0, 1][Math.round(Math.random() * 3)]);

  isOpened.value = true;
}
</script>

<template>
  <div class="home-page">
    <button v-if="!isOpened" style="padding: 1em" @click="openFolder">
      Open Folder
    </button>

    <Slideshow v-if="isOpened" :models="holders" />
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
