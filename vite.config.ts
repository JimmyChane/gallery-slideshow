import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { type ConfigEnv, defineConfig, loadEnv } from 'vite';
import ViteInspect from 'vite-plugin-inspect';
import z, { ZodError } from 'zod';

async function validateBackendHost(env: Record<string, string>): Promise<string> {
  const schema = z.url().min(1);

  const value = await schema.parseAsync(env['VITE_BACKEND_HOST']).catch((e: Error) => {
    if (e instanceof ZodError) {
      throw new Error(['VITE_BACKEND_HOST:', ...e.flatten().formErrors].join('\n  - '));
    }

    throw e;
  });

  return value;
}

async function validateAppEnv(env: Record<string, string>): Promise<'uat' | 'prod'> {
  const envList = ['uat', 'prod'] as const;
  type envType = (typeof envList)[number];

  if (!envList.includes(env['VITE_APP_ENV'] as envType)) {
    const list = ['dev', 'uat', 'prod', 'archive'];
    throw new Error(`Missing env "VITE_APP_ENV", expect ${list.join(', ')}, got "${env.VITE_APP_ENV}"}`);
  }

  return env.VITE_APP_ENV as envType;
}

async function validateEnv(mode: ConfigEnv) {
  const env = loadEnv(mode.mode, __dirname, 'VITE_');

  const VITE_BACKEND_HOST = await validateBackendHost(env);
  const VITE_APP_ENV = await validateAppEnv(env);

  return { VITE_BACKEND_HOST, VITE_APP_ENV };
}

// https://vite.dev/config/
export default defineConfig(async (mode) => {
  await validateEnv(mode);

  return {
    plugins: [vue(), ViteInspect()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { port: 3001 },
  };
});
