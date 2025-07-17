"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const LookCard_1 = __importDefault(require("../components/LookCard"));
require("./FavoritesPage.css");
const NavigationMenu_1 = __importDefault(require("../components/NavigationMenu"));
const FavoritesPage = () => {
    const [favorites, setFavorites] = (0, react_1.useState)([]);
    const [favoriteIds, setFavoriteIds] = (0, react_1.useState)([]);
    const handleRemoveFavorite = (id) => {
        setRemovedIds(prev => [...prev, id]);
        setTimeout(() => {
            setFavorites(prev => prev.filter((look) => look.id !== id));
            setFavoriteIds(prev => prev.filter((favId) => favId !== id));
        }, 400);
    };
    (0, react_1.useEffect)(() => {
        axios_1.default.get('http://localhost:3000/favorites/my-favorites', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => {
            const data = res.data;
            setFavorites(data);
            setFavoriteIds(data.map((look) => look.id));
        })
            .catch(err => console.error('❌ Ошибка при получении избранных', err));
    }, []);
    const [removedIds, setRemovedIds] = (0, react_1.useState)([]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: 'favorites-container', children: [(0, jsx_runtime_1.jsx)(NavigationMenu_1.default, {}), (0, jsx_runtime_1.jsx)("div", { style: {
                    padding: '0rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    justifyContent: 'center',
                    color: 'white'
                }, children: favorites.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { style: { textAlign: 'center', marginTop: '4rem', color: 'white' }, children: (0, jsx_runtime_1.jsx)("p", { children: "You don't have any favorites yet. \uD83D\uDC94" }) })) :
                    ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { style: {
                                    fontSize: '1.5rem',
                                    color: 'white',
                                    textAlign: 'center',
                                    marginBottom: '2rem',
                                    fontWeight: 600,
                                    textShadow: '1px 1px 6px rgba(0,0,0,0.3)',
                                }, children: "\uD83D\uDC96 \u0412\u0430\u0448\u0438 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043E\u0431\u0440\u0430\u0437\u044B" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    padding: '1rem',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '2rem',
                                    justifyContent: 'center',
                                }, children: favorites.map((look) => ((0, jsx_runtime_1.jsx)("div", { className: `card-container ${removedIds.includes(look.id) ? 'fade-out' : ''}`, children: (0, jsx_runtime_1.jsx)(LookCard_1.default, { look: look, isAuthorized: true, isInitiallyFavorite: favoriteIds.includes(look.id), onRemoveFavorite: handleRemoveFavorite }, look.id) }, look.id))) })] })) })] }));
};
exports.default = FavoritesPage;
//# sourceMappingURL=FavoritesPage.js.map