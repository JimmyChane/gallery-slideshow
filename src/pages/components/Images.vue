<script setup lang="ts">
import { ImageHolderModel } from '@/app.store';

import ImageContent from './ImageContent.vue';
import ImageHolder from './ImageHolder.vue';

defineProps<{ models: ImageHolderModel[] }>();
</script>

<template>
  <div class="images">
    <div class="images-contents">
      <ImageHolder
        v-for="holder of models"
        :key="holder.file.name"
        style="z-index: 0"
        :model="holder"
      />

      <ImageContent
        v-for="holder of models"
        :key="holder.file.name"
        style="z-index: 1"
        :model="holder"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.images {
  width: 100%;
  height: 100%;

  overflow-y: hidden;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: 0px;

  .images-contents {
    position: relative;

    width: max-content;
    height: 100%;
    // margin-inline: auto;

    gap: 1em;
    padding: 1em;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
