"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const vite_plugin_pwa_1 = require("vite-plugin-pwa");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)(),
        (0, vite_plugin_pwa_1.VitePWA)({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /.*\.(?:js|css|html|json|png|jpg|jpeg|gif|svg|ico)/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'static-assets',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 24 * 60 * 60,
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
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'dynamic-assets',
                            networkTimeoutSeconds: 10,
                        },
                    },
                ],
            },
        }),
    ],
});
//# sourceMappingURL=vite.config.js.map