"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const antd_1 = require("antd");
require("./MyLooksPage.css");
const LookCard_1 = __importDefault(require("../components/LookCard"));
const EditOutfitModal_1 = __importDefault(require("../components/EditOutfitModal"));
const NavigationMenu_1 = __importDefault(require("../components/NavigationMenu"));
const { TabPane } = antd_1.Tabs;
const MyLooksPage = () => {
    const [publicOutfits, setPublicOutfits] = (0, react_1.useState)([]);
    const [privateOutfits, setPrivateOutfits] = (0, react_1.useState)([]);
    const [selectedLooks, setSelectedLooks] = (0, react_1.useState)([]);
    const [isSelectMode, setIsSelectMode] = (0, react_1.useState)(false);
    const [selectedOutfitForEdit, setSelectedOutfitForEdit] = (0, react_1.useState)(null);
    const [isEditModalVisible, setEditModalVisible] = (0, react_1.useState)(false);
    const toggleLookSelection = (id) => {
        setSelectedLooks(prev => prev.includes(id)
            ? prev.filter(lookId => lookId !== id)
            : [...prev, id]);
    };
    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedLooks.map(id => axios_1.default.delete(`http://localhost:3000/outfits/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })));
            setPublicOutfits(prev => prev.filter(o => !selectedLooks.includes(o.id)));
            setPrivateOutfits(prev => prev.filter(o => !selectedLooks.includes(o.id)));
            setSelectedLooks([]);
            setIsSelectMode(false);
        }
        catch (err) {
            console.error('Ошибка при удалении образов:', err);
        }
    };
    const handleDelete = async (id) => {
        try {
            await axios_1.default.delete(`http://localhost:3000/outfits/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setPublicOutfits(prev => prev.filter(o => o.id !== id));
            setPrivateOutfits(prev => prev.filter(o => o.id !== id));
        }
        catch (err) {
            console.error('Ошибка при удалении образа:', err);
        }
    };
    (0, react_1.useEffect)(() => {
        const fetchOutfits = async () => {
            try {
                const res = await axios_1.default.get('http://localhost:3000/outfits/my-outfits', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const outfits = res.data || [];
                setPublicOutfits(outfits.filter((o) => !o.isPrivate));
                setPrivateOutfits(outfits.filter((o) => o.isPrivate));
            }
            catch (error) {
                console.error('Ошибка загрузки образов:', error);
            }
        };
        fetchOutfits();
    }, []);
    const handleEditClick = (outfit) => {
        setSelectedOutfitForEdit(outfit);
        setEditModalVisible(true);
    };
    const handleSaveEdit = async (updatedOutfit) => {
        try {
            const res = await axios_1.default.patch(`http://localhost:3000/outfits/${updatedOutfit.id}`, updatedOutfit, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const updated = res.data;
            setPublicOutfits((prev) => prev.map(o => o.id === updated.id ? updated : o));
            setPrivateOutfits((prev) => prev.map(o => o.id === updated.id ? updated : o));
        }
        catch (err) {
            console.error('Ошибка при сохранении образа:', err);
        }
    };
    const renderOutfits = (list) => ((0, jsx_runtime_1.jsxs)("div", { className: "outfit-grid", children: [(0, jsx_runtime_1.jsx)(NavigationMenu_1.default, {}), list.map((outfit) => ((0, jsx_runtime_1.jsx)(LookCard_1.default, { look: outfit, onEdit: () => handleEditClick(outfit), onDelete: handleDelete, isSelected: selectedLooks.includes(outfit.id), onSelect: toggleLookSelection, isSelectMode: isSelectMode }, outfit.id)))] }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "my-outfits-page", children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, children: [(0, jsx_runtime_1.jsx)("h2", { style: { margin: 0 }, children: "My Outfits" }), isSelectMode ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("span", { style: { marginRight: 16 }, children: ["\u0412\u044B\u0431\u0440\u0430\u043D\u043E: ", selectedLooks.length] }), (0, jsx_runtime_1.jsx)(antd_1.Button, { danger: true, onClick: handleBulkDelete, children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0435" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { style: { marginLeft: 8 }, onClick: () => {
                                    setSelectedLooks([]);
                                    setIsSelectMode(false);
                                }, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })] })) : ((0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => setIsSelectMode(true), children: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E" }))] }), (0, jsx_runtime_1.jsxs)(antd_1.Tabs, { defaultActiveKey: "public", children: [(0, jsx_runtime_1.jsx)(TabPane, { tab: "Public", children: renderOutfits(publicOutfits) }, "public"), (0, jsx_runtime_1.jsx)(TabPane, { tab: "Private", children: renderOutfits(privateOutfits) }, "private")] }), (0, jsx_runtime_1.jsx)(EditOutfitModal_1.default, { visible: isEditModalVisible, onClose: () => setEditModalVisible(false), onSave: handleSaveEdit, outfit: selectedOutfitForEdit })] }));
};
exports.default = MyLooksPage;
//# sourceMappingURL=MyLooksPage.js.map