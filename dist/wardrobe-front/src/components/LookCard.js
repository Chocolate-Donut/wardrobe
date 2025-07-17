"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const axios_1 = __importDefault(require("axios"));
const icons_1 = require("@ant-design/icons");
const antd_2 = require("antd");
const LookCard = ({ look, isAuthorized = false, isInitiallyFavorite = false, onRemoveFavorite, onDelete, isSelected = false, isSelectMode = false, onSelect, onEdit }) => {
    const containerRef = (0, react_1.useRef)(null);
    const tagRefs = (0, react_1.useRef)([]);
    const [overflowIndex, setOverflowIndex] = (0, react_1.useState)(null);
    const [showHeart, setShowHeart] = (0, react_1.useState)(false);
    const handleLongPress = () => {
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 2000);
    };
    const [isFavorite, setIsFavorite] = (0, react_1.useState)(isInitiallyFavorite);
    (0, react_1.useEffect)(() => {
        setIsFavorite(isInitiallyFavorite);
    }, [isInitiallyFavorite]);
    const handleToggleFavorite = async () => {
        const token = localStorage.getItem('token');
        if (!token)
            return;
        if (isFavorite && onRemoveFavorite) {
            try {
                await axios_1.default.delete(`http://localhost:3000/favorites/${look.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsFavorite(false);
                onRemoveFavorite(look.id);
            }
            catch (err) {
                console.error('❌ Ошибка при удалении из избранного', err);
            }
            return;
        }
        if (!isFavorite) {
            try {
                await axios_1.default.post(`http://localhost:3000/favorites/${look.id}`, null, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsFavorite(true);
            }
            catch (err) {
                console.error('❌ Ошибка при добавлении в избранное', err);
            }
        }
    };
    const imageUrl = look.imageUrl?.includes('http')
        ? look.imageUrl
        : `http://localhost:3000/uploads/${look.imageUrl.split(/uploads[\\/]/).pop()}`;
    const tags = typeof look.tags === 'string' ? JSON.parse(look.tags) : look.tags;
    const season = look.season?.replace(/"/g, '');
    const trend = look.trend?.replace(/"/g, '');
    (0, react_1.useEffect)(() => {
        tagRefs.current = [];
        const checkOverflow = () => {
            if (!containerRef.current)
                return;
            const containerWidth = containerRef.current.getBoundingClientRect().width;
            let totalWidth = 0;
            for (let i = 0; i < tagRefs.current.length; i++) {
                const tag = tagRefs.current[i];
                if (!tag)
                    continue;
                totalWidth += tag.offsetWidth + 5;
                if (totalWidth > containerWidth) {
                    setOverflowIndex(i);
                    return;
                }
            }
            setOverflowIndex(null);
        };
        checkOverflow();
        const resizeObserver = new ResizeObserver(checkOverflow);
        if (containerRef.current)
            resizeObserver.observe(containerRef.current);
        window.addEventListener('resize', checkOverflow);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', checkOverflow);
        };
    }, [tags]);
    const [pressTimer, setPressTimer] = (0, react_1.useState)(null);
    const [showDeleteButton, setShowDeleteButton] = (0, react_1.useState)(false);
    const handleLongPressStart = () => {
        if (!isSelectMode) {
            setPressTimer(setTimeout(() => {
                if (onSelect) {
                    onSelect(look.id);
                }
            }, 800));
        }
    };
    const handleLongPressEnd = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
    };
    const handleCardClick = () => {
        if (isSelectMode && onSelect) {
            onSelect(look.id);
        }
        else {
            setShowDeleteButton(prev => !prev);
        }
    };
    (0, react_1.useEffect)(() => {
        return () => {
            if (pressTimer)
                clearTimeout(pressTimer);
        };
    }, [pressTimer]);
    return ((0, jsx_runtime_1.jsxs)("div", { onMouseEnter: () => setShowHeart(true), onMouseLeave: () => {
            setShowHeart(false);
            handleLongPressEnd();
        }, onTouchStart: handleLongPressStart, onTouchEnd: handleLongPressEnd, onMouseDown: handleLongPressStart, onMouseUp: handleLongPressEnd, style: { position: 'relative', cursor: 'pointer', outline: isSelected ? '3px solid #1890ff' : 'none', transition: 'transform 0.2s',
            transform: isSelected ? 'scale(0.98)' : 'scale(1)' }, children: [(0, jsx_runtime_1.jsxs)(antd_1.Card, { onClick: handleCardClick, onTouchStart: () => {
                    if (isSelectMode && onSelect) {
                        onSelect(look.id);
                    }
                    else {
                        handleLongPress();
                    }
                }, hoverable: true, className: "look-card", style: {
                    width: '170px',
                    height: showDeleteButton ? '340px' : '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.21)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.13)',
                    transition: 'height 0.3s ease',
                }, cover: (0, jsx_runtime_1.jsx)("img", { alt: look.title, src: imageUrl, onError: (e) => {
                        e.target.src = '/no-image.png';
                    }, style: {
                        width: '100%',
                        height: '200px',
                        objectFit: 'contain',
                    } }), children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { style: { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.005rem', marginTop: '-1.3rem', color: 'white' }, children: look.title.replace(/"/g, '') }), (0, jsx_runtime_1.jsxs)("div", { style: { fontSize: '0.7rem', color: 'white', marginBottom: '0.2rem' }, children: [(0, jsx_runtime_1.jsxs)("span", { style: { marginRight: 8, }, children: [" ", season] }), (0, jsx_runtime_1.jsxs)("span", { children: ["\u2728 ", trend] })] })] }), (0, jsx_runtime_1.jsxs)("div", { ref: containerRef, style: {
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                    gap: '0.3rem',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    maxHeight: '60px',
                                    paddingBottom: '0.7rem',
                                }, children: [(() => { tagRefs.current = []; return null; })(), tags?.map((tag, index) => {
                                        if (overflowIndex !== null && index >= overflowIndex)
                                            return null;
                                        return ((0, jsx_runtime_1.jsx)("span", { ref: (el) => {
                                                tagRefs.current[index] = el;
                                            }, style: {
                                                backgroundColor: '#eee',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.7rem',
                                                whiteSpace: 'nowrap',
                                                color: 'black',
                                            }, children: tag.replace(/"/g, '') }, index));
                                    }), overflowIndex !== null && ((0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: tags.slice(overflowIndex).join(', '), children: (0, jsx_runtime_1.jsx)("span", { style: {
                                                backgroundColor: '#eee',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.7rem',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                            }, children: "..." }) }))] })] }), onDelete && ((0, jsx_runtime_1.jsxs)("div", { style: {
                            height: showDeleteButton ? '100px' : '0',
                            overflow: 'hidden',
                            transition: 'max-height 0.9s ease',
                        }, children: [(0, jsx_runtime_1.jsx)(antd_2.Popconfirm, { title: "Are you sure you want to delete this look?", onConfirm: () => onDelete(look.id), okText: "Yes", cancelText: "No", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { danger: true, type: "primary", size: "small", style: {
                                        width: '100%',
                                        marginTop: '0rem',
                                    }, children: "Delete" }) }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "small", style: { width: '100%', marginTop: '0.4rem', }, onClick: () => onEdit?.(look.id), children: "\u270F\uFE0F Edit" })] })), isSelectMode && ((0, jsx_runtime_1.jsx)("div", { style: {
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: isSelected ? '#1890ff' : '#fff',
                            border: '2px solid #1890ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2
                        }, children: isSelected && (0, jsx_runtime_1.jsx)("span", { style: { color: '#fff', fontSize: 12 }, children: "\u2713" }) }))] }), isAuthorized && ((0, jsx_runtime_1.jsx)("div", { style: {
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                    padding: '6px',
                    cursor: 'pointer',
                    opacity: showHeart ? 1 : 0.4,
                }, onClick: handleToggleFavorite, children: isFavorite ? (0, jsx_runtime_1.jsx)(icons_1.HeartFilled, { style: { color: '#ff4d4f', fontSize: '20px' } }) : (0, jsx_runtime_1.jsx)(icons_1.HeartOutlined, { style: { color: 'white', fontSize: '20px' } }) }))] }));
};
exports.default = LookCard;
//# sourceMappingURL=LookCard.js.map