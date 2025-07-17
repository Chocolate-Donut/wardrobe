"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./UploadClothingModal.css");
const axios_1 = __importDefault(require("axios"));
const UploadClothingModal = ({ visible, onClose }) => {
    const [imagePreview, setImagePreview] = (0, react_1.useState)(null);
    const [file, setFile] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [processedUrl, setProcessedUrl] = (0, react_1.useState)(null);
    const [detectedType, setDetectedType] = (0, react_1.useState)('');
    const [colors, setColors] = (0, react_1.useState)([]);
    const [season, setSeason] = (0, react_1.useState)('');
    const [brand, setBrand] = (0, react_1.useState)('');
    const [tags, setTags] = (0, react_1.useState)('');
    const handleFileChange = async (e) => {
        const selected = e.target.files?.[0];
        if (!selected)
            return;
        setFile(selected);
        setImagePreview(URL.createObjectURL(selected));
        setLoading(true);
        const formData = new FormData();
        formData.append('file', selected);
        try {
            const res = await axios_1.default.post('http://localhost:3000/wardrobe/process', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProcessedUrl(`http://localhost:3000/${res.data.imageUrl}`);
            setDetectedType(res.data.type || '');
            setColors(res.data.colors || []);
        }
        catch (err) {
            console.error('Ошибка при обработке изображения:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAdd = async () => {
        if (!file || !processedUrl)
            return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', detectedType);
        formData.append('season', season);
        formData.append('brand', brand);
        tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
            .forEach(tag => formData.append('tags[]', tag));
        colors.forEach(color => formData.append('colors[]', color));
        try {
            await axios_1.default.post('http://localhost:3000/wardrobe/upload', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('✅ Успешно добавлено!');
            onClose();
        }
        catch (err) {
            console.error('Ошибка при добавлении вещи:', err);
        }
    };
    const clearState = () => {
        setFile(null);
        setImagePreview(null);
        setProcessedUrl(null);
        setLoading(false);
        setDetectedType('');
        setColors([]);
        setSeason('');
        setBrand('');
        setTags('');
    };
    (0, react_1.useEffect)(() => {
        if (!visible)
            clearState();
    }, [visible]);
    if (!visible)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "upload-modal-overlay", children: (0, jsx_runtime_1.jsxs)("div", { className: "upload-modal", children: [(0, jsx_runtime_1.jsx)("h2", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043E\u0434\u0435\u0436\u0434\u044B" }), loading ? ((0, jsx_runtime_1.jsxs)("div", { className: "spinner-wrapper", children: [(0, jsx_runtime_1.jsx)("div", { className: "spinner" }), (0, jsx_runtime_1.jsx)("p", { style: { color: 'white' }, children: "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F..." })] })) : !imagePreview ? ((0, jsx_runtime_1.jsxs)("div", { className: "upload-section", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/*", capture: "environment", onChange: handleFileChange }), (0, jsx_runtime_1.jsx)("p", { style: { color: 'white' }, children: "\u0418\u043B\u0438 \u0441\u0434\u0435\u043B\u0430\u0439 \u0444\u043E\u0442\u043E \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441 \uD83D\uDCF7" })] })) : ((0, jsx_runtime_1.jsx)("div", { children: processedUrl && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "preview-section", children: (0, jsx_runtime_1.jsx)("img", { src: processedUrl, alt: "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043E" }) }), (0, jsx_runtime_1.jsx)("div", { className: "color-strip", children: colors.map((c, i) => ((0, jsx_runtime_1.jsx)("span", { className: "color-circle", style: { backgroundColor: c } }, i))) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "\u0422\u0438\u043F \u043E\u0434\u0435\u0436\u0434\u044B", value: detectedType, onChange: (e) => setDetectedType(e.target.value) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "\u0422\u0435\u0433\u0438 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E)", value: tags, onChange: (e) => setTags(e.target.value) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "\u0421\u0435\u0437\u043E\u043D", value: season, onChange: (e) => setSeason(e.target.value) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "\u0411\u0440\u0435\u043D\u0434", value: brand, onChange: (e) => setBrand(e.target.value) })] })) })), (0, jsx_runtime_1.jsxs)("div", { className: "modal-buttons", children: [(0, jsx_runtime_1.jsx)("button", { className: "cancel-btn", onClick: () => {
                                clearState();
                                onClose();
                            }, children: "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C" }), (0, jsx_runtime_1.jsx)("button", { className: "confirm-btn", onClick: handleAdd, children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C" })] })] }) }));
};
exports.default = UploadClothingModal;
//# sourceMappingURL=UploadClothingModal.js.map