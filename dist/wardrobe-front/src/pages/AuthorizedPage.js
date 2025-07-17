"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const react_2 = require("react");
const antd_1 = require("antd");
const axios_1 = __importDefault(require("axios"));
require("./AuthorizedPage.css");
const WeatherBlock_1 = __importDefault(require("../components/WeatherBlock"));
const WardrobeActions_1 = __importDefault(require("../components/WardrobeActions"));
const WeatherCarousel_1 = __importDefault(require("../components/WeatherCarousel"));
const FilterBar_1 = __importDefault(require("../components/FilterBar"));
const LookCard_1 = __importDefault(require("../components/LookCard"));
const ProfileSettingsModal_1 = __importDefault(require("../components/ProfileSettingsModal"));
const AuthorizedPage = ({ temperature, icon, city, handleCityChange, weatherLooks, showSeasonOptions, showTrendOptions, handleSeasonClick, handleTrendClick, setShowSeasonOptions, setShowTrendOptions, sliderRef, }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    const username = localStorage.getItem('username') || 'User';
    const rawAvatar = localStorage.getItem('avatar') || '';
    const avatarUrl = rawAvatar?.includes('http')
        ? rawAvatar
        : `http://localhost:3000${rawAvatar}`;
    const [showSettingsModal, setShowSettingsModal] = (0, react_1.useState)(false);
    const [showProfileModal, setShowProfileModal] = (0, react_1.useState)(false);
    console.log('avatarUrl:', avatarUrl);
    (0, react_2.useEffect)(() => {
        const loginSuccess = localStorage.getItem('login_success');
        console.log('login_success:', loginSuccess);
        if (loginSuccess === 'true') {
            setTimeout(() => {
                antd_1.message.success('Вы успешно вошли!');
                localStorage.removeItem('login_success');
            }, 100);
        }
    }, []);
    (0, react_2.useEffect)(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        loadSmartFeed();
    }, []);
    const [favoriteIds, setFavoriteIds] = (0, react_1.useState)([]);
    (0, react_2.useEffect)(() => {
        axios_1.default.get('http://localhost:3000/favorites/my-favorites', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
            setFavoriteIds(res.data.map((look) => look.id));
        })
            .catch(err => console.error('Не удалось загрузить избранные', err));
    }, []);
    const [smartFeed, setSmartFeed] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [fallbackFeed, setFallbackFeed] = (0, react_1.useState)([]);
    const loadSmartFeed = async () => {
        try {
            const res = await axios_1.default.get('http://localhost:3000/feed/smart', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSmartFeed(res.data);
        }
        catch (err) {
            console.error('Ошибка при загрузке smart feed:', err);
            if (axios_1.default.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                try {
                    const fallbackRes = await axios_1.default.get('http://localhost:3000/outfits', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setFallbackFeed(fallbackRes.data);
                    antd_1.message.warning('Используем стандартные образы вместо рекомендаций');
                }
                catch (fallbackErr) {
                    antd_1.message.error('Не удалось загрузить образы');
                }
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    (0, react_2.useEffect)(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        loadSmartFeed();
    }, [navigate]);
    const [selectedSeason, setSelectedSeason] = (0, react_1.useState)(null);
    const [selectedTrend, setSelectedTrend] = (0, react_1.useState)(null);
    const handleFilterBySeason = (season) => {
        setSelectedSeason(season);
    };
    const handleFilterByTrend = (trend) => {
        setSelectedTrend(trend);
    };
    const handleResetFilters = () => {
        setSelectedSeason(null);
        setSelectedTrend(null);
        setSearchQuery('');
        setSelectedColor(null);
        axios_1.default.get('http://localhost:3000/feed/smart', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => setSmartFeed(res.data))
            .catch(err => console.error('Ошибка при сбросе smartFeed:', err));
    };
    const filteredSmartFeed = (smartFeed.length > 0 ? smartFeed : fallbackFeed).filter((look) => {
        const matchSeason = selectedSeason ? look.season === selectedSeason : true;
        const matchTrend = selectedTrend ? look.trend === selectedTrend : true;
        return matchSeason && matchTrend;
    });
    const handleOpenSettings = () => {
        setShowSettingsModal(false);
        setShowProfileModal(true);
    };
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedColor, setSelectedColor] = (0, react_1.useState)(null);
    const handleSearchSubmit = () => {
        console.log('🔍 Поиск отправлен:', searchQuery);
        axios_1.default.get(`http://localhost:3000/outfits/search?query=${searchQuery}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
            console.log('✅ Результаты поиска:', res.data);
            setSmartFeed(res.data);
        })
            .catch(err => console.error('Ошибка при поиске', err));
    };
    const handleColorChange = (color) => {
        setSelectedColor(color);
        axios_1.default.post(`http://localhost:3000/outfits/search-by-color`, { palette: [color] }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => setSmartFeed(res.data))
            .catch(err => console.error('Ошибка при поиске по цвету', err));
    };
    const handleClearColor = () => {
        setSelectedColor(null);
        handleResetFilters();
    };
    (0, react_2.useEffect)(() => {
        if (searchQuery.trim() === '') {
            axios_1.default.get('http://localhost:3000/feed/smart', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => setSmartFeed(res.data))
                .catch(err => console.error('Ошибка при сбросе smartFeed:', err));
        }
    }, [searchQuery]);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { style: { backgroundAttachment: 'relative',
                    backgroundRepeat: 'no-repeat',
                    background: 'linear-gradient(to bottom, rgba(36, 36, 36, 0.85), rgba(53, 53, 53, 0.5)), url(/kimono_bg.png)',
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'multiply',
                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 6rem',
                            backgroundColor: ' rgba(0, 0, 0, 0.282)',
                            backdropFilter: 'blur(7px)',
                            borderBottomLeftRadius: '20px',
                            borderBottomRightRadius: '20px'
                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [(0, jsx_runtime_1.jsx)("img", { src: avatarUrl, alt: "avatar", onError: (e) => {
                                            e.target.src = '/default-avatar.png';
                                        }, style: {
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: 'none',
                                            imageRendering: 'auto',
                                            boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
                                        } }), (0, jsx_runtime_1.jsx)("span", { style: { color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }, children: username })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '5rem' }, children: [(0, jsx_runtime_1.jsx)(WeatherBlock_1.default, { temperature: temperature, icon: icon, city: city, onCityChange: handleCityChange }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '2rem' }, children: [(0, jsx_runtime_1.jsx)("img", { src: "/icons8-\u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0439-\u043F\u043E\u0447\u0442\u043E\u0432\u044B\u0439-\u044F\u0449\u0438\u043A,-\u0444\u043B\u0430\u0433-\u043E\u043F\u0443\u0449\u0435\u043D-100.png", style: { width: '40px', cursor: 'pointer' } }), (0, jsx_runtime_1.jsxs)("div", { style: { position: 'relative' }, children: [(0, jsx_runtime_1.jsx)("img", { src: "/icons8-\u0441\u0435\u0440\u0432\u0438\u0441\u044B-100.png", style: { width: '35px', cursor: 'pointer' }, onClick: () => setShowSettingsModal(true) }), showSettingsModal && ((0, jsx_runtime_1.jsx)("div", { className: "modal-backdrop", onClick: () => setShowSettingsModal(false), children: (0, jsx_runtime_1.jsxs)("div", { className: "dropdown-modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsx)("button", { className: "settings", onClick: handleOpenSettings, children: "profile settings" }), (0, jsx_runtime_1.jsx)("button", { className: "logout", onClick: handleLogout, children: "log out" })] }) }))] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { style: { padding: '2rem', color: 'white', textAlign: 'center' }, children: (0, jsx_runtime_1.jsx)(WardrobeActions_1.default, { carousel: (0, jsx_runtime_1.jsx)(WeatherCarousel_1.default, { weatherLooks: weatherLooks, sliderRef: sliderRef, isAuthorized: true, favoriteIds: favoriteIds }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(FilterBar_1.default, { showSeasonOptions: showSeasonOptions, showTrendOptions: showTrendOptions, handleSeasonClick: handleSeasonClick, handleTrendClick: handleTrendClick, handleFilterBySeason: handleFilterBySeason, handleFilterByTrend: handleFilterByTrend, handleResetFilters: handleResetFilters, closeFilters: () => {
                                    setShowSeasonOptions(false);
                                    setShowTrendOptions(false);
                                }, searchQuery: searchQuery, onSearchChange: setSearchQuery, onSearchSubmit: handleSearchSubmit, selectedColor: selectedColor, onColorChange: handleColorChange, onClearColor: handleClearColor }), (0, jsx_runtime_1.jsx)("div", { style: { padding: '3rem', color: 'white' }, children: isLoading ? ((0, jsx_runtime_1.jsx)("div", { style: { padding: '2rem', textAlign: 'center' }, children: (0, jsx_runtime_1.jsx)(antd_1.Spin, { size: "large" }) })) : ((0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }, children: filteredSmartFeed.map((look) => ((0, jsx_runtime_1.jsx)(LookCard_1.default, { look: look, isAuthorized: true, isInitiallyFavorite: favoriteIds.includes(look.id), onRemoveFavorite: (id) => setFavoriteIds(prev => prev.filter(favId => favId !== id)) }, look.id))) })) })] })] }), (0, jsx_runtime_1.jsx)(ProfileSettingsModal_1.default, { visible: showProfileModal, onClose: () => setShowProfileModal(false) })] }));
};
exports.default = AuthorizedPage;
//# sourceMappingURL=AuthorizedPage.js.map