// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // ssr: false,
  // nitro: { preset: 'static' },

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
