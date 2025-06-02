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
    head: {
      title: '角色大師工具網站',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'RMU個人工具站。' }
      ],
      link: [
        // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
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