// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
      pageTransition: {name: 'page', mode: 'out-in'}
  },
  devtools: {enabled: true},
  css: ['~/assets/css/main.css'],
  modules: [
    '@ant-design-vue/nuxt', 
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
  antd:{
    // Options
  },
  runtimeConfig: {
    public: {
      nodeEnv: process.env.NODE_ENV || '',
    },
  },
})