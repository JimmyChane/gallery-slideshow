<script setup lang="ts">
import type { DialogProps } from '@chanzor/vue-overlay';
import { type Component, computed, ref, watch } from 'vue';

import { type ImageBlobModel, type ImagePathModel, getApiImgDownload } from '@/module/image/image.model.ts';

import CloseIcon from '@/components/icon/Close.icon.vue';
import CustomIcon from '@/components/icon/Custom.icon.vue';
import PreviewIcon from '@/components/icon/Preview.icon.vue';

export type DownloadImageDialogProps = { model: ImageBlobModel | ImagePathModel };

const { dialogPopup } = defineProps<DialogProps<DownloadImageDialogProps>>();

type FileFormatType = Readonly<{ id: string; label: string; hint: string; ext: string; mime: string }>;
type DimensionPresetType = Readonly<{ id: PresetType; label: string; icon?: Component }>;

const FORMAT_JPG = {
  id: 'jpg',
  label: 'JPG',
  hint: 'Universal compatibility / Lossy',
  ext: 'jpg',
  mime: 'image/jpeg',
} satisfies FileFormatType;
const formats = [
  FORMAT_JPG,
  { id: 'png', label: 'PNG', hint: 'Lossless / Optimized encoding', ext: 'png', mime: 'image/png' },
  { id: 'webp', label: 'WebP', hint: 'High efficiency / Modern web', ext: 'webp', mime: 'image/webp' },
] satisfies FileFormatType[];
const DIMENSION_ORIGINAL = { id: 'original', label: 'Original', icon: PreviewIcon } satisfies DimensionPresetType;
const DIEMNSION_CUSTOM = { id: 'custom', label: 'Custom', icon: CustomIcon } satisfies DimensionPresetType;
const dimensions = [
  DIMENSION_ORIGINAL,
  { id: '1080p', label: '1080p (1920x1080)' },
  { id: '720p', label: '720p (1280x720)' },
  DIEMNSION_CUSTOM,
] satisfies DimensionPresetType[];

type PresetType = 'original' | '1080p' | '720p' | 'custom';

const selectedFormat = ref<FileFormatType>(FORMAT_JPG);
const selectedPreset = ref<DimensionPresetType>(DIMENSION_ORIGINAL);
const lockRatio = ref(true);

const width = ref(1920);
const height = ref(1080);

const thumbnailSrc = ref<string>('');
let thumbnailSrcTime = 0;

const isDownloading = ref(false);
let isDownloadingTime = 0;

const currentFormatInfo = computed(() => {
  return formats.find((f) => f.id === selectedFormat.value.id);
});

const filename = computed(() => dialogPopup.data?.model?.filename);

const originalExt = computed(() => {
  const parts = filename.value.split('.');
  const ext = parts.length > 1 ? parts[parts.length - 1] : 'PNG';
  return (ext || 'PNG').toUpperCase();
});

watch(
  () => dialogPopup.data?.model,
  async () => {
    const now = (thumbnailSrcTime = Date.now());

    const model = dialogPopup.data?.model;
    if (!model) {
      thumbnailSrc.value = '';
      return;
    }

    const src = await model.getSrc(300, 300).catch((e: Error) => e);
    if (now !== thumbnailSrcTime) return;

    if (src instanceof Error) {
      console.error('Failed to load image metadata for download dialog', src);
      return;
    }

    thumbnailSrc.value = src ?? '';
  },
  { immediate: true },
);

function selectPreset(preset: DimensionPresetType): void {
  selectedPreset.value = preset;
  if (preset.id === 'original') {
    width.value = -1;
    height.value = -1;
  } else if (preset.id === '1080p') {
    width.value = 1920;
    height.value = 1080;
  } else if (preset.id === '720p') {
    width.value = 1280;
    height.value = 720;
  }
}

function onWidthInput(event: Event): void {
  const val = parseInt((event.target as HTMLInputElement).value, 10);
  if (isNaN(val) || val <= 0) return;

  width.value = val;
  selectedPreset.value = DIEMNSION_CUSTOM;

  if (lockRatio.value && width.value > 0) {
    const ratio = height.value / width.value;
    height.value = Math.max(1, Math.round(val * ratio));
  }
}

function onHeightInput(event: Event): void {
  const val = parseInt((event.target as HTMLInputElement).value, 10);
  if (isNaN(val) || val <= 0) return;

  height.value = val;
  selectedPreset.value = DIEMNSION_CUSTOM;

  if (lockRatio.value && height.value > 0) {
    const ratio = width.value / height.value;
    width.value = Math.max(1, Math.round(val * ratio));
  }
}

async function triggerDownload() {
  const now = (isDownloadingTime = Date.now());

  if (isDownloading.value) return;
  isDownloading.value = true;

  const error = await Promise.resolve()
    .then(async () => {
      const model = dialogPopup.data.model;

      switch (selectedPreset.value.id) {
        case 'original':
          await getApiImgDownload(model.filename, { format: selectedFormat.value.id });
          break;
        case '1080p':
        case '720p':
        case 'custom':
          await getApiImgDownload(model.filename, {
            format: selectedFormat.value.id,
            width: width.value,
            height: height.value,
          });
          break;
      }
    })
    .catch((e: Error) => e);
  if (now !== isDownloadingTime) return;
  if (error instanceof Error) console.error('Download error:', error);

  isDownloading.value = false;
}
</script>

<template>
  <div class="download-dialog-container">
    <!-- Header -->
    <div class="dialog-header">
      <div class="header-title-group">
        <div class="header-icon-box">
          <svg viewBox="0 0 24 24" class="icon" fill="currentColor">
            <path
              d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"
            />
          </svg>
        </div>
        <h2 class="dialog-title">Download Asset</h2>
      </div>

      <button type="button" class="dialog-close-btn" aria-label="Close dialog" @click="() => dialogPopup.close()">
        <CloseIcon />
      </button>
    </div>

    <!-- Asset Preview Card -->
    <div class="asset-card">
      <div class="asset-thumbnail">
        <img v-if="thumbnailSrc" :src="thumbnailSrc" :alt="filename" />
        <div v-else class="asset-thumbnail-placeholder">
          <PreviewIcon class="icon" />
        </div>
      </div>
      <div class="asset-info">
        <span class="asset-filename">{{ filename }}</span>
        <span class="asset-badge">{{ originalExt }}</span>
      </div>
    </div>

    <div class="section-group">
      <div class="section-header">
        <span class="section-label">FILE FORMAT</span>
        <span v-if="currentFormatInfo" class="section-hint">{{ currentFormatInfo.hint }}</span>
      </div>

      <div class="format-segmented-control">
        <button
          v-for="item in formats"
          :key="item.id"
          type="button"
          class="format-tab-btn"
          :class="{ active: selectedFormat.id === item.id }"
          @click="selectedFormat = item"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="section-group">
      <div class="section-header">
        <span class="section-label">SELECT PRESET</span>
      </div>

      <div class="preset-chips-row">
        <button
          v-for="item in dimensions as DimensionPresetType[]"
          type="button"
          class="preset-chip"
          :class="{ active: selectedPreset.id === item.id }"
          @click="() => selectPreset(item)"
        >
          <component v-if="item.icon" class="preset-icon" :is="item.icon" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- Width / Height / Lock Ratio Box -->
    <div class="dimensions-card">
      <div class="dimension-field">
        <label class="field-label">WIDTH</label>
        <div class="input-container">
          <input type="number" class="dimension-input" :value="width" min="1" max="10000" @input="onWidthInput" />
          <span class="input-suffix">PX</span>
        </div>
      </div>

      <label class="lock-ratio-toggle">
        <input type="checkbox" v-model="lockRatio" class="ratio-checkbox" />
        <span class="checkbox-custom">
          <svg v-if="lockRatio" viewBox="0 0 24 24" class="check-svg" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </span>
        <span class="lock-ratio-label">Lock Ratio</span>
      </label>

      <div class="dimension-field">
        <label class="field-label">HEIGHT</label>
        <div class="input-container">
          <input type="number" class="dimension-input" :value="height" min="1" max="10000" @input="onHeightInput" />
          <span class="input-suffix">PX</span>
        </div>
      </div>
    </div>

    <div class="dialog-footer">
      <div class="footer-action-left"></div>

      <div class="footer-action-right">
        <button type="button" class="btn-cancel" @click="() => dialogPopup.close()">Cancel</button>

        <button type="button" class="btn-download" :disabled="isDownloading" @click="triggerDownload">
          <svg viewBox="0 0 24 24" class="btn-icon" fill="currentColor">
            <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" />
          </svg>
          <span>{{ isDownloading ? 'Preparing...' : 'Download File' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.download-dialog-container {
  width: 580px;
  max-width: calc(100vw - 2rem);
  box-sizing: border-box;
  padding: 1.5rem;
  background-color: #12131c;
  border-radius: 1rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.6);

  overflow-y: auto;
}

/* Header */
.dialog-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .header-title-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;

    .header-icon-box {
      width: 2.25rem;
      height: 2.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.06);
      border-radius: 0.6rem;
      color: #a4a9f7;

      .icon {
        width: 1.15rem;
        height: 1.15rem;
      }
    }

    .dialog-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
  }

  .dialog-close-btn {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 0.5rem;
    color: #8c93a8;
    cursor: pointer;
    transition: all 150ms ease;
    font-size: 1.1rem;

    .icon {
      width: 1.1rem;
      height: 1.1rem;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    &:active {
      transform: scale(0.94);
    }
  }
}

/* Asset Card */
.asset-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background-color: #171825;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;

  .asset-thumbnail {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #0e0f17;
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .asset-thumbnail-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4b5268;

      .icon {
        font-size: 1.5rem;
      }
    }
  }

  .asset-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;

    .asset-filename {
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
    }

    .asset-badge {
      background-color: #173852;
      color: #38bdf8;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      padding: 0.15rem 0.4rem;
      border-radius: 0.25rem;
      text-transform: uppercase;
    }
  }
}

/* Section Groups */
.section-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .section-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .section-label {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #8c93a8;
      text-transform: uppercase;
    }

    .section-hint {
      font-size: 0.75rem;
      color: #6a7187;
      font-family: monospace;
    }
  }
}

.format-segmented-control {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  background-color: #171825;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.6rem;
  padding: 0.25rem;
  gap: 0.25rem;

  .format-tab-btn {
    background: transparent;
    color: #8c93a8;
    font-weight: 600;
    font-size: 0.85rem;
    padding: 0.55rem 0;
    border-radius: 0.45rem;
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(.active) {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.04);
    }

    &.active {
      background-color: #b0b5fc;
      color: #0f101a;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(176, 181, 252, 0.25);
    }
  }
}

/* Preset Chips */
.preset-chips-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-chips-subrow {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.25rem;
}

.preset-chip {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
  background-color: #171825;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  padding: 0.45rem 0.85rem;
  color: #c7cddb;
  font-size: 0.825rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;

  .preset-icon {
    width: 0.95rem;
    height: 0.95rem;
    font-size: 0.95rem;
    color: #8c93a8;
    transition: color 150ms ease;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  &.active {
    border-color: #a4a9f7;
    background-color: #1c1e30;
    color: #ffffff;

    .preset-icon {
      color: #a4a9f7;
    }
  }

  &:active {
    transform: scale(0.97);
  }
}

/* Dimensions Card */
.dimensions-card {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background-color: #171825;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;

  .dimension-field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    .field-label {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #8c93a8;
      text-transform: uppercase;
    }

    .input-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #0f101a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.5rem;
      padding: 0.45rem 0.75rem;
      transition: border-color 150ms ease;

      &:focus-within {
        border-color: #a4a9f7;
      }

      .dimension-input {
        width: 100%;
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: 0.9rem;
        font-weight: 600;
        outline: none;

        /* Remove number spinner buttons */
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        -moz-appearance: textfield;
      }

      .input-suffix {
        min-width: max-content;
        font-size: 0.75rem;
        font-weight: 700;
        color: #6a7187;
        margin-left: 0.4rem;
      }
    }
  }

  .lock-ratio-toggle {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding-bottom: 0.6rem;

    .ratio-checkbox {
      display: none;
    }

    .checkbox-custom {
      width: 1.15rem;
      height: 1.15rem;
      border-radius: 0.3rem;
      background-color: #b0b5fc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0e0f18;
      transition: all 150ms ease;

      .check-svg {
        width: 0.85rem;
        height: 0.85rem;
      }
    }

    .ratio-checkbox:not(:checked) + .checkbox-custom {
      background-color: #0f101a;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .lock-ratio-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #c7cddb;
    }
  }
}

/* Footer Actions */
.dialog-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
  gap: 1rem;

  .btn-copy-link {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    background-color: #171825;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 0.6rem 1rem;
    color: #c7cddb;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 150ms ease;

    .btn-icon {
      width: 1rem;
      height: 1rem;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.2);
    }

    &:active {
      transform: scale(0.97);
    }
  }

  .footer-action-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.85rem;

    .btn-cancel {
      background: transparent;
      color: #c7cddb;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.6rem 0.85rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: color 150ms ease;

      &:hover {
        color: #ffffff;
      }
    }

    .btn-download {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      background-color: #b0b5fc;
      border: none;
      border-radius: 0.5rem;
      padding: 0.6rem 1.25rem;
      color: #0f101a;
      font-size: 0.875rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(176, 181, 252, 0.3);
      transition: all 150ms ease;

      .btn-icon {
        width: 1.1rem;
        height: 1.1rem;
      }

      &:hover:not(:disabled) {
        background-color: #c2c7fd;
        box-shadow: 0 6px 16px rgba(176, 181, 252, 0.4);
      }

      &:active:not(:disabled) {
        transform: scale(0.97);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}
</style>
