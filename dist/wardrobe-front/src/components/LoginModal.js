"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./LoginModal.css");
const axios_1 = __importDefault(require("axios"));
const LoginModal = ({ visible, onClose, onLoginSuccess }) => {
    const [isMouthOpen, setIsMouthOpen] = (0, react_1.useState)(false);
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const timeout = setTimeout(() => {
            setIsMouthOpen(false);
        }, 1200);
        return () => clearTimeout(timeout);
    }, [isMouthOpen]);
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setIsMouthOpen(prev => !prev);
    };
    const handleLogin = async () => {
        try {
            const res = await axios_1.default.post('http://localhost:3000/auth/login', {
                email,
                password,
            });
            const { access_token, user } = res.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('username', user.username);
            localStorage.setItem('avatar', user.avatar || '');
            localStorage.setItem('login_success', 'true');
            onLoginSuccess?.();
        }
        catch (error) {
            alert('Login failed');
        }
    };
    if (!visible)
        return null;
    const handleOverlayClick = () => {
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "login-overlay", onClick: handleOverlayClick, children: (0, jsx_runtime_1.jsxs)("div", { className: "login-container", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsx)("div", { className: "header", children: (0, jsx_runtime_1.jsx)("img", { src: "/headerlogin.svg", alt: "cat1", className: "cat" }) }), (0, jsx_runtime_1.jsx)("label", { children: "\u2728 enter login:" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: email, onChange: handleInputChange(setEmail), className: "input-field" }), (0, jsx_runtime_1.jsx)("label", { children: "\u2728 password:" }), (0, jsx_runtime_1.jsxs)("div", { className: "password-wrapper", children: [(0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: password, onChange: handleInputChange(setPassword), className: "input-field" }), (0, jsx_runtime_1.jsx)("span", { className: "eye-icon", onClick: () => setShowPassword(prev => !prev), style: { cursor: 'pointer' }, children: showPassword ? '🙈' : '👁️' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "button-row", children: [(0, jsx_runtime_1.jsx)("button", { className: "back-button", onClick: onClose, children: "\u21A9" }), (0, jsx_runtime_1.jsx)("a", { className: "create-link", href: "/signup", children: "create new account" }), (0, jsx_runtime_1.jsx)("button", { className: "login-button", onClick: handleLogin, children: "\u2714" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "cat-mouth-wrapper", children: [(0, jsx_runtime_1.jsx)("img", { src: "/\u043A\u043E\u0442\u0438\u043A\u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0439\u0440\u043E\u0442.ico", alt: "closed", className: `cat-mouth ${isMouthOpen ? 'hidden' : 'visible'}` }), (0, jsx_runtime_1.jsx)("img", { src: "/\u043A\u043E\u0442\u0438\u043A\u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0439\u0440\u043E\u0442.ico", alt: "open", className: `cat-mouth ${isMouthOpen ? 'visible' : 'hidden'}` })] })] }) }));
};
exports.default = LoginModal;
//# sourceMappingURL=LoginModal.js.map