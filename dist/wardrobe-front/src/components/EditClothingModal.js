"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./UploadClothingModal.css");
const axios_1 = __importDefault(require("axios"));
const EditClothingModal = ({ visible, onClose, item, onSave }) => {
    const [type, setType] = (0, react_1.useState)('');
    const [tags, setTags] = (0, react_1.useState)('');
    const [season, setSeason] = (0, react_1.useState)('');
    const [brand, setBrand] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        if (visible && item) {
            setType(item.type || '');
            setTags((item.tags || []).join(', '));
            setSeason(item.season || '');
            setBrand(item.brand || '');
        }
    }, [visible, item]);
    if (!visible)
        return null;
    const handleSave = async () => {
        if (!item)
            return;
        const dto = {
            type,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            season,
            brand,
        };
        try {
            await axios_1.default.put(`http://localhost:3000/wardrobe/${item.id}/type`, dto, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('✅ Успешно обновлено!');
            onSave({
                ...item,
                ...dto
            });
            onClose();
        }
        catch (err) {
            console.error('Ошибка при обновлении:', err);
        }
    };
    if (!visible || !item)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "upload-modal-overlay", children: (0, jsx_runtime_1.jsxs)("div", { className: "upload-modal", children: [(0, jsx_runtime_1.jsx)("h2", { children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0432\u0435\u0449\u044C" }), (0, jsx_runtime_1.jsx)("div", { className: "preview-section", children: (0, jsx_runtime_1.jsx)("img", { src: `http://localhost:3000/${item.imageUrl}`, alt: "\u0422\u0435\u043A\u0443\u0449\u0435\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "\u0422\u0438\u043F \u043E\u0434\u0435\u0436\u0434\u044B", value: type, onChange: (e) => setType(e.target.value) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "\u0422\u0435\u0433\u0438 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E)", value: tags, onChange: (e) => setTags(e.target.value) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "\u0421\u0435\u0437\u043E\u043D", value: season, onChange: (e) => setSeason(e.target.value) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "\u0411\u0440\u0435\u043D\u0434", value: brand, onChange: (e) => setBrand(e.target.value) }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-buttons", children: [(0, jsx_runtime_1.jsx)("button", { className: "cancel-btn", onClick: onClose, children: "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C" }), (0, jsx_runtime_1.jsx)("button", { className: "confirm-btn", onClick: handleSave, children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" })] })] }) }));
};
exports.default = EditClothingModal;
//# sourceMappingURL=EditClothingModal.js.map