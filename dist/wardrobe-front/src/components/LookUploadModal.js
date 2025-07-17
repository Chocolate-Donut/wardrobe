"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
require("./LookUploadModal.css");
const {} = antd_1.Select;
const LookUploadModal = ({ visible, onClose }) => {
    const [image, setImage] = (0, react_1.useState)(null);
    const [preview, setPreview] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [title, setTitle] = (0, react_1.useState)('');
    const [tags, setTags] = (0, react_1.useState)([]);
    const [season, setSeason] = (0, react_1.useState)('');
    const [trend, setTrend] = (0, react_1.useState)('');
    const [isPrivate, setIsPrivate] = (0, react_1.useState)(false);
    const [extractedColors, setExtractedColors] = (0, react_1.useState)([]);
    const resetFields = () => {
        setImage(null);
        setPreview(null);
        setTitle('');
        setTags([]);
        setSeason('');
        setTrend('');
        setIsPrivate(false);
        setExtractedColors([]);
        setLoading(false);
    };
    const handleImageChange = ({ file }) => {
        const selectedFile = file?.originFileObj || file;
        if (!(selectedFile instanceof File))
            return;
        setImage(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };
    const handleSubmit = async () => {
        if (!title || !season || !trend || !image) {
            return antd_1.message.error('Please fill all required fields and upload an image.');
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('tags', JSON.stringify(tags));
        formData.append('season', season);
        formData.append('trend', trend);
        formData.append('isPrivate', String(isPrivate));
        formData.append('image', image);
        try {
            await axios_1.default.post('http://localhost:3000/outfits/upload', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            antd_1.message.success({
                content: '✅ Look saved successfully!',
                duration: 2,
            });
            setTimeout(() => {
                resetFields();
                onClose();
            }, 1000);
        }
        catch (err) {
            console.error(err);
            antd_1.message.error('❌ Upload failed. Try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleClose = () => {
        resetFields();
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)(antd_1.Modal, { open: visible, onCancel: handleClose, footer: null, centered: true, closable: false, width: 520, className: "look-upload-modal", children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", children: [(0, jsx_runtime_1.jsx)("h2", { className: "modal-title", children: "Upload Your Look \u2728" }), (0, jsx_runtime_1.jsx)(antd_1.Upload, { beforeUpload: () => false, onChange: handleImageChange, showUploadList: false, accept: "image/*", children: (0, jsx_runtime_1.jsxs)(antd_1.Button, { className: "upload-btn", children: [(0, jsx_runtime_1.jsx)("img", { src: "/icons8-\u043F\u0430\u043F\u043A\u0430-100.png", alt: "papka", style: { width: '30px' } }), "Upload Image"] }) }), preview && (0, jsx_runtime_1.jsx)("img", { src: preview, alt: "preview", className: "image-preview" }), extractedColors.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "color-palette", children: extractedColors.map((color, index) => ((0, jsx_runtime_1.jsx)("span", { className: "color-dot", style: { backgroundColor: color } }, index))) })), (0, jsx_runtime_1.jsx)(antd_1.Input, { placeholder: "Title", value: title, onChange: (e) => setTitle(e.target.value), className: "dark-input" }), (0, jsx_runtime_1.jsx)(antd_1.Input, { placeholder: "Tags (comma separated)", onChange: (e) => setTags(e.target.value.split(',').map((tag) => tag.trim())), className: "dark-input" }), (0, jsx_runtime_1.jsx)(antd_1.Select, { value: season, onChange: setSeason, placeholder: "Season", className: "dark-select", options: [
                        { value: 'summer', label: 'Summer' },
                        { value: 'autumn', label: 'Autumn' },
                        { value: 'spring', label: 'Spring' },
                        { value: 'winter', label: 'Winter' },
                    ] }), (0, jsx_runtime_1.jsx)(antd_1.Select, { value: trend, onChange: setTrend, placeholder: "Trend", className: "dark-select", options: [
                        { value: 'casual', label: 'Casual' },
                        { value: 'glamor', label: 'Glamor' },
                        { value: 'classic', label: 'Classic' },
                    ] }), (0, jsx_runtime_1.jsxs)("div", { className: "private-toggle", children: [(0, jsx_runtime_1.jsx)("span", { children: "Make Private:" }), (0, jsx_runtime_1.jsx)(antd_1.Switch, { checked: isPrivate, onChange: setIsPrivate })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-footer", children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: handleClose, className: "cancel-btn", ghost: true, children: "Cancel" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", onClick: handleSubmit, disabled: loading, style: { borderRadius: '30px' }, children: loading ? (0, jsx_runtime_1.jsx)(antd_1.Spin, { size: "small" }) : 'Save Look' })] })] }) }));
};
exports.default = LookUploadModal;
//# sourceMappingURL=LookUploadModal.js.map