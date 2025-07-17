"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const axios_1 = __importDefault(require("axios"));
const {} = antd_1.Tabs;
const OutfitPickerModal = ({ visible, onClose, onSelect }) => {
    const [createdOutfits, setCreatedOutfits] = (0, react_1.useState)([]);
    const token = localStorage.getItem('token');
    (0, react_1.useEffect)(() => {
        if (visible) {
            axios_1.default.get('http://localhost:3000/outfits/my-outfits', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setCreatedOutfits(res.data));
        }
    }, [visible]);
    const generateImageUrl = (imageUrl) => {
        if (imageUrl.startsWith('uploads/')) {
            return `http://localhost:3000/${imageUrl}`;
        }
        else if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        else {
            return `http://localhost:3000/uploads/outfits/${imageUrl}`;
        }
    };
    const renderOutfits = (outfits) => ((0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' }, children: outfits.map(outfit => {
            const imageUrl = generateImageUrl(outfit.imageUrl);
            return ((0, jsx_runtime_1.jsx)("img", { src: imageUrl, alt: "Outfit", onClick: () => onSelect(outfit.id), style: {
                    width: 90,
                    height: 120,
                    borderRadius: 8,
                    cursor: 'pointer',
                    border: '2px solid transparent'
                } }, outfit.id));
        }) }));
    const items = [
        {
            key: 'created',
            label: 'Created',
            children: renderOutfits(createdOutfits)
        }
    ];
    return ((0, jsx_runtime_1.jsx)(antd_1.Modal, { open: visible, onCancel: onClose, footer: null, title: "Choose outfit", children: (0, jsx_runtime_1.jsx)(antd_1.Tabs, { defaultActiveKey: "created", items: items }) }));
};
exports.default = OutfitPickerModal;
//# sourceMappingURL=OutfitPickerModal.js.map