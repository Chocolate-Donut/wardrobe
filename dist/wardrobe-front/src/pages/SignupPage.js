"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const axios_1 = __importDefault(require("axios"));
require("./SignupPage.css");
const SignupPage = () => {
    const [email, setEmail] = (0, react_1.useState)('');
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, react_1.useState)(false);
    const [isMouthOpen, setIsMouthOpen] = (0, react_1.useState)(false);
    const [isRegistered, setIsRegistered] = (0, react_1.useState)(false);
    const [verificationCode, setVerificationCode] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setIsMouthOpen(true);
    };
    (0, react_1.useEffect)(() => {
        if (isMouthOpen) {
            const timeout = setTimeout(() => setIsMouthOpen(false), 1200);
            return () => clearTimeout(timeout);
        }
    }, [isMouthOpen]);
    const handleSignup = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await axios_1.default.post('http://localhost:3000/users/register', {
                email,
                username,
                password,
            });
            alert('Check your email for the verification code!');
            setIsRegistered(true);
        }
        catch (error) {
            alert('Registration failed');
            console.error(error);
        }
    };
    const handleVerifyCode = async () => {
        try {
            await axios_1.default.post('http://localhost:3000/users/verify', {
                email,
                code: verificationCode,
            });
            alert('Account verified successfully!');
            navigate('/');
        }
        catch (error) {
            alert('Verification failed');
            console.error(error);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "signup-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "cat-header", children: [(0, jsx_runtime_1.jsx)("img", { src: "/\u043A\u043E\u0442\u0438\u043A\u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0439\u0440\u043E\u0442.ico", alt: "closed mouth", className: `upside-down-cat ${isMouthOpen ? 'hidden' : 'visible'}` }), (0, jsx_runtime_1.jsx)("img", { src: "/\u043A\u043E\u0442\u0438\u043A\u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0439\u0440\u043E\u0442.ico", alt: "open mouth", className: `upside-down-cat ${isMouthOpen ? 'visible' : 'hidden'}` })] }), !isRegistered ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Create Account \u2728" }), (0, jsx_runtime_1.jsx)("label", { children: "Email:" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: email, onChange: handleInputChange(setEmail), className: "input-field" }), (0, jsx_runtime_1.jsx)("label", { children: "Username:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: username, onChange: handleInputChange(setUsername), className: "input-field" }), (0, jsx_runtime_1.jsx)("label", { children: "Password:" }), (0, jsx_runtime_1.jsxs)("div", { className: "password-wrapper", children: [(0, jsx_runtime_1.jsx)("input", { type: showPassword ? 'text' : 'password', value: password, onChange: handleInputChange(setPassword), className: "input-field" }), (0, jsx_runtime_1.jsx)("span", { className: "eye-icon", onClick: () => setShowPassword(prev => !prev), style: { cursor: 'pointer' }, children: showPassword ? '🙈' : '👁️' })] }), (0, jsx_runtime_1.jsx)("label", { children: "Confirm Password:" }), (0, jsx_runtime_1.jsxs)("div", { className: "password-wrapper", children: [(0, jsx_runtime_1.jsx)("input", { type: showConfirmPassword ? 'text' : 'password', value: confirmPassword, onChange: handleInputChange(setConfirmPassword), className: "input-field" }), (0, jsx_runtime_1.jsx)("span", { className: "eye-icon", onClick: () => setShowConfirmPassword(prev => !prev), style: { cursor: 'pointer' }, children: showConfirmPassword ? '🙈' : '👁️' })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSignup, className: "signup-button", children: "Sign Up" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Enter Verification Code" }), (0, jsx_runtime_1.jsx)("label", { children: "Code:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: verificationCode, onChange: (e) => setVerificationCode(e.target.value), className: "input-field" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleVerifyCode, className: "signup-button", children: "Verify Account" })] }))] }));
};
exports.default = SignupPage;
//# sourceMappingURL=SignupPage.js.map