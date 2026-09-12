import { FEATURE_ADVANCE_DOWNLOAD } from '@/feature.ts';

import { useDialog } from '../dialog/dialog.store.ts';

import DownloadImageDialog, { type DownloadImageDialogProps } from './DownloadImage.dialog.vue';

export function useDownloadImageDialog() {
  return useDialog<DownloadImageDialogProps>({
    component: DownloadImageDialog,
    beforeApproveOpen: () => FEATURE_ADVANCE_DOWNLOAD,
  });
}
