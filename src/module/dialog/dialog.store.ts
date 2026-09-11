import { defineDialogStore, defineUseDialog } from '@chanzor/vue-overlay';
import { defineStore } from 'pinia';

export const useDialogStore = defineStore('dialog', () => defineDialogStore());

export const useDialog = defineUseDialog({ getStore: () => useDialogStore() });
