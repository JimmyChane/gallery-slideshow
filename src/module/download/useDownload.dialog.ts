import { FEATURE_ADVANCE_DOWNLOAD } from '@/feature.ts';

import { useDialog } from '../dialog/dialog.store.ts';

import DownloadDialog, { type DownloadDialogProps } from './Download.dialog.vue';

export function useDownloadDialog() {
  return useDialog<DownloadDialogProps>({
    component: DownloadDialog,
    beforeApproveOpen: () => FEATURE_ADVANCE_DOWNLOAD,
  });
}
