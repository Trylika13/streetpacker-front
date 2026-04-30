import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'StreetPacker',
          short_name: 'StreetPacker',
          description: 'StreetPacker: par les backpackers, pour les backpackers' ,
          theme_color: '#09090B',
          background_color: '#09090B',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'logo-gecko.png',
              sizes: '192x192',
              type: 'png',
              purpose: 'any maskable'
            },
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
