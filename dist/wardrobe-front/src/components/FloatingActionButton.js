"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const FloatingActionButton = ({ onClick }) => ((0, jsx_runtime_1.jsx)("button", { onClick: onClick, style: fabStyle, children: "+" }));
const fabStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#8860D0',
    color: 'white',
    fontSize: '30px',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    zIndex: 999,
};
exports.default = FloatingActionButton;
//# sourceMappingURL=FloatingActionButton.js.map