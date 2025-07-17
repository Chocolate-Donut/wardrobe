"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const TestMessage = () => {
    return (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => antd_1.message.success('Привет, мир!'), children: "\u0422\u0435\u0441\u0442" });
};
exports.default = TestMessage;
//# sourceMappingURL=TestMessage.js.map