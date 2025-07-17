"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const axios_1 = __importDefault(require("axios"));
require("./RandomLookModal.css");
const RandomLookModal = ({ visible, onClose, onApply }) => {
    const [items, setItems] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [attempt, setAttempt] = (0, react_1.useState)(1);
    const [palette, setPalette] = (0, react_1.useState)('Warm');
    const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
    const fetchAndGenerate = async () => {
        setLoading(true);
        try {
            const res = await axios_1.default.get('http://localhost:3000/wardrobe', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const wardrobe = res.data || [];
            if (wardrobe.length === 0) {
                antd_1.message.warning('Wardrobe is empty');
                setItems([]);
                return;
            }
            const categories = {
                outwear: [],
                top: [],
                bottom: [],
                fullbody: [],
                footwear: [],
                accessories: [],
            };
            wardrobe.forEach((item) => {
                const type = item.type?.toLowerCase();
                if (categories[type])
                    categories[type].push(item);
            });
            const hasFullbody = categories.fullbody.length > 0;
            const order = hasFullbody
                ? ['outwear', 'fullbody', 'accessories', 'footwear']
                : ['outwear', 'top', 'bottom', 'accessories', 'footwear'];
            const generated = order
                .filter((type) => categories[type].length > 0)
                .map((type) => ({
                ...shuffle(categories[type])[0],
                type,
            }));
            setItems(generated);
            setAttempt((prev) => prev + 1);
        }
        catch (err) {
            antd_1.message.error('Failed to generate look');
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        if (visible) {
            fetchAndGenerate();
        }
    }, [visible]);
    return ((0, jsx_runtime_1.jsx)(antd_1.Modal, { className: "custom-modal", open: visible, onCancel: onClose, title: `Random Look (Attempt ${attempt})`, footer: [
            (0, jsx_runtime_1.jsx)(antd_1.Select, { value: palette, onChange: (val) => setPalette(val), style: { width: 120 }, options: [
                    { value: 'Warm', label: '🎨 Warm' },
                    { value: 'Cool', label: '🌊 Cool' },
                    { value: 'Neutral', label: '⚪ Neutral' },
                ] }, "palette"),
            (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: fetchAndGenerate, disabled: loading, type: "dashed", className: "custom-another-btn", children: "Another" }, "another"),
            (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", onClick: () => {
                    onApply(items);
                    onClose();
                }, children: "Use" }, "use"),
        ], width: 800, children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "loading-container", children: (0, jsx_runtime_1.jsx)(antd_1.Spin, { size: "large" }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "look-grid", children: items.map((item, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "look-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "item-image-container", children: (0, jsx_runtime_1.jsx)("img", { src: `http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`, className: "item-image", alt: item.type }) }), (0, jsx_runtime_1.jsx)("div", { className: "item-type", children: item.type })] }, item.id || index))) })) }));
};
exports.default = RandomLookModal;
//# sourceMappingURL=RandomLookModal.js.map