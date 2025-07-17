"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./ProfileSettingsModal.css");
const axios_1 = __importDefault(require("axios"));
const antd_1 = require("antd");
const ProfileSettingsModal = ({ visible, onClose }) => {
    const [profile, setProfile] = (0, react_1.useState)(null);
    const [selectedFile, setSelectedFile] = (0, react_1.useState)(null);
    const [editedUsername, setEditedUsername] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        if (visible) {
            axios_1.default.get('http://localhost:3000/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                setProfile(res.data);
                setEditedUsername(res.data.username);
            })
                .catch(err => {
                console.error('Ошибка получения профиля:', err);
                antd_1.message.error('Не удалось загрузить профиль');
            });
        }
    }, [visible]);
    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    const handleUpload = async () => {
        if (!selectedFile)
            return;
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        try {
            const res = await axios_1.default.post('http://localhost:3000/profile/upload-avatar', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            antd_1.message.success('Аватар обновлён');
            setProfile(prev => prev ? { ...prev, avatar: res.data.filePath } : null);
        }
        catch (err) {
            console.error('Ошибка загрузки:', err);
            antd_1.message.error('Не удалось обновить аватар');
        }
    };
    if (!visible)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", onClick: e => e.stopPropagation(), children: [(0, jsx_runtime_1.jsx)("h2", { children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0440\u043E\u0444\u0438\u043B\u044F" }), profile && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("img", { src: `http://localhost:3000${profile.avatar}`, alt: "avatar", style: { width: '100px', borderRadius: '50%', marginBottom: '1rem' }, onError: (e) => (e.currentTarget.src = '/default-avatar.png') }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Email:" }), " ", profile.email] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "\u0418\u043C\u044F:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: editedUsername, onChange: (e) => setEditedUsername(e.target.value), style: {
                                        marginLeft: '0.5rem',
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '5px',
                                        color: 'white',
                                        padding: '2px 8px'
                                    } })] }), (0, jsx_runtime_1.jsx)("button", { className: "glass-button", onClick: async () => {
                                try {
                                    await axios_1.default.patch('http://localhost:3000/profile', { username: editedUsername }, {
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                                        }
                                    });
                                    antd_1.message.success('Имя обновлено');
                                    setProfile(prev => prev ? { ...prev, username: editedUsername } : null);
                                }
                                catch (err) {
                                    console.error('Ошибка обновления имени:', err);
                                    antd_1.message.error('Не удалось обновить имя');
                                }
                            }, children: "save new username" }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Email:" }), " ", profile.email] }), (0, jsx_runtime_1.jsx)("input", { type: "file", onChange: handleFileChange }), (0, jsx_runtime_1.jsx)("button", { className: "glass-button", onClick: handleUpload, children: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0430\u0432\u0430\u0442\u0430\u0440" }), (0, jsx_runtime_1.jsx)("button", { className: "glass-button logout", onClick: onClose, children: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C" })] }))] }) }));
};
exports.default = ProfileSettingsModal;
//# sourceMappingURL=ProfileSettingsModal.js.map