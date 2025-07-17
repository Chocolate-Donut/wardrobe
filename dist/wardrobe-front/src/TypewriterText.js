"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./TypewriterText.css");
const TypewriterText = ({ text }) => {
    const [animate, setAnimate] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => {
            setAnimate(false);
        }, 6000);
        return () => clearTimeout(timer);
    }, []);
    return ((0, jsx_runtime_1.jsx)("h1", { className: `cursor ${animate ? "typewriter-animation" : ""}`, children: text }));
};
exports.default = TypewriterText;
//# sourceMappingURL=TypewriterText.js.map