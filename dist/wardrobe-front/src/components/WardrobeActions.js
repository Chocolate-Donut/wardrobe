"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const react_router_dom_1 = require("react-router-dom");
const WardrobeActions = ({ carousel }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '6rem',
            alignItems: 'center',
            marginTop: '3rem',
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'flex-end' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", icon: (0, jsx_runtime_1.jsx)(icons_1.HeartOutlined, {}), size: "large", style: { width: '180px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.3)', border: 'none', color: '#fff', }, onClick: () => navigate('/favorites'), children: "Favorites" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", icon: (0, jsx_runtime_1.jsx)(icons_1.PlusOutlined, {}), size: "large", style: { width: '180px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.3)', border: 'none', color: '#fff', }, onClick: () => navigate('/create-look'), children: "Create outfit" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", icon: (0, jsx_runtime_1.jsx)(icons_1.SkinOutlined, {}), size: "large", style: { width: '180px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.3)', border: 'none', color: '#fff', }, onClick: () => navigate('/my-outfits'), children: "My outfits" })] }), (0, jsx_runtime_1.jsx)("div", { children: carousel }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'flex-start' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", icon: (0, jsx_runtime_1.jsx)(icons_1.CalendarOutlined, {}), size: "large", style: { width: '180px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.3)', border: 'none', color: '#fff', }, onClick: () => navigate('/calendar'), children: "Calendar" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", icon: (0, jsx_runtime_1.jsx)(icons_1.AppstoreOutlined, {}), size: "large", style: { width: '180px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.3)', border: 'none', color: '#fff', }, onClick: () => navigate('/wardrobe'), children: "Wardrobe" })] })] }));
};
exports.default = WardrobeActions;
//# sourceMappingURL=WardrobeActions.js.map