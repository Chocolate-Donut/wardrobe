"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ScrollToTopButton = () => {
    const [visible, setVisible] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if (!visible)
        return null;
    return ((0, jsx_runtime_1.jsx)("button", { className: "scroll-to-top", onClick: scrollToTop, children: (0, jsx_runtime_1.jsx)("img", { src: "/iconup.png", alt: "Up", style: { width: '30px', height: '30px' } }) }));
};
exports.default = ScrollToTopButton;
//# sourceMappingURL=ScrollToTopButton.js.map