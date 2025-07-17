import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        // Работа с cache-first стратегией
        runtimeCaching: [
          {
            urlPattern: /.*\.(?:js|css|html|json|png|jpg|jpeg|gif|svg|ico)/,
            handler: 'CacheFirst', // кэшируем все статичные файлы
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60, // 1 день
              },
            },
          },
          {
            urlPattern: /.*\.(?:woff|woff2|eot|ttf|otf)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-assets',
            },
          },
          {
            urlPattern: /.*\.(?:json|xml|txt)/,
            handler: 'NetworkFirst', // для JSON-файлов и других данных
            options: {
              cacheName: 'dynamic-assets',
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
})
