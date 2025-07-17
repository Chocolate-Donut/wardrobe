"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./ConstructorPage.css");
const antd_1 = require("antd");
const axios_1 = __importDefault(require("axios"));
const NavigationMenu_1 = __importDefault(require("../components/NavigationMenu"));
const ConstructorPage = () => {
    const [items, setItems] = (0, react_1.useState)([]);
    const [showWardrobeModal, setShowWardrobeModal] = (0, react_1.useState)(false);
    const [title, setTitle] = (0, react_1.useState)('');
    const [tags, setTags] = (0, react_1.useState)([]);
    const [season, setSeason] = (0, react_1.useState)(undefined);
    const [trend, setTrend] = (0, react_1.useState)(undefined);
    const [isPrivate, setIsPrivate] = (0, react_1.useState)(false);
    const [wardrobe, setWardrobe] = (0, react_1.useState)([]);
    const [draggedIndex, setDraggedIndex] = (0, react_1.useState)(null);
    const [offset, setOffset] = (0, react_1.useState)({ x: 0, y: 0 });
    const dpr = window.devicePixelRatio || 1;
    const [layersCollapsed, setLayersCollapsed] = (0, react_1.useState)(false);
    const layersRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        axios_1.default.get('http://localhost:3000/wardrobe', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => setWardrobe(res.data))
            .catch((err) => console.error('Ошибка при получении гардероба:', err));
    }, []);
    const handleSave = async () => {
        if (!title || items.length === 0) {
            return antd_1.message.error('Add title and at least one item');
        }
        try {
            await axios_1.default.post('http://localhost:3000/outfits/constructor/json', {
                title,
                tags,
                season,
                trend,
                isPrivate,
                items,
                canvasWidth: 280,
                canvasHeight: 400,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            antd_1.message.success('Look saved!');
            setItems([]);
            setTitle('');
            setTags([]);
            setSeason('');
            setTrend('');
            setIsPrivate(false);
        }
        catch (err) {
            console.error('Ошибка сохранения:', err);
            antd_1.message.error('Save failed');
        }
    };
    (0, react_1.useEffect)(() => {
        const handleMouseMove = (e) => {
            if (draggedIndex !== null) {
                const updated = [...items];
                const canvas = document.querySelector('.canvas');
                const canvasRect = canvas.getBoundingClientRect();
                const newX = (e.clientX - offset.x) * dpr;
                const newY = (e.clientY - offset.y) * dpr;
                const imgWidth = 100 * (updated[draggedIndex].scale || 1);
                const imgHeight = (100 * (updated[draggedIndex].scale || 1)) * (updated[draggedIndex].aspectRatio || 1);
                updated[draggedIndex] = {
                    ...updated[draggedIndex],
                    x: Math.max(0, Math.min(newX, canvasRect.width - imgWidth)),
                    y: Math.max(0, Math.min(newY, canvasRect.height - imgHeight)),
                };
                setItems(updated);
            }
        };
        const handleTouchMove = (e) => {
            if (draggedIndex === null)
                return;
            const updated = [...items];
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const canvas = document.querySelector('.canvas');
                const canvasRect = canvas.getBoundingClientRect();
                const newX = (touch.clientX - offset.x) * dpr;
                const newY = (touch.clientY - offset.y) * dpr;
                const imgWidth = 100 * (updated[draggedIndex].scale || 1);
                const imgHeight = (100 * (updated[draggedIndex].scale || 1)) * (updated[draggedIndex].aspectRatio || 1);
                updated[draggedIndex] = {
                    ...updated[draggedIndex],
                    x: Math.max(0, Math.min(newX, canvasRect.width - imgWidth)),
                    y: Math.max(0, Math.min(newY, canvasRect.height - imgHeight)),
                };
                setItems(updated);
            }
        };
        const handleEnd = () => {
            setDraggedIndex(null);
            window.lastPinchDist = null;
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleEnd);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [draggedIndex, offset, items]);
    (0, react_1.useEffect)(() => {
        const saved = localStorage.getItem('generatedLookItems');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    const enriched = parsed.map((item, index) => ({
                        ...item,
                        x: item.x ?? 50 + index * 30,
                        y: item.y ?? 50 + index * 40,
                        scale: item.scale ?? 1,
                        aspectRatio: item.aspectRatio ?? 1,
                    }));
                    setItems(enriched);
                    localStorage.removeItem('generatedLookItems');
                }
            }
            catch (err) {
                console.error('Failed to parse generated look items:', err);
            }
        }
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "constructor-container", children: [(0, jsx_runtime_1.jsx)(NavigationMenu_1.default, {}), (0, jsx_runtime_1.jsx)("div", { className: "constructor-sidebar", children: (0, jsx_runtime_1.jsxs)("div", { className: "bottom-panel", children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { className: "btn-add", onClick: () => setShowWardrobeModal(true), children: "Add Clothing" }), (0, jsx_runtime_1.jsx)(antd_1.Input, { className: "title", placeholder: "Title", value: title, onChange: (e) => setTitle(e.target.value) }), (0, jsx_runtime_1.jsx)(antd_1.Input, { className: "tags", placeholder: "Tags (comma separated)", onChange: (e) => setTags(e.target.value.split(',').map(t => t.trim())) }), (0, jsx_runtime_1.jsx)(antd_1.Select, { placeholder: "Season", value: season, onChange: setSeason, options: [
                                { value: 'spring', label: 'Spring' },
                                { value: 'summer', label: 'Summer' },
                                { value: 'autumn', label: 'Autumn' },
                                { value: 'winter', label: 'Winter' },
                            ] }), (0, jsx_runtime_1.jsx)(antd_1.Select, { placeholder: "Trend", value: trend, onChange: setTrend, options: [
                                { value: 'casual', label: 'Casual' },
                                { value: 'glamor', label: 'Glamor' },
                                { value: 'classic', label: 'Classic' },
                            ] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [(0, jsx_runtime_1.jsx)("span", { children: "Private:" }), (0, jsx_runtime_1.jsx)(antd_1.Switch, { checked: isPrivate, onChange: setIsPrivate })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '1rem' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { className: "btn-cancel", onClick: () => setItems([]), children: "Cancel" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", onClick: handleSave, style: { marginLeft: '1rem' }, className: 'btn-save', children: "Save Look" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "canvas", children: items.map((item, index) => {
                    const src = `http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`;
                    return ((0, jsx_runtime_1.jsx)("img", { src: src, alt: "item", className: "canvas-item", style: {
                            top: item.y,
                            left: item.x,
                            position: 'absolute',
                            cursor: 'move',
                            zIndex: index,
                            touchAction: 'none',
                            transform: `scale(${item.scale || 1})`,
                            transformOrigin: 'top left',
                        }, onWheel: (e) => {
                            if (!e.shiftKey)
                                return;
                            e.preventDefault();
                            const updated = [...items];
                            const newScale = Math.max(0.3, Math.min((item.scale || 1) + (e.deltaY < 0 ? -0.1 : 0.1), 3));
                            updated[index] = { ...item, scale: newScale };
                            setItems(updated);
                        }, onMouseDown: (e) => {
                            setDraggedIndex(index);
                            setOffset({
                                x: e.clientX - item.x / dpr,
                                y: e.clientY - item.y / dpr
                            });
                        }, onTouchStart: (e) => {
                            const touch = e.touches[0];
                            setDraggedIndex(index);
                            setOffset({
                                x: touch.clientX - item.x / dpr,
                                y: touch.clientY - item.y / dpr
                            });
                        } }, index));
                }) }), (0, jsx_runtime_1.jsxs)("div", { className: `layers-panel ${layersCollapsed ? 'collapsed' : ''}`, children: [(0, jsx_runtime_1.jsxs)("h3", { className: "layers-header", onClick: () => setLayersCollapsed(!layersCollapsed), style: { cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: ["Layers", (0, jsx_runtime_1.jsx)("img", { src: "/icons8-\u043D\u0430-\u0437\u0430\u0434\u043D\u0438\u0439-\u043F\u043B\u0430\u043D-100.png", className: "layers-icon-img", alt: "toggle", style: { transform: layersCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' } })] }), (0, jsx_runtime_1.jsx)("div", { ref: layersRef, className: `layers-content ${layersCollapsed ? 'collapsed' : 'expanded'}`, children: items.map((item, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "layer-item", children: [(0, jsx_runtime_1.jsx)("span", { children: item.type }), (0, jsx_runtime_1.jsx)(antd_1.Button, { size: "small", onClick: () => {
                                        const updated = [...items];
                                        updated.splice(index, 1);
                                        setItems(updated);
                                    }, children: "\uD83D\uDDD1" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { size: "small", disabled: index === 0, onClick: () => {
                                        const updated = [...items];
                                        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                                        setItems(updated);
                                    }, children: "\uD83D\uDD3C" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { size: "small", disabled: index === items.length - 1, onClick: () => {
                                        const updated = [...items];
                                        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                                        setItems(updated);
                                    }, children: "\uD83D\uDD3D" })] }, index))) })] }), (0, jsx_runtime_1.jsx)(antd_1.Modal, { open: showWardrobeModal, onCancel: () => setShowWardrobeModal(false), footer: null, title: "Choose clothing", width: 600, children: (0, jsx_runtime_1.jsx)("div", { style: {
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        justifyContent: 'center'
                    }, children: wardrobe.map((item) => {
                        const src = `http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`;
                        return ((0, jsx_runtime_1.jsxs)("div", { onClick: () => {
                                const newItem = {
                                    ...item,
                                    x: 50 + items.length * 20,
                                    y: 50 + items.length * 20,
                                    scale: 1,
                                    aspectRatio: 1
                                };
                                setItems((prev) => [...prev, newItem]);
                                setShowWardrobeModal(false);
                            }, style: {
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                padding: '5px',
                                cursor: 'pointer',
                                width: '100px',
                                textAlign: 'center',
                            }, children: [(0, jsx_runtime_1.jsx)("img", { src: src, alt: item.type, style: {
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: '6px',
                                    } }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', marginTop: '4px' }, children: item.type })] }, item.id));
                    }) }) })] }));
};
exports.default = ConstructorPage;
//# sourceMappingURL=ConstructorPage.js.map