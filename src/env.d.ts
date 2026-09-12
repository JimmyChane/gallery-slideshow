/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'uat' | 'prod';
  readonly VITE_BACKEND_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
