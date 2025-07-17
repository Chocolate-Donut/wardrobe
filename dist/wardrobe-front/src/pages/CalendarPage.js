"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
require("./CalendarPage.css");
const dayjs_1 = __importDefault(require("dayjs"));
const react_2 = require("keen-slider/react");
require("keen-slider/keen-slider.min.css");
const framer_motion_1 = require("framer-motion");
const react_3 = require("react");
const OutfitPickerModal_1 = __importDefault(require("../components/OutfitPickerModal"));
const NavigationMenu_1 = __importDefault(require("../components/NavigationMenu"));
const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = (0, react_1.useState)((0, dayjs_1.default)().format('YYYY-MM-DD'));
    const [calendarData, setCalendarData] = (0, react_1.useState)(null);
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    const token = localStorage.getItem('token');
    const [sliderRef, instanceRef] = (0, react_2.useKeenSlider)({
        slides: {
            perView: 1,
        },
        mode: "snap",
    });
    const [direction, setDirection] = (0, react_1.useState)("right");
    const [activeCircleLeft, setActiveCircleLeft] = (0, react_1.useState)(0);
    const dateItemRefs = (0, react_1.useRef)({});
    const [showMonthModal, setShowMonthModal] = (0, react_1.useState)(false);
    const [modalMonth, setModalMonth] = (0, react_1.useState)((0, dayjs_1.default)());
    const prevMonth = () => {
        setModalMonth(prev => prev.subtract(1, 'month'));
    };
    const nextMonth = () => {
        setModalMonth(prev => prev.add(1, 'month'));
    };
    const fetchCalendarData = () => {
        console.log("📅 Fetching calendar for date:", selectedDate);
        axios_1.default
            .get(`http://localhost:3000/calendar/${selectedDate}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
            console.log('✅ calendar response', res.data);
            setCalendarData(res.data);
        })
            .catch(err => {
            console.error('❌ calendar fetch error:', err);
        });
    };
    const [newEvent, setNewEvent] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => {
            if (newEvent.trim()) {
                axios_1.default
                    .post(`http://localhost:3000/calendar/${selectedDate}/event`, { event: newEvent }, { headers: { Authorization: `Bearer ${token}` } })
                    .then(() => {
                    fetchCalendarData();
                    setNewEvent('');
                })
                    .catch(err => console.error('❌ Ошибка при автосохранении события:', err));
            }
        }, 700);
        return () => clearTimeout(timer);
    }, [newEvent]);
    const handleOutfitSelect = async (outfitId) => {
        try {
            await axios_1.default.post(`http://localhost:3000/calendar/${selectedDate}/outfits`, { outfitId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setShowModal(false);
            fetchCalendarData();
        }
        catch (error) {
            console.error('❌ Ошибка при добавлении образа:', error);
        }
    };
    const handleRemoveOutfit = async (outfitId) => {
        try {
            await axios_1.default.delete(`http://localhost:3000/calendar/${selectedDate}/outfits`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { outfitId }
            });
            fetchCalendarData();
        }
        catch (err) {
            console.error('❌ Ошибка при удалении образа:', err);
        }
    };
    const handleNoteChange = async (newNote) => {
        try {
            await axios_1.default.put(`http://localhost:3000/calendar/${selectedDate}/note`, { note: newNote }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        catch (err) {
            console.error('❌ Ошибка при сохранении заметки:', err);
        }
    };
    const handleEventsChange = async (text) => {
        const events = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== '');
        try {
            await axios_1.default.put(`http://localhost:3000/calendar/${selectedDate}/events`, { events }, { headers: { Authorization: `Bearer ${token}` } });
            fetchCalendarData();
        }
        catch (err) {
            console.error('❌ Ошибка при обновлении событий:', err);
        }
    };
    const numberOfWeeks = 12;
    const today = (0, dayjs_1.default)();
    const weeks = (0, react_1.useMemo)(() => {
        const result = [];
        for (let i = -numberOfWeeks; i <= numberOfWeeks; i++) {
            const start = today.add(i, 'week').startOf('week');
            const week = [];
            for (let d = 0; d < 7; d++) {
                week.push(start.add(d, 'day'));
            }
            result.push(week);
        }
        return result;
    }, []);
    (0, react_3.useLayoutEffect)(() => {
        const todayStr = (0, dayjs_1.default)().format('YYYY-MM-DD');
        const flatDates = weeks.flat();
        const todayIndex = flatDates.findIndex(day => day.format('YYYY-MM-DD') === todayStr);
        const todayWeekIndex = Math.floor(todayIndex / 7);
        if (todayWeekIndex !== -1 && instanceRef.current) {
            instanceRef.current.moveToIdx(todayWeekIndex, false);
        }
    }, [weeks, instanceRef.current]);
    (0, react_1.useEffect)(() => {
        const todayStr = (0, dayjs_1.default)().format('YYYY-MM-DD');
        setSelectedDate(todayStr);
        const timer = setTimeout(() => {
            const activeEl = dateItemRefs.current[todayStr];
            if (activeEl && instanceRef.current) {
                const slider = instanceRef.current;
                const slideIndex = Math.floor(weeks.findIndex(week => week.some(day => day.format('YYYY-MM-DD') === todayStr)) / 7);
                if (slideIndex !== -1) {
                    slider.moveToIdx(slideIndex, false);
                    const offset = activeEl.offsetLeft + activeEl.offsetWidth / 2 - 20;
                    setActiveCircleLeft(offset);
                }
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [weeks]);
    const eventDaysSet = (0, react_1.useMemo)(() => {
        const set = new Set();
        if (Array.isArray(calendarData?.events) && calendarData.events.length > 0) {
            set.add(selectedDate);
        }
        return set;
    }, [calendarData, selectedDate]);
    const [circleVisible, setCircleVisible] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setCircleVisible(false);
        const timer = setTimeout(() => setCircleVisible(true), 50);
        return () => clearTimeout(timer);
    }, [selectedDate]);
    const [mounted, setMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    (0, react_1.useEffect)(() => {
        if (!mounted)
            return;
        const activeEl = dateItemRefs.current[selectedDate];
        if (activeEl && instanceRef.current) {
            const offset = activeEl.offsetLeft + activeEl.offsetWidth / 2 - 20;
            setActiveCircleLeft(offset);
        }
    }, [selectedDate, instanceRef.current, mounted]);
    const getMonthDays = (0, react_1.useMemo)(() => {
        return (monthDate) => {
            const start = monthDate.startOf('month').startOf('week');
            const end = monthDate.endOf('month').endOf('week');
            const days = [];
            let date = start.clone();
            while (date.isBefore(end, 'day')) {
                days.push(date.clone());
                date = date.add(1, 'day');
            }
            return days;
        };
    }, []);
    const handleOpenMonthModal = () => {
        setModalMonth((0, dayjs_1.default)(selectedDate));
        setShowMonthModal(true);
    };
    (0, react_1.useEffect)(() => {
        const activeEl = dateItemRefs.current[selectedDate];
        if (activeEl && instanceRef.current) {
            const offset = activeEl.offsetLeft + activeEl.offsetWidth / 2 - 20;
            setActiveCircleLeft(offset);
        }
    }, [selectedDate, instanceRef.current]);
    (0, react_1.useEffect)(() => {
        fetchCalendarData();
    }, [selectedDate]);
    if (!calendarData) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "calendar-container", children: (0, jsx_runtime_1.jsx)("p", { style: { textAlign: 'center', marginTop: '4rem' }, children: "Loading..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "calendar-container", children: [(0, jsx_runtime_1.jsx)(NavigationMenu_1.default, {}), (0, jsx_runtime_1.jsx)("div", { className: "top-curve-container", children: (0, jsx_runtime_1.jsx)("div", { className: "top-curve", children: (0, jsx_runtime_1.jsx)("img", { src: "/5250206.jpg", className: "curve-image" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "content-over-curve", children: [(0, jsx_runtime_1.jsx)("div", { className: "current-date-top", children: (0, dayjs_1.default)(selectedDate).format('dddd, D MMMM') }), (0, jsx_runtime_1.jsxs)("div", { className: "date-header", children: [(0, jsx_runtime_1.jsx)("button", { className: "calendar-toggle-btn", onClick: handleOpenMonthModal, children: (0, jsx_runtime_1.jsx)("img", { src: 'icons8-\u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C-100.png', style: { width: '50px' }, alt: "Calendar" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "date-strip-wrapper", children: [(0, jsx_runtime_1.jsx)("div", { className: `active-date-circle ${circleVisible ? 'visible' : ''}`, style: { left: `${activeCircleLeft}px` } }), (0, jsx_runtime_1.jsx)("div", { ref: sliderRef, className: "keen-slider date-strip", children: weeks.map((week, weekIndex) => ((0, jsx_runtime_1.jsx)("div", { className: "keen-slider__slide week-slide", children: week.map((day) => {
                                                const dateStr = day.format('YYYY-MM-DD');
                                                const isSelected = dateStr === selectedDate;
                                                return ((0, jsx_runtime_1.jsx)("div", { ref: (el) => {
                                                        dateItemRefs.current[dateStr] = el;
                                                    }, className: `date-item ${isSelected ? 'selected' : ''}`, onClick: () => {
                                                        const isForward = (0, dayjs_1.default)(dateStr).isAfter((0, dayjs_1.default)(selectedDate));
                                                        setDirection(isForward ? "right" : "left");
                                                        setSelectedDate(dateStr);
                                                        const weekIndex = weeks.findIndex(week => week.some(day => day.format('YYYY-MM-DD') === dateStr));
                                                        if (weekIndex !== -1 && instanceRef.current) {
                                                            instanceRef.current.moveToIdx(weekIndex, true);
                                                        }
                                                    }, children: (0, jsx_runtime_1.jsxs)("div", { className: "number-wrapper", children: [(0, jsx_runtime_1.jsx)("span", { className: "number", children: day.format('D') }), eventDaysSet.has(dateStr) && (0, jsx_runtime_1.jsx)("span", { className: "dot" })] }) }, dateStr));
                                            }) }, weekIndex))) })] })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { mode: "wait", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, x: direction === "right" ? 100 : -100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: direction === "right" ? -100 : 100 }, transition: { duration: 0.35 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "weather-info", children: [(0, jsx_runtime_1.jsx)("p", { children: calendarData.temperature !== null ? `+${calendarData.temperature}°` : 'Погода недоступна' }), (0, jsx_runtime_1.jsx)("p", { children: calendarData.weatherType })] }), (0, jsx_runtime_1.jsx)("div", { className: "events", children: (0, jsx_runtime_1.jsx)("textarea", { value: (calendarData.events ?? []).join('\n'), placeholder: "Write events, one per line...", onChange: (e) => handleEventsChange(e.target.value) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "looks-section", children: [(0, jsx_runtime_1.jsx)("p", { className: "section-title", children: "Looks for today:" }), (0, jsx_runtime_1.jsx)("div", { className: "outfit-grid", children: calendarData.outfits.length > 0 ? (calendarData.outfits.map((outfit) => ((0, jsx_runtime_1.jsxs)("div", { className: "outfit-wrapper", children: [(0, jsx_runtime_1.jsx)("img", { src: `http://localhost:3000/${outfit.imageUrl}`, alt: "Outfit", className: "outfit-img" }), (0, jsx_runtime_1.jsx)("button", { className: "delete-btn", onClick: () => handleRemoveOutfit(outfit.id), children: "\uD83D\uDDD1" })] }, outfit.id)))) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "empty-hanger", children: "\u2728" }), (0, jsx_runtime_1.jsx)("div", { className: "empty-hanger", children: "\u2728" }), (0, jsx_runtime_1.jsx)("div", { className: "empty-hanger", children: "\u2728" })] })) }), (0, jsx_runtime_1.jsx)("button", { className: "add-outfit-btn", onClick: () => setShowModal(true), children: "+ Add Outfit" })] }), (0, jsx_runtime_1.jsx)("div", { className: "note-section", children: (0, jsx_runtime_1.jsx)("div", { className: "note-section", children: (0, jsx_runtime_1.jsx)("textarea", { defaultValue: calendarData.note, placeholder: "Notes...", onChange: (e) => handleNoteChange(e.target.value) }) }) })] }, selectedDate) })] }), (0, jsx_runtime_1.jsx)(OutfitPickerModal_1.default, { visible: showModal, onClose: () => setShowModal(false), onSelect: handleOutfitSelect }), showMonthModal && ((0, jsx_runtime_1.jsx)("div", { className: "month-modal-overlay", onClick: () => setShowMonthModal(false), children: (0, jsx_runtime_1.jsxs)("div", { className: "month-modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "modal-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "month-navigation", children: [(0, jsx_runtime_1.jsx)("button", { onClick: prevMonth, children: "\u25C0" }), (0, jsx_runtime_1.jsx)("h2", { children: modalMonth.format('MMMM YYYY') }), (0, jsx_runtime_1.jsx)("button", { onClick: nextMonth, children: "\u25B6" })] }), (0, jsx_runtime_1.jsx)("button", { className: "close-btn", onClick: () => setShowMonthModal(false), children: "\u2715" })] }), (0, jsx_runtime_1.jsx)("div", { className: "weekday-row", children: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ((0, jsx_runtime_1.jsx)("div", { className: "weekday", children: day }, i))) }), (0, jsx_runtime_1.jsx)("div", { className: "month-grid", children: getMonthDays(modalMonth).map((day) => {
                                const dateStr = day.format('YYYY-MM-DD');
                                const isToday = dateStr === (0, dayjs_1.default)().format('YYYY-MM-DD');
                                const isCurrentMonth = day.month() === modalMonth.month();
                                return ((0, jsx_runtime_1.jsx)("div", { className: `day-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`, onClick: () => {
                                        setSelectedDate(dateStr);
                                        setShowMonthModal(false);
                                    }, children: (0, jsx_runtime_1.jsxs)("div", { style: { position: 'relative' }, children: [day.format('D'), eventDaysSet.has(dateStr) && ((0, jsx_runtime_1.jsx)("span", { className: "dot-calendar" }))] }) }, dateStr));
                            }) })] }) }))] }));
};
exports.default = CalendarPage;
//# sourceMappingURL=CalendarPage.js.map