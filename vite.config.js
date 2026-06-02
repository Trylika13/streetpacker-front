import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'gecko.svg', 'logo-gecko.png'],
      manifest: {
        name: 'StreetPacker',
        short_name: 'StreetPacker',
        description: 'StreetPacker: par les backpackers, pour les backpackers',
        start_url: '.',

        // ICI : On harmonise avec le design Island Clean
        theme_color: '#F4F7F5',
        background_color: '#F4F7F5',

        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'gecko.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'logo-gecko.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'logo-gecko.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'logo-gecko.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable' // Très important pour Android !
          },
          {
            src: 'logo-gecko.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any' // Pour l'icône sur l'écran d'accueil iOS
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
