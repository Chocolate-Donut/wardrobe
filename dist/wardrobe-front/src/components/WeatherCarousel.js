"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const LookCard_1 = __importDefault(require("./LookCard"));
const WeatherCarousel = ({ weatherLooks, sliderRef, isAuthorized = false, favoriteIds, }) => {
    if (weatherLooks.length < 3) {
        return ((0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', marginTop: '6rem', paddingBottom: '5rem' }, children: ["Loading... ", (0, jsx_runtime_1.jsx)("img", { src: "/blackcat.gif", alt: "Loading", style: { width: '90px', height: '60px' } })] }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "wrapper", children: (0, jsx_runtime_1.jsx)("div", { className: "scene", children: (0, jsx_runtime_1.jsx)("div", { ref: sliderRef, className: "carousel keen-slider", children: weatherLooks.filter(look => look.isPrivate === false).slice(0, 9).map((look) => ((0, jsx_runtime_1.jsx)("div", { className: "carousel__cell", children: (0, jsx_runtime_1.jsx)(LookCard_1.default, { look: look, isAuthorized: isAuthorized, isInitiallyFavorite: favoriteIds?.includes(look.id) }) }, look.id))) }) }) }));
};
exports.default = WeatherCarousel;
//# sourceMappingURL=WeatherCarousel.js.map