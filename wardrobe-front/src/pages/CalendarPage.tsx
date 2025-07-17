// src/pages/CalendarPage.tsx
import React, { useEffect, useState,  useMemo, useRef, /* useCallback */ } from 'react';
import axios from 'axios';
import './CalendarPage.css';
import dayjs from 'dayjs';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect } from 'react';




import OutfitPickerModal from '../components/OutfitPickerModal';
import NavigationMenu from '../components/NavigationMenu';


interface CalendarEntry {
  date: string;
  events: string[];
  note: string;
  outfits: { id: number; imageUrl: string }[];
  temperature: number | null;
  weatherType: string | null;
}

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [calendarData, setCalendarData] = useState<CalendarEntry | null>(null);
  /* const [monthView, setMonthView] = useState(false); */
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
  slides: {
    perView: 1,
  },
  mode: "snap",
});

  /* const [prevDate, setPrevDate] = useState(selectedDate); */
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [activeCircleLeft, setActiveCircleLeft] = useState(0);
  const dateItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [modalMonth, setModalMonth] = useState(dayjs()); // управляем отображаемым месяцем


    const prevMonth = () => {
  setModalMonth(prev => prev.subtract(1, 'month'));
};

const nextMonth = () => {
  setModalMonth(prev => prev.add(1, 'month'));
};


/* const MemoizedDayCell = React.memo(({ day, onClick, isToday, isCurrentMonth }: {
  day: dayjs.Dayjs;
  onClick: () => void;
  isToday: boolean;
  isCurrentMonth: boolean;
}) => (
  <div
    className={`day-cell ${isToday ? 'today' : ''} ${
      !isCurrentMonth ? 'other-month' : ''
    }`}
    onClick={onClick}
  >
    {day.format('D')}
  </div>
));
const handleDayClick = useCallback((dateStr: string) => {
  setSelectedDate(dateStr);
  setShowMonthModal(false);
}, []);

const handleCloseModal = useCallback(() => {
  setShowMonthModal(false);
}, []); */



//modal
const fetchCalendarData = () => {
  console.log("📅 Fetching calendar for date:", selectedDate);  // 💡

  axios
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


const [newEvent, setNewEvent] = useState('');
useEffect(() => {
  const timer = setTimeout(() => {
    if (newEvent.trim()) {
      axios
        .post(`http://localhost:3000/calendar/${selectedDate}/event`,
          { event: newEvent },
          { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          fetchCalendarData();
          setNewEvent('');
        })
        .catch(err => console.error('❌ Ошибка при автосохранении события:', err));
    }
  }, 700);

  return () => clearTimeout(timer);
}, [newEvent]);




const handleOutfitSelect = async (outfitId: number) => {
  try {
    await axios.post(
      `http://localhost:3000/calendar/${selectedDate}/outfits`,
      { outfitId },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );
    setShowModal(false);
    // перезапрашиваем календарь
    fetchCalendarData(); // 👉 вызов функции, которая грузит календарь по дате
  } catch (error) {
    console.error('❌ Ошибка при добавлении образа:', error);
  }
};

const handleRemoveOutfit = async (outfitId: number) => {
  try {
    await axios.delete(`http://localhost:3000/calendar/${selectedDate}/outfits`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { outfitId }
    });
    fetchCalendarData(); // Обновим календарь
  } catch (err) {
    console.error('❌ Ошибка при удалении образа:', err);
  }
};


const handleNoteChange = async (newNote: string) => {
  try {
    await axios.put(
      `http://localhost:3000/calendar/${selectedDate}/note`,
      { note: newNote },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  } catch (err) {
    console.error('❌ Ошибка при сохранении заметки:', err);
  }
};



const handleEventsChange = async (text: string) => {
  const events = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  try {
    await axios.put(
      `http://localhost:3000/calendar/${selectedDate}/events`,
      { events },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCalendarData();
  } catch (err) {
    console.error('❌ Ошибка при обновлении событий:', err);
  }
};

//лента дат

const numberOfWeeks = 12; // 3 месяца диапазона
const today = dayjs();

const weeks = useMemo(() => {
  const result: dayjs.Dayjs[][] = [];

  for (let i = -numberOfWeeks; i <= numberOfWeeks; i++) {
    const start = today.add(i, 'week').startOf('week'); // понедельник
    const week: dayjs.Dayjs[] = [];

    for (let d = 0; d < 7; d++) {
      week.push(start.add(d, 'day'));
    }

    result.push(week);
  }

  return result;
}, []);

useLayoutEffect(() => {
  const todayStr = dayjs().format('YYYY-MM-DD');
  const flatDates = weeks.flat();
  const todayIndex = flatDates.findIndex(day => day.format('YYYY-MM-DD') === todayStr);
  const todayWeekIndex = Math.floor(todayIndex / 7);

  if (todayWeekIndex !== -1 && instanceRef.current) {
    instanceRef.current.moveToIdx(todayWeekIndex, false);
  }
}, [weeks, instanceRef.current]);


// Изменения в основном useEffect для инициализации
useEffect(() => {
  const todayStr = dayjs().format('YYYY-MM-DD');
  setSelectedDate(todayStr);

  // Затем после небольшой задержки (чтобы React успел обновиться) центрируем слайдер
  const timer = setTimeout(() => {
    const activeEl = dateItemRefs.current[todayStr];
    if (activeEl && instanceRef.current) {
      const slider = instanceRef.current;
      const slideIndex = Math.floor(
        weeks.findIndex(week =>
            week.some(day => day.format('YYYY-MM-DD') === todayStr)
        ) / 7
        );

      
      if (slideIndex !== -1) {
        slider.moveToIdx(slideIndex, false);
        const offset = activeEl.offsetLeft + activeEl.offsetWidth / 2 - 20;
        setActiveCircleLeft(offset);
      }
    }
  }, 100);

  return () => clearTimeout(timer);
}, [weeks]); // Зависимость только от weeks
    ///эвенты есть
    const eventDaysSet = useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(calendarData?.events) && calendarData.events.length > 0) {
        set.add(selectedDate); // текущий день, если есть события
    }
    return set;
    }, [calendarData, selectedDate]);




//неделя
/* const handleWeekChange = (dir: "prev" | "next") => {
  const delta = dir === "next" ? 7 : -7;
  const newDate = dayjs(selectedDate).add(delta, 'day');
  setDirection(dir === "next" ? "right" : "left");
  setSelectedDate(newDate.format('YYYY-MM-DD'));
}; */




const [circleVisible, setCircleVisible] = useState(false);

useEffect(() => {
  setCircleVisible(false);
  const timer = setTimeout(() => setCircleVisible(true), 50);
  return () => clearTimeout(timer);
}, [selectedDate]);




const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  return () => setMounted(false);
}, []);

// Затем в useEffect для обновления позиции круга:
useEffect(() => {
  if (!mounted) return;
  
  const activeEl = dateItemRefs.current[selectedDate];
  if (activeEl && instanceRef.current) {
    const offset = activeEl.offsetLeft + activeEl.offsetWidth / 2 - 20;
    setActiveCircleLeft(offset);
  }
}, [selectedDate, instanceRef.current, mounted]);


//full calendar
const getMonthDays = useMemo(() => {
  return (monthDate: dayjs.Dayjs): dayjs.Dayjs[] => {
    const start = monthDate.startOf('month').startOf('week');
    const end = monthDate.endOf('month').endOf('week');
    const days: dayjs.Dayjs[] = [];
    let date = start.clone();

    while (date.isBefore(end, 'day')) {
      days.push(date.clone());
      date = date.add(1, 'day');
    }

    return days;
  };
}, []);
const handleOpenMonthModal = () => {
  setModalMonth(dayjs(selectedDate)); // Устанавливаем текущий месяц
  setShowMonthModal(true);
};





useEffect(() => {
  const activeEl = dateItemRefs.current[selectedDate];
  if (activeEl && instanceRef.current) {
    const offset = activeEl.offsetLeft + activeEl.offsetWidth / 2 - 20;
    setActiveCircleLeft(offset);
  }
}, [selectedDate, instanceRef.current]); // Добавили зависимость от instanceRef.current

useEffect(() => {
  fetchCalendarData();
}, [selectedDate]);

if (!calendarData) {
  return (
    <div className="calendar-container">
      <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</p>
    </div>
  );
}


  return (
    <div className="calendar-container">
        <NavigationMenu />
        <div className="top-curve-container">
            <div className="top-curve">
            <img src="/5250206.jpg" className="curve-image" />
            </div>

        </div>
    <div className="content-over-curve">
     <div className="current-date-top">{dayjs(selectedDate).format('dddd, D MMMM')}</div>
      <div className="date-header">
          <button 
                className="calendar-toggle-btn" 
                onClick={handleOpenMonthModal}
                >
                <img 
                    src='icons8-календарь-100.png' 
                    style={{ width: '50px' }} 
                    alt="Calendar" 
                />
          </button>
        <div className="date-strip-wrapper">
        <div 
            className={`active-date-circle ${circleVisible ? 'visible' : ''}`}
            style={{ left: `${activeCircleLeft}px` }}
            />
        <div ref={sliderRef} className="keen-slider date-strip">
            {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="keen-slider__slide week-slide">
                {week.map((day) => {
                    const dateStr = day.format('YYYY-MM-DD');
                    const isSelected = dateStr === selectedDate;

                    return (
                    <div
                        key={dateStr}
                        ref={(el) => {
                        dateItemRefs.current[dateStr] = el;
                        }}
                        className={`date-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                        const isForward = dayjs(dateStr).isAfter(dayjs(selectedDate));
                        setDirection(isForward ? "right" : "left");
                        setSelectedDate(dateStr);
                        
                        // Находим индекс недели для выбранной даты
                        const weekIndex = weeks.findIndex(week => 
                            week.some(day => day.format('YYYY-MM-DD') === dateStr)
                        );
                        
                        if (weekIndex !== -1 && instanceRef.current) {
                            instanceRef.current.moveToIdx(weekIndex, true);
                        }
                        }}
                    >
                            <div className="number-wrapper">
                                <span className="number">{day.format('D')}</span>
                                {eventDaysSet.has(dateStr) && <span className="dot" />}
                            </div>

                    </div>
                    );
                })}
                </div>
            ))}
        </div>
        
        </div>


        
       
  </div>


        <AnimatePresence mode="wait">
        <motion.div
            key={selectedDate}
            initial={{ opacity: 0, x: direction === "right" ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === "right" ? -100 : 100 }}
            transition={{ duration: 0.35 }}
        >
          <div className="weather-info">
            <p>{calendarData.temperature !== null ? `+${calendarData.temperature}°` : 'Погода недоступна'}</p>
            <p>{calendarData.weatherType}</p>
          </div>

          <div className="events">
            <textarea
                value={(calendarData.events ?? []).join('\n')}
                placeholder="Write events, one per line..."
                onChange={(e) => handleEventsChange(e.target.value)}
            />
            </div>





          {/* <div className="outfits">{
            calendarData.outfits.map((outfit) => (
                <div key={outfit.id} className="outfit-wrapper">
                    <img
                    src={`http://localhost:3000/${outfit.imageUrl}`}
                    alt="Outfit"
                    className="outfit-img"
                    />
                    <button className="delete-btn" onClick={() => handleRemoveOutfit(outfit.id)}>🗑</button>
                </div>
                ))
              }
          </div> */}

          


            {/* {monthView && (
            <div className="month-view">
                {getMonthDays(selectedDate).map(day => {
                const dateStr = day.format('YYYY-MM-DD');
                const isToday = dateStr === dayjs().format('YYYY-MM-DD');

                return (
                    <div
                    key={dateStr}
                    className={`day-cell ${isToday ? 'today' : ''}`}
                    onClick={() => {
                        setMonthView(false);
                        setSelectedDate(dateStr);
                    }}
                    >
                    {day.format('D')}
                    </div>
                );
                })}
            </div>
            )} */}



        <div className="looks-section">
            <p className="section-title">Looks for today:</p>

            <div className="outfit-grid">
                {calendarData.outfits.length > 0 ? (
                calendarData.outfits.map((outfit) => (
                    <div key={outfit.id} className="outfit-wrapper">
                    <img
                        src={`http://localhost:3000/${outfit.imageUrl}`}
                        alt="Outfit"
                        className="outfit-img"
                    />
                    <button className="delete-btn" onClick={() => handleRemoveOutfit(outfit.id)}>🗑</button>
                    </div>
                ))
                ) : (
                <>
                    <div className="empty-hanger">✨</div>
                    <div className="empty-hanger">✨</div>
                    <div className="empty-hanger">✨</div>
                </>
                )}
            </div>

            <button className="add-outfit-btn" onClick={() => setShowModal(true)}>+ Add Outfit</button>
      </div>



<div className="note-section">
            <div className="note-section">
  <textarea
    defaultValue={calendarData.note}
    placeholder="Notes..."
    onChange={(e) => handleNoteChange(e.target.value)}
  />
</div>
          </div>
    
  </motion.div>
</AnimatePresence>
</div>
        <OutfitPickerModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            onSelect={handleOutfitSelect}
            />





              {showMonthModal && (
  <div className="month-modal-overlay" onClick={() => setShowMonthModal(false)}>
    <div className="month-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <div className="month-navigation">
          <button onClick={prevMonth}>◀</button>
          <h2>{modalMonth.format('MMMM YYYY')}</h2>
          <button onClick={nextMonth}>▶</button>
        </div>
        <button className="close-btn" onClick={() => setShowMonthModal(false)}>✕</button>
      </div>

      <div className="weekday-row">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
          <div key={i} className="weekday">{day}</div>
        ))}
      </div>

      <div className="month-grid">
        {getMonthDays(modalMonth).map((day) => {
          const dateStr = day.format('YYYY-MM-DD');
          const isToday = dateStr === dayjs().format('YYYY-MM-DD');
          const isCurrentMonth = day.month() === modalMonth.month();

          return (
            <div
            key={dateStr}
            className={`day-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
            onClick={() => {
                setSelectedDate(dateStr);
                setShowMonthModal(false);
            }}
            >
            <div style={{ position: 'relative' }}>
                {day.format('D')}
                {eventDaysSet.has(dateStr) && (
                <span className="dot-calendar" />
                )}
            </div>
            </div>

          );
        })}
      </div>
    </div>
  </div>
)}
  
    </div>
  );
};

export default CalendarPage;
