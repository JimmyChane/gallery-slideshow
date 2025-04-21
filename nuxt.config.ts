// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: { port: 5173 },

  // ssr: false,
  // nitro: { preset: 'static' },

  runtimeConfig: { public: { BACKEND_HOST: process.env.BACKEND_HOST } },

  components: false,
  imports: { autoImport: false },

  modules: ['@pinia/nuxt'],
  css: ['~/src/main.css'],

  typescript: {
    tsConfig: {
      compilerOptions: { noImplicitAny: true, noUnusedLocals: true },
    },
  },
});
