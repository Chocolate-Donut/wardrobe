"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
require("./CreateLookPage.css");
const LookUploadModal_1 = __importDefault(require("../components/LookUploadModal"));
const RandomLookModal_1 = __importDefault(require("../components/RandomLookModal"));
const NavigationMenu_1 = __importDefault(require("../components/NavigationMenu"));
const CreateLookPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    const [showRandomModal, setShowRandomModal] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            padding: '2rem',
            minHeight: '100vh',
            backgroundImage: 'url(/bg_create.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backgroundBlendMode: 'darken',
            color: 'white',
        }, children: [(0, jsx_runtime_1.jsx)(NavigationMenu_1.default, {}), (0, jsx_runtime_1.jsxs)("h1", { style: { textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', color: 'white' }, children: ["Create a Look ", (0, jsx_runtime_1.jsx)("img", { src: "/icons8-\u0440\u0430\u0437\u0434\u0435\u0432\u0430\u043B\u043A\u0430-100.png", alt: "icon", style: { width: 45, verticalAlign: 'middle' } })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '40px',
                    flexWrap: 'wrap'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "option-block", onClick: () => setShowModal(true), children: [(0, jsx_runtime_1.jsx)("div", { className: "option-icon", children: (0, jsx_runtime_1.jsx)("img", { src: "/icons8-\u043A\u0430\u0440\u0442\u0438\u043D\u0430-100.png", alt: "\u0424\u043E\u0442\u043E", className: "option-icon-img" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "option-title", children: "From a photo" }), (0, jsx_runtime_1.jsx)("p", { className: "option-desc", children: "Upload a ready-made outfit photo \u2014 we\u2019ll remove the background and extract the colors" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "option-block", onClick: () => navigate('/constructor'), children: [(0, jsx_runtime_1.jsx)("div", { className: "option-icon", children: (0, jsx_runtime_1.jsx)("img", { src: "/icons8-\u0443\u0433\u043E\u043B-\u0441\u0442\u0440\u043E\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439-100.png", alt: "\u041A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440", className: "option-icon-img" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "option-title", children: "Build from wardrobe" }), (0, jsx_runtime_1.jsx)("p", { className: "option-desc", children: "Manually select items and arrange them on canvas as you wish" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "option-block", onClick: () => setShowRandomModal(true), children: [(0, jsx_runtime_1.jsx)("div", { className: "option-icon", children: (0, jsx_runtime_1.jsx)("img", { src: "/icons8-\u0433\u043E\u043B\u043E\u0432\u043E\u043B\u043E\u043C\u043A\u0430-100.png", alt: "\u0420\u0430\u043D\u0434\u043E\u043C", className: "option-icon-img" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "option-title", children: "Random look" }), (0, jsx_runtime_1.jsx)("p", { className: "option-desc", children: "Automatically create a look from your wardrobe items \u2014 pure or color-aware random" })] })] }), (0, jsx_runtime_1.jsx)(LookUploadModal_1.default, { visible: showModal, onClose: () => setShowModal(false) }), (0, jsx_runtime_1.jsx)(RandomLookModal_1.default, { visible: showRandomModal, onClose: () => {
                    console.log('Closing modal');
                    setShowRandomModal(false);
                }, onApply: (items) => {
                    localStorage.setItem('generatedLookItems', JSON.stringify(items));
                    navigate('/constructor');
                } })] }));
};
exports.default = CreateLookPage;
//# sourceMappingURL=CreateLookPage.js.map