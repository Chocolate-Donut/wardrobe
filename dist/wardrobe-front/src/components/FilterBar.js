"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./FilterBar.css");
const FilterBar = ({ showSeasonOptions, showTrendOptions, handleSeasonClick, handleTrendClick, handleFilterBySeason, handleFilterByTrend, handleResetFilters, closeFilters, searchQuery, onSearchChange, onSearchSubmit, selectedColor, onColorChange, onClearColor, }) => {
    const filterRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                closeFilters();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeFilters]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "filter-bar", ref: filterRef, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: { flexShrink: 0 }, children: (0, jsx_runtime_1.jsx)("button", { className: "filter-button", onClick: handleSeasonClick, children: "season" }) }), (0, jsx_runtime_1.jsxs)("div", { className: `season-options-container ${showSeasonOptions ? 'show' : ''}`, children: [(0, jsx_runtime_1.jsx)("button", { style: { borderRadius: '30px' }, onClick: () => handleFilterBySeason('spring'), children: "\uD83C\uDF38" }), (0, jsx_runtime_1.jsx)("button", { style: { borderRadius: '30px' }, onClick: () => handleFilterBySeason('summer'), children: "\u2600\uFE0F" }), (0, jsx_runtime_1.jsx)("button", { style: { borderRadius: '30px' }, onClick: () => handleFilterBySeason('autumn'), children: "\uD83C\uDF42" }), (0, jsx_runtime_1.jsx)("button", { style: { borderRadius: '30px' }, onClick: () => handleFilterBySeason('winter'), children: "\u2744\uFE0F" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: { flexShrink: 0 }, children: (0, jsx_runtime_1.jsx)("button", { className: "filter-button", onClick: handleTrendClick, children: "trend" }) }), (0, jsx_runtime_1.jsxs)("div", { className: `trend-options-container ${showTrendOptions ? 'show' : ''}`, children: [(0, jsx_runtime_1.jsx)("button", { style: { borderRadius: '30px' }, onClick: () => handleFilterByTrend('casual'), children: "\uD83C\uDF00 Casual" }), (0, jsx_runtime_1.jsx)("button", { style: { borderRadius: '30px' }, onClick: () => handleFilterByTrend('glamor'), children: "\uD83D\uDC8E Glamor" }), (0, jsx_runtime_1.jsx)("button", { style: { borderRadius: '30px' }, onClick: () => handleFilterByTrend('sport'), children: "\uD83C\uDFCB\uFE0F\u200D\u2642\uFE0F Sport" }), (0, jsx_runtime_1.jsx)("button", { style: { borderRadius: '30px' }, onClick: () => handleFilterByTrend('retro'), children: "\uD83D\uDD70\uFE0F Retro" })] })] }), (0, jsx_runtime_1.jsx)("div", { style: { flexShrink: 0 }, children: (0, jsx_runtime_1.jsx)("button", { onClick: handleResetFilters, className: "reset-button", children: "Reset" }) }), onSearchChange && onSearchSubmit && ((0, jsx_runtime_1.jsxs)("div", { className: "search-container", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search outfits...", className: "search-input", value: searchQuery, onChange: (e) => onSearchChange(e.target.value) }), (0, jsx_runtime_1.jsx)("button", { className: "search-btn", onClick: onSearchSubmit, children: "Search" })] })), onColorChange && selectedColor !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "color-picker-container", children: [(0, jsx_runtime_1.jsx)("input", { type: "color", onChange: (e) => onColorChange(e.target.value), value: selectedColor || '#ffffff', className: "color-picker" }), selectedColor && onClearColor && ((0, jsx_runtime_1.jsx)("div", { className: "selected-color-preview", style: { backgroundColor: selectedColor }, children: (0, jsx_runtime_1.jsx)("button", { className: "clear-color-btn", onClick: onClearColor, children: "\u00D7" }) }))] }))] }));
};
exports.default = FilterBar;
//# sourceMappingURL=FilterBar.js.map