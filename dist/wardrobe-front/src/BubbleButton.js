"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./BubbleButton.css");
const gsap_1 = __importDefault(require("gsap"));
const BubbleButton = ({ children, onClick }) => {
    const buttonRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!buttonRef.current)
            return;
        const $button = buttonRef.current;
        const $circlesTopLeft = $button.parentElement?.querySelectorAll('.circle.top-left');
        const $circlesBottomRight = $button.parentElement?.querySelectorAll('.circle.bottom-right');
        const $effectButton = $button.parentElement?.querySelector('.effect-button');
        if (!$circlesTopLeft || !$circlesBottomRight || !$effectButton)
            return;
        const tlTop = gsap_1.default.timeline();
        const tlBottom = gsap_1.default.timeline();
        const btTl = gsap_1.default.timeline({ paused: true });
        tlTop.to($circlesTopLeft, {
            x: -25, y: -25, scaleY: 2, duration: 1.2, ease: "slow(0.1, 0.7, false)"
        })
            .to($circlesTopLeft[0], { scale: 0.2, x: "+=6", y: "-=2", duration: 0.1 })
            .to($circlesTopLeft[1], { scaleX: 1, scaleY: 0.8, x: "-=10", y: "-=7", duration: 0.1 }, "-=0.1")
            .to($circlesTopLeft[2], { scale: 0.2, x: "-=15", y: "+=6", duration: 0.1 }, "-=0.1")
            .to($circlesTopLeft, { scale: 0, opacity: 0, duration: 1 }, "-=0.1");
        tlBottom.to($circlesBottomRight, {
            x: 30, y: 30, duration: 1.1, ease: "slow(0.1, 0.7, false)"
        })
            .to($circlesBottomRight[0], { scale: 0.2, x: "-=6", y: "+=3", duration: 0.1 })
            .to($circlesBottomRight[1], { scale: 0.8, x: "+=7", y: "+=3", duration: 0.1 }, "-=0.1")
            .to($circlesBottomRight[2], { scale: 0.2, x: "+=15", y: "-=6", duration: 0.1 }, "-=0.2")
            .to($circlesBottomRight, { scale: 0, opacity: 0, duration: 1 }, "-=0.1");
        btTl.add(tlTop)
            .to($effectButton, { scaleY: 1.1, duration: 0.8 }, 0.1)
            .add(tlBottom, 0.2)
            .to($effectButton, { scale: 1, ease: "elastic.out(1.2, 0.4)", duration: 1.8 }, 1.2);
        btTl.timeScale(2.6);
        $button.addEventListener("mouseenter", () => {
            btTl.restart();
        });
        return () => {
            $button.removeEventListener("mouseenter", () => btTl.restart());
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)("span", { className: "button--bubble__container", children: [(0, jsx_runtime_1.jsx)("button", { className: "button button--bubble", ref: buttonRef, onClick: onClick, children: children }), (0, jsx_runtime_1.jsxs)("span", { className: "button--bubble__effect-container", children: [(0, jsx_runtime_1.jsx)("span", { className: "circle top-left" }), (0, jsx_runtime_1.jsx)("span", { className: "circle top-left" }), (0, jsx_runtime_1.jsx)("span", { className: "circle top-left" }), (0, jsx_runtime_1.jsx)("span", { className: "button effect-button" }), (0, jsx_runtime_1.jsx)("span", { className: "circle bottom-right" }), (0, jsx_runtime_1.jsx)("span", { className: "circle bottom-right" }), (0, jsx_runtime_1.jsx)("span", { className: "circle bottom-right" })] })] }));
};
exports.default = BubbleButton;
//# sourceMappingURL=BubbleButton.js.map