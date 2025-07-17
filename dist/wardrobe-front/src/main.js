"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("react-dom/client");
require("./index.css");
const AppRoutes_1 = __importDefault(require("./AppRoutes"));
const react_router_dom_1 = require("react-router-dom");
const antd_1 = require("antd");
require("antd/dist/reset.css");
(0, client_1.createRoot)(document.getElementById('root')).render((0, jsx_runtime_1.jsx)(react_1.StrictMode, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(antd_1.ConfigProvider, { children: (0, jsx_runtime_1.jsx)(AppRoutes_1.default, {}) }) }) }));
//# sourceMappingURL=main.js.map