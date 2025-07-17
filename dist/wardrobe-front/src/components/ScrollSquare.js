"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./ScrollSquare.css");
const ScrollSquare = () => {
    const containerRef = (0, react_1.useRef)(null);
    const [visible, setVisible] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setVisible(entry.isIntersecting);
        }, {
            threshold: 0.5,
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "spacer" }), " ", (0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: "trigger-zone" }), (0, jsx_runtime_1.jsx)("div", { className: `fullscreen-overlay ${visible ? 'show' : ''}` })] }));
};
exports.default = ScrollSquare;
//# sourceMappingURL=ScrollSquare.js.map