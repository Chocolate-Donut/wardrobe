"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const react_router_dom_1 = require("react-router-dom");
require("../App.css");
require("keen-slider/keen-slider.min.css");
const BubbleButton_1 = __importDefault(require("../BubbleButton"));
const TypewriterText_1 = __importDefault(require("../TypewriterText"));
const ScrollToTopButton_1 = __importDefault(require("../components/ScrollToTopButton"));
const WeatherBlock_1 = __importDefault(require("../components/WeatherBlock"));
const FilterBar_1 = __importDefault(require("../components/FilterBar"));
const LookCard_1 = __importDefault(require("../components/LookCard"));
const WeatherCarousel_1 = __importDefault(require("../components/WeatherCarousel"));
const MainPage = ({ temperature, icon, city, handleCityChange, isAppInstalled, handleInstallClick, showSeasonOptions, showTrendOptions, handleSeasonClick, handleTrendClick, handleFilterBySeason, handleFilterByTrend, handleResetFilters, setShowSeasonOptions, setShowTrendOptions, popularLooks, weatherLooks, sliderRef, setLoginModalVisible, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app-wrapper", children: [(0, jsx_runtime_1.jsxs)("div", { style: { backgroundAttachment: 'relative',
                    backgroundRepeat: 'no-repeat',
                    background: 'linear-gradient(to bottom, rgba(36, 36, 36, 0.85), rgba(53, 53, 53, 0.5)), url(/pink_dress_bg.png)',
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'multiply',
                }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "main-container", children: [(0, jsx_runtime_1.jsx)("div", { style: { marginBottom: '20px' }, children: !isAppInstalled && ((0, jsx_runtime_1.jsx)("button", { onClick: handleInstallClick, children: "Download as App" })) }), (0, jsx_runtime_1.jsxs)("div", { className: "header-bar", children: [(0, jsx_runtime_1.jsx)("img", { src: "/logo.svg", alt: "Logo", style: { height: '2.5rem' } }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(WeatherBlock_1.default, { temperature: temperature, icon: icon, city: city, onCityChange: handleCityChange }), (0, jsx_runtime_1.jsx)("div", { style: { marginRight: '0.8rem', marginLeft: '2rem' }, children: (0, jsx_runtime_1.jsx)(BubbleButton_1.default, { onClick: () => setLoginModalVisible(true), children: "Log in" }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/signup", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", style: { color: 'rgb(255, 255, 255)', backgroundColor: 'rgba(255, 255, 255, 0.33)', backgroundBlendMode: 'soft-light', border: 0, fontSize: '1em' }, children: "Sign up" }) })] })] }), (0, jsx_runtime_1.jsx)("div", { style: { paddingBottom: '3rem', color: 'white' }, children: (0, jsx_runtime_1.jsx)(TypewriterText_1.default, { text: "Welcome, Dear." }) }), (0, jsx_runtime_1.jsx)("h2", { style: { fontSize: '1rem', fontWeight: '-moz-initial', marginBottom: '-2rem', paddingLeft: '10rem' }, children: "Recommendations:" }), (0, jsx_runtime_1.jsx)(WeatherCarousel_1.default, { weatherLooks: weatherLooks, sliderRef: sliderRef }), (0, jsx_runtime_1.jsx)("h2", { style: { fontSize: '1rem', fontWeight: '-moz-initial', marginBottom: '2rem', paddingLeft: '10rem' }, children: "Most popular now:" }), (0, jsx_runtime_1.jsx)(FilterBar_1.default, { showSeasonOptions: showSeasonOptions, showTrendOptions: showTrendOptions, handleSeasonClick: handleSeasonClick, handleTrendClick: handleTrendClick, handleFilterBySeason: handleFilterBySeason, handleFilterByTrend: handleFilterByTrend, handleResetFilters: handleResetFilters, closeFilters: () => {
                                    setShowSeasonOptions(false);
                                    setShowTrendOptions(false);
                                } }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    boxSizing: 'border-box',
                                    padding: '2rem 5rem',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '40px',
                                    overflowY: 'auto',
                                    scrollBehavior: 'smooth',
                                    justifyContent: 'center',
                                    paddingTop: '80px'
                                }, children: popularLooks.map((look) => ((0, jsx_runtime_1.jsx)(LookCard_1.default, { look: look }))) })] }), (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", version: "1.1", className: "goo", children: (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("filter", { id: "goo", children: [(0, jsx_runtime_1.jsx)("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "10", result: "blur" }), (0, jsx_runtime_1.jsx)("feColorMatrix", { in: "blur", mode: "matrix", values: "1 0 0 0 0  \r\n                        0 1 0 0 0  \r\n                        0 0 1 0 0  \r\n                        0 0 0 19 -9", result: "goo" }), (0, jsx_runtime_1.jsx)("feComposite", { in: "SourceGraphic", in2: "goo", operator: "atop" })] }) }) })] }), (0, jsx_runtime_1.jsx)(ScrollToTopButton_1.default, {})] }));
};
exports.default = MainPage;
//# sourceMappingURL=MainPage.js.map