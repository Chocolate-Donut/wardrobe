"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const axios_1 = __importDefault(require("axios"));
require("keen-slider/keen-slider.min.css");
const react_2 = require("keen-slider/react");
require("./App.css");
require("keen-slider/keen-slider.min.css");
const LoginModal_1 = __importDefault(require("./components/LoginModal"));
const ScrollToTopButton_1 = __importDefault(require("./components/ScrollToTopButton"));
const react_router_dom_1 = require("react-router-dom");
const react_router_dom_2 = require("react-router-dom");
const AuthorizedPage_1 = __importDefault(require("./pages/AuthorizedPage"));
const MainPage_1 = __importDefault(require("./pages/MainPage"));
const FavoritesPage_1 = __importDefault(require("./pages/FavoritesPage"));
const WardrobePage_1 = __importDefault(require("./pages/WardrobePage"));
const CreateLookPage_1 = __importDefault(require("./pages/CreateLookPage"));
const ConstructorPage_1 = __importDefault(require("./pages/ConstructorPage"));
const MyLooksPage_1 = __importDefault(require("./pages/MyLooksPage"));
const CalendarPage_1 = __importDefault(require("./pages/CalendarPage"));
const carousel = (slider) => {
    const z = 380;
    function rotate() {
        const deg = 360 * slider.track.details.progress;
        slider.container.style.transform = `translateZ(-${z}px) rotateY(${-deg}deg)`;
        slider.slides.forEach((slide, idx) => {
            const slideDeg = (360 / slider.slides.length) * idx - deg;
            const normalizedDeg = (slideDeg + 360) % 360;
            let opacity = 1 - Math.min(Math.abs(normalizedDeg), Math.abs(360 - normalizedDeg)) / 180;
            opacity = opacity * 1 + 0.7;
            let scale = 1 - Math.min(Math.abs(normalizedDeg), Math.abs(360 - normalizedDeg)) / 600;
            scale = Math.max(scale, 0.8);
            let brightness = 1 - Math.min(Math.abs(normalizedDeg), Math.abs(360 - normalizedDeg)) / 180;
            brightness = brightness * 0.5 + 0.5;
            let blur = Math.min(Math.abs(normalizedDeg), Math.abs(360 - normalizedDeg)) / 40;
            blur = Math.min(blur, 500);
            slide.style.opacity = `${opacity}`;
            slide.style.transform = `rotateY(${(360 / slider.slides.length) * idx}deg) translateZ(${z}px) scale(${scale})`;
            slide.style.filter = `brightness(${brightness}) blur(${blur}px)`;
        });
    }
    slider.on("created", () => {
        const deg = 360 / slider.slides.length;
        slider.slides.forEach((element, idx) => {
            element.style.transform = `rotateY(${deg * idx}deg) translateZ(${z}px) scale(1)`;
        });
        rotate();
    });
    slider.on("detailsChanged", rotate);
};
const App = () => {
    const navigate = (0, react_router_dom_2.useNavigate)();
    const [isLoginModalVisible, setLoginModalVisible] = (0, react_1.useState)(false);
    const [isAppInstalled, setIsAppInstalled] = (0, react_1.useState)(false);
    const [deferredPrompt, setDeferredPrompt] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (localStorage.getItem('appInstalled')) {
            setIsAppInstalled(true);
        }
        const beforeInstallPromptHandler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        const appInstalledHandler = () => {
            setIsAppInstalled(true);
            localStorage.setItem('appInstalled', 'true');
        };
        window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
        window.addEventListener('appinstalled', appInstalledHandler);
        return () => {
            window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
            window.removeEventListener('appinstalled', appInstalledHandler);
        };
    }, []);
    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice
                .then((choiceResult) => {
                console.log(choiceResult.outcome === 'accepted' ? 'App installed' : 'App not installed');
                setDeferredPrompt(null);
            });
        }
    };
    const [temperature, setTemperature] = (0, react_1.useState)(null);
    const [icon, setIcon] = (0, react_1.useState)(null);
    const [city, setCity] = (0, react_1.useState)('Phuket');
    const [popularLooks, setPopularLooks] = (0, react_1.useState)([]);
    const [weatherLooks, setWeatherLooks] = (0, react_1.useState)([]);
    const fetchWeather = async (cityName) => {
        try {
            const response = await axios_1.default.get(`http://localhost:3000/weather?city=${cityName}`);
            const temp = response.data.temperature || response.data.main?.temp;
            const iconCode = response.data.icon || response.data.weather?.[0]?.icon;
            setTemperature(temp);
            setIcon(iconCode);
        }
        catch (error) {
            console.error(error);
            antd_1.message.error('Не удалось получить данные о погоде');
        }
    };
    (0, react_1.useEffect)(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await axios_1.default.get(`http://localhost:3000/weather/coords?lat=${latitude}&lon=${longitude}`);
                    console.log(response.data);
                    const temp = response.data.temperature || response.data.main?.temp;
                    const iconCode = response.data.icon || response.data.weather?.[0]?.icon;
                    const cityName = response.data.name || response.data.city;
                    console.log('Новый город:', cityName);
                    setTemperature(temp);
                    setIcon(iconCode);
                    setCity(cityName);
                }
                catch (err) {
                    console.error('Ошибка при получении погоды по геолокации', err);
                }
            }, (error) => {
                console.error('Ошибка с геолокацией', error);
                antd_1.message.error('Ошибка с геолокацией');
            });
        }
        else {
            console.warn('Геолокация не поддерживается этим браузером');
        }
    }, []);
    (0, react_1.useEffect)(() => {
        console.log("Город изменился:", city);
        fetchWeather(city);
    }, [city]);
    (0, react_1.useEffect)(() => {
        axios_1.default.get('http://localhost:3000/feed/popular')
            .then((res) => {
            setPopularLooks(res.data);
        })
            .catch((err) => console.error('Ошибка при загрузке популярных образов', err));
    }, []);
    const handleCityChange = (value) => {
        setCity(value);
    };
    (0, react_1.useEffect)(() => {
        if (temperature !== null) {
            axios_1.default.get(`http://localhost:3000/feed/recommended?city=${city}`)
                .then((res) => {
                setWeatherLooks(res.data.outfits);
            })
                .catch((err) => console.error('Ошибка при загрузке образов по погоде', err));
        }
    }, [temperature]);
    const autoRotate = (slider) => {
        let timeout;
        let mouseOver = false;
        function clearNextTimeout() {
            clearTimeout(timeout);
        }
        function nextTimeout() {
            clearTimeout(timeout);
            if (mouseOver)
                return;
            timeout = setTimeout(() => {
                if (!slider.track.details)
                    return;
                slider.moveToIdx(slider.track.details.abs + 1, true);
            }, 8000);
        }
        slider.on("created", () => {
            slider.container.addEventListener("mouseover", () => {
                mouseOver = true;
                clearNextTimeout();
            });
            slider.container.addEventListener("mouseout", () => {
                mouseOver = false;
                nextTimeout();
            });
            nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
    };
    const timer = (0, react_1.useRef)(null);
    const [sliderRef] = (0, react_2.useKeenSlider)({
        loop: true,
        selector: ".carousel__cell",
        renderMode: "custom",
        mode: "free-snap",
        breakpoints: {
            '(max-width: 1024px)': {
                slides: { perView: 2, spacing: 10 },
            },
            '(max-width: 600px)': {
                slides: { perView: 1.1, spacing: 10 },
            },
        },
        slides: {
            perView: 3,
            spacing: 20,
        },
        dragStarted() {
            if (timer.current) {
                clearInterval(timer.current);
            }
        },
    }, [carousel, autoRotate]);
    const [showSeasonOptions, setShowSeasonOptions] = (0, react_1.useState)(false);
    const [showTrendOptions, setShowTrendOptions] = (0, react_1.useState)(false);
    const handleSeasonClick = () => {
        setShowSeasonOptions(!showSeasonOptions);
        setShowTrendOptions(false);
    };
    const handleTrendClick = () => {
        setShowTrendOptions(!showTrendOptions);
        setShowSeasonOptions(false);
    };
    const handleFilterBySeason = (season) => {
        axios_1.default.get(`http://localhost:3000/feed/filter?season=${season}`)
            .then((res) => {
            setPopularLooks(res.data);
        })
            .catch((err) => console.error('Ошибка при фильтрации по сезону', err));
    };
    const handleResetFilters = async () => {
        try {
            const response = await axios_1.default.get('http://localhost:3000/feed/popular');
            setPopularLooks(response.data);
        }
        catch (error) {
            console.error('Ошибка при сбросе фильтров', error);
        }
    };
    const handleFilterByTrend = (trend) => {
        axios_1.default.get(`http://localhost:3000/feed/filter?trend=${trend}`)
            .then((res) => {
            setPopularLooks(res.data);
        })
            .catch((err) => console.error('Ошибка при фильтрации по тренду', err));
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: localStorage.getItem('token')
                            ? (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/dashboard", replace: true })
                            : (0, jsx_runtime_1.jsx)(MainPage_1.default, { temperature: temperature, icon: icon, city: city, handleCityChange: handleCityChange, isAppInstalled: isAppInstalled, handleInstallClick: handleInstallClick, showSeasonOptions: showSeasonOptions, showTrendOptions: showTrendOptions, handleSeasonClick: handleSeasonClick, handleTrendClick: handleTrendClick, handleFilterBySeason: handleFilterBySeason, handleFilterByTrend: handleFilterByTrend, handleResetFilters: handleResetFilters, setShowSeasonOptions: setShowSeasonOptions, setShowTrendOptions: setShowTrendOptions, popularLooks: popularLooks, weatherLooks: weatherLooks, sliderRef: sliderRef, setLoginModalVisible: setLoginModalVisible }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/dashboard", element: localStorage.getItem('token')
                            ? (0, jsx_runtime_1.jsx)(AuthorizedPage_1.default, { temperature: temperature, icon: icon, city: city, handleCityChange: handleCityChange, weatherLooks: weatherLooks, sliderRef: sliderRef, showSeasonOptions: showSeasonOptions, showTrendOptions: showTrendOptions, handleSeasonClick: handleSeasonClick, handleTrendClick: handleTrendClick, setShowSeasonOptions: setShowSeasonOptions, setShowTrendOptions: setShowTrendOptions })
                            : (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/", replace: true }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/favorites", element: (0, jsx_runtime_1.jsx)(FavoritesPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/create-look", element: (0, jsx_runtime_1.jsx)(CreateLookPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/constructor", element: (0, jsx_runtime_1.jsx)(ConstructorPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/calendar", element: (0, jsx_runtime_1.jsx)(CalendarPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/wardrobe", element: (0, jsx_runtime_1.jsx)(WardrobePage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/my-outfits", element: (0, jsx_runtime_1.jsx)(MyLooksPage_1.default, {}) })] }), (0, jsx_runtime_1.jsx)(LoginModal_1.default, { visible: isLoginModalVisible, onClose: () => setLoginModalVisible(false), onLoginSuccess: () => {
                    setLoginModalVisible(false);
                    navigate('/dashboard');
                } }), (0, jsx_runtime_1.jsx)(ScrollToTopButton_1.default, {})] }));
};
exports.default = App;
//# sourceMappingURL=App.js.map