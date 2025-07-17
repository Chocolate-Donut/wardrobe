"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const icons_1 = require("@ant-design/icons");
require("./NavigationMenu.css");
const NavigationMenu = () => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [isClosing, setIsClosing] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const menuRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    const menuItems = [
        { label: '🏠 Home', path: '/dashboard' },
        { label: '👚 Wardrobe', path: '/wardrobe' },
        { label: '💖 Favorites', path: '/favorites' },
        { label: '➕ Create Look', path: '/create-look' },
        { label: '📅 Calendar', path: '/calendar' },
        { label: '👗 My outfits', path: '/my-outfits' },
    ];
    const totalAnimationDuration = menuItems.length * 100 + 300;
    const toggleMenu = () => {
        if (isOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsClosing(false);
            }, totalAnimationDuration);
        }
        else {
            setIsOpen(true);
        }
    };
    const goTo = (path) => {
        navigate(path);
        toggleMenu();
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "nav-container", ref: menuRef, children: [(0, jsx_runtime_1.jsx)("button", { className: "menu-button", onClick: toggleMenu, children: (0, jsx_runtime_1.jsx)(icons_1.MenuOutlined, { style: { fontSize: 20, color: 'white' } }) }), (isOpen || isClosing) && ((0, jsx_runtime_1.jsx)("div", { className: "nav-dropdown", children: menuItems.map((item, index) => ((0, jsx_runtime_1.jsx)("button", { className: `nav-item ${isClosing ? 'fade-out' : 'fade-in'}`, style: {
                        animationDelay: isClosing
                            ? `${(menuItems.length - index - 1) * 0.1}s`
                            : `${index * 0.1}s`,
                    }, onClick: () => goTo(item.path), disabled: isClosing, children: item.label }, item.path))) }))] }));
};
exports.default = NavigationMenu;
//# sourceMappingURL=NavigationMenu.js.map