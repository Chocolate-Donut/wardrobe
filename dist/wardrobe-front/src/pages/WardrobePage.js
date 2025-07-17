"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
require("./WardrobePage.css");
const react_2 = require("react");
const NavigationMenu_1 = __importDefault(require("../components/NavigationMenu"));
const UploadClothingModal_1 = __importDefault(require("../components/UploadClothingModal"));
const FloatingActionButton_1 = __importDefault(require("../components/FloatingActionButton"));
const EditClothingModal_1 = __importDefault(require("../components/EditClothingModal"));
function hexToHsl(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    const d = max - min;
    if (d !== 0) {
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0));
                break;
            case g:
                h = ((b - r) / d + 2);
                break;
            case b:
                h = ((r - g) / d + 4);
                break;
        }
        h *= 60;
    }
    return h;
}
const WardrobePage = () => {
    const [items, setItems] = (0, react_1.useState)([]);
    const [colors, setColors] = (0, react_1.useState)([]);
    const [selectedColor, setSelectedColor] = (0, react_1.useState)(null);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [editingItem, setEditingItem] = (0, react_1.useState)(null);
    const [activeCategory, setActiveCategory] = (0, react_1.useState)('all');
    const categories = [
        { label: 'All', value: 'all' },
        { label: 'Tops', value: 'tops' },
        { label: 'Full Body', value: 'fullbody' },
        { label: 'Outwear', value: 'outwear' },
        { label: 'Footwear', value: 'footwear' },
        { label: 'Accessories', value: 'accessories' },
        { label: 'Bottom', value: 'bottom' }
    ];
    const categoryMatch = {
        tops: ['t-shirt', 'tank', 'shirt', 'blouse', 'longsleeve', 'top'],
        fullbody: ['dress', 'jumpsuit', 'sundress'],
        outwear: ['outwear', 'coat', 'jacket', 'trench', 'hoodie', 'windbreaker'],
        footwear: ['shoes', 'boots', 'sneakers', 'heels', 'sandals', 'footwear'],
        accessories: ['accessories', 'glasses', 'bag', 'accessory', 'bracelet', 'necklace', 'earrings'],
        bottom: ['bottom', 'jeans', 'pants', 'shorts', 'trousers', 'tracksuit bottom', ' leggings']
    };
    (0, react_1.useEffect)(() => {
        axios_1.default.get('http://localhost:3000/wardrobe/colors', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
            setColors(res.data);
        })
            .catch(err => {
            console.error('Error fetching colors:', err);
        });
    }, []);
    (0, react_1.useEffect)(() => {
        axios_1.default.get('http://localhost:3000/wardrobe', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
            setItems(res.data);
        })
            .catch(err => {
            console.error('Wardrobe fetch error:', err);
        });
    }, []);
    const filteredItems = (0, react_2.useMemo)(() => {
        return items.filter(item => {
            const categoryMatchResult = activeCategory === 'all' ? true :
                categoryMatch[activeCategory].some(cat => item.type?.toLowerCase().includes(cat));
            const colorMatchResult = !selectedColor || item.colors?.includes(selectedColor);
            const search = searchQuery.trim().toLowerCase();
            const searchMatchResult = !search || (item.type?.toLowerCase().includes(search) ||
                (Array.isArray(item.tags) && item.tags.some((tag) => tag.toLowerCase().includes(search))));
            return categoryMatchResult && colorMatchResult && searchMatchResult;
        });
    }, [items, activeCategory, selectedColor, searchQuery]);
    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };
    const handleColorClick = (color) => {
        setSelectedColor(prev => prev === color ? null : color);
    };
    const sortedColors = (0, react_2.useMemo)(() => {
        return [...colors].sort((a, b) => hexToHsl(a) - hexToHsl(b));
    }, [colors]);
    const [isModalOpen, setModalOpen] = (0, react_1.useState)(false);
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Вы уверены, что хотите удалить эту вещь?');
        if (!confirmed)
            return;
        try {
            await axios_1.default.delete(`http://localhost:3000/wardrobe/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setItems(prev => prev.filter(item => item.id !== id));
            alert('❌ Вещь удалена');
        }
        catch (err) {
            console.error('Ошибка при удалении:', err);
            alert('Ошибка при удалении вещи');
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: {}, children: (0, jsx_runtime_1.jsxs)("div", { className: "wardrobe-container", children: [(0, jsx_runtime_1.jsx)("h1", { style: { color: 'white' }, children: "My Wardrobe" }), (0, jsx_runtime_1.jsx)(NavigationMenu_1.default, {}), (0, jsx_runtime_1.jsx)("div", { className: "category-buttons", children: categories.map(c => ((0, jsx_runtime_1.jsx)("button", { className: activeCategory === c.value ? 'active' : '', onClick: () => handleCategoryClick(c.value), children: c.label }, c.value))) }), (0, jsx_runtime_1.jsxs)("div", { className: "filter-row", children: [(0, jsx_runtime_1.jsx)("div", { className: "color-filter", children: sortedColors.map(color => ((0, jsx_runtime_1.jsx)("div", { className: `color-circle ${selectedColor === color ? 'selected' : ''}`, style: { backgroundColor: color }, onClick: () => handleColorClick(color) }, color))) }), (0, jsx_runtime_1.jsx)("div", { className: "search-container", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search by tags or types...", value: searchQuery, onChange: e => setSearchQuery(e.target.value) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "wardrobe-grid", children: filteredItems.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { style: { color: '#999', textAlign: 'center' }, children: "No items found." })) : (filteredItems.map(item => ((0, jsx_runtime_1.jsxs)("div", { className: "wardrobe-item", children: [(0, jsx_runtime_1.jsx)("img", { src: `http://localhost:3000/${item.imageUrl}`, alt: item.type }), (0, jsx_runtime_1.jsx)("button", { className: "edit-btn", onClick: () => setEditingItem(item), children: (0, jsx_runtime_1.jsx)("img", { src: "/icons8-\u0448\u0430\u0440\u0438\u043A\u043E\u0432\u0430\u044F-\u0440\u0443\u0447\u043A\u0430-100.png", alt: "trash", style: { width: '25px', height: '25px' } }) }), (0, jsx_runtime_1.jsx)("button", { className: "delete-btn", onClick: () => handleDelete(item.id), children: (0, jsx_runtime_1.jsx)("img", { src: "/icons8-\u043C\u0443\u0441\u043E\u0440-100.png", alt: "trash", style: { width: '25px', height: '25px' } }) })] }, item.id)))) }), (0, jsx_runtime_1.jsx)(EditClothingModal_1.default, { visible: !!editingItem, item: editingItem, onClose: () => setEditingItem(null), onSave: (updatedItem) => {
                        setItems(prev => prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
                        setEditingItem(null);
                    } }), (0, jsx_runtime_1.jsx)(UploadClothingModal_1.default, { visible: isModalOpen, onClose: () => setModalOpen(false) }), (0, jsx_runtime_1.jsx)(FloatingActionButton_1.default, { onClick: () => setModalOpen(true) })] }) }));
};
exports.default = WardrobePage;
//# sourceMappingURL=WardrobePage.js.map