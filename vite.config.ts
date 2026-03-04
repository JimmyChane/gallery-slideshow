import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { type ConfigEnv, defineConfig, loadEnv } from 'vite';
import ViteInspect from 'vite-plugin-inspect';
import z, { ZodError } from 'zod';

type Env = { VITE_BACKEND_HOST: string; VITE_ACCESS_TOKEN: string };

async function validateBackendHost(
  env: Record<string, string>,
): Promise<string> {
  const schema = z.url().min(1);

  const value = await schema
    .parseAsync(env['VITE_BACKEND_HOST'])
    .catch((e: Error) => {
      if (e instanceof ZodError) {
        throw new Error(
          ['VITE_BACKEND_HOST:', ...e.flatten().formErrors].join('\n  - '),
        );
      }

      throw e;
    });

  return value;
}
async function validateAccessToken(
  env: Record<string, string>,
): Promise<string> {
  const schema = z.string().min(1);

  const value = await schema
    .parseAsync(env['VITE_ACCESS_TOKEN'])
    .catch((e: Error) => {
      if (e instanceof ZodError) {
        throw new Error(
          ['VITE_ACCESS_TOKEN:', ...e.flatten().formErrors].join('\n  - '),
        );
      }

      throw e;
    });

  return value;
}
async function validateEnv(mode: ConfigEnv): Promise<Env> {
  const env = loadEnv(mode.mode, __dirname, 'VITE_');

  const VITE_BACKEND_HOST = await validateBackendHost(env);
  const VITE_ACCESS_TOKEN = await validateAccessToken(env);

  return { VITE_BACKEND_HOST, VITE_ACCESS_TOKEN };
}

// https://vite.dev/config/
export default defineConfig(async (mode) => {
  await validateEnv(mode);

  return {
    plugins: [vue(), ViteInspect()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: { port: 3001 },
  };
});
