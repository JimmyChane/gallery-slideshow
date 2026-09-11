<script setup lang="ts">
import type { DialogProps } from '@chanzor/vue-overlay';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import DismissableContainer from './DismissableContainer.vue';

const props = defineProps<DialogProps<undefined>>();

let dismissTime = 0;

const preventKeyDown = ref(false);
const componentRef = ref();

async function dismiss(): Promise<void> {
  preventKeyDown.value = true;
  const time = (dismissTime = Date.now());
  if (props.dialogPopup.onBeforeClose) {
    const toClose = await props.dialogPopup.onBeforeClose(props.dialogPopup);
    if (time !== dismissTime) return;

    await new Promise((r) => setTimeout(r, 0));
    if (time !== dismissTime) return;

    if (!toClose) {
      preventKeyDown.value = false;
      return;
    }
  }

  props.dialogPopup.close();
}

async function onKeyDown(e: KeyboardEvent) {
  if (preventKeyDown.value) return;

  if (e.key === 'Escape') dismiss();
}

async function onMountComponent() {
  if (!componentRef.value) return;
  if (props.dialogPopup.showingTime > 0) return;

  await props.dialogPopup.open();
  window.addEventListener('keydown', onKeyDown);
}

watch(componentRef, onMountComponent);

onMounted(() => {
  onMountComponent();
});
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
  <DismissableContainer
    class="overlay-dialog"
    :data-showing="`${dialogPopup.isShowing}`"
    @click-dismiss="() => dismiss()"
  >
    <div class="overlay-dialog-body">
      <component ref="componentRef" :is="dialogPopup.component" :dialog-popup="dialogPopup" />
    </div>
  </DismissableContainer>
</template>

<style lang="scss" scoped>
.overlay-dialog {
  --hitbox-size: 30px;

  --default-size-top: var(--hitbox-size);
  --default-size-right: var(--hitbox-size);
  --default-size-bottom: var(--hitbox-size);
  --default-size-left: var(--hitbox-size);

  background-color: rgba(0, 0, 0, 0.75);

  transition:
    background-color,
    opacity 200ms ease;

  @media (max-width: 500px) {
    --hitbox-size: 10px;
  }
  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    -webkit-backdrop-filter: blur(0.2rem);
    backdrop-filter: blur(0.2rem);
  }

  .overlay-dialog-body {
    height: 100%;
    width: 100%;
    max-width: max-content;
    max-height: max-content;

    display: flex;
    flex-direction: column;

    background: var(--el-bg-color);
    box-shadow: 0.2rem 0.4rem 1rem 1rem var(--el-box-shadow);
    border: 1px solid var(--el-border-color-lighter);

    overflow: hidden;
    transition: all 200ms ease;
  }

  &[data-showing='false'] {
    pointer-events: none;
    opacity: 0;
    .overlay-dialog-body {
      pointer-events: none;
      transform: scale(0.95);
    }
  }
  &[data-showing='true'] {
    pointer-events: all;
    opacity: 1;
    .overlay-dialog-body {
      pointer-events: all;
      transform: scale(1);
    }
  }
}
</style>
