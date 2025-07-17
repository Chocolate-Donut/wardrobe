import React, { useEffect, useState, useRef  } from 'react';
import {  message, /* Select */ } from 'antd';

import axios from 'axios';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider, KeenSliderPlugin } from 'keen-slider/react';
import './App.css';
import "keen-slider/keen-slider.min.css";

import LoginModal from './components/LoginModal';
import ScrollToTopButton from './components/ScrollToTopButton';

import { Routes, Route, Navigate } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import AuthorizedPage from './pages/AuthorizedPage';
import MainPage from './pages/MainPage'; 
import FavoritesPage from './pages/FavoritesPage';
import WardrobePage from './pages/WardrobePage';
import CreateLookPage from './pages/CreateLookPage';
import ConstructorPage from './pages/ConstructorPage';
import MyLooksPage from './pages/MyLooksPage';
import CalendarPage from './pages/CalendarPage';


//import ScrollSquare from './components/ScrollSquare';


const carousel: KeenSliderPlugin = (slider) => {
  const z = 380;
  
  function rotate() {
    const deg = 360 * slider.track.details.progress;
    slider.container.style.transform = `translateZ(-${z}px) rotateY(${-deg}deg)`;
  
    slider.slides.forEach((slide, idx) => {
      const slideDeg = (360 / slider.slides.length) * idx - deg;
      const normalizedDeg = (slideDeg + 360) % 360;
  
      // Рассчитываем прозрачность
      let opacity = 1 - Math.min(Math.abs(normalizedDeg), Math.abs(360 - normalizedDeg)) / 180;
      opacity = opacity * 1 + 0.7; // минимальная прозрачность 0.2
  
      // Рассчитываем scale
      let scale = 1 - Math.min(Math.abs(normalizedDeg), Math.abs(360 - normalizedDeg)) / 600;
      scale = Math.max(scale, 0.8); // минимальный размер 0.8x

      // Рассчитываем затемнение
      let brightness = 1 - Math.min(Math.abs(normalizedDeg), Math.abs(360 - normalizedDeg)) / 180;
      brightness = brightness * 0.5 + 0.5; // минимальная яркость 0.5

      // Рассчитываем размытие
      let blur = Math.min(Math.abs(normalizedDeg), Math.abs(360 - normalizedDeg)) / 40; 
      blur = Math.min(blur, 500); // максимум 3px блюра
  
      // Применяем одновременно scale + opacity
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




interface Look {
  id: number;
  title: string;
  imageUrl: string;
  colors?: string[];
  tags?: string[] | string;
  season?: string;
  trend?: string;
  rating?: number;
}


const App: React.FC = () => {

  const navigate = useNavigate();

  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Проверяем, установлено ли приложение, с использованием localStorage
  useEffect(() => {
    // Проверка наличия метки о установке приложения в localStorage
    if (localStorage.getItem('appInstalled')) {
      setIsAppInstalled(true);
    }

    const beforeInstallPromptHandler = (e: any) => {
      e.preventDefault(); // Предотвращаем стандартную подсказку
      setDeferredPrompt(e); // Сохраняем событие для дальнейшего использования
    };

    const appInstalledHandler = () => {
      setIsAppInstalled(true); // Когда приложение установлено, скрываем кнопку
      localStorage.setItem('appInstalled', 'true'); // Сохраняем метку об установке
    };

    // Подключаем слушатели событий
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      // Убираем слушатели при размонтировании компонента
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Показать подсказку для установки
      deferredPrompt.userChoice
        .then((choiceResult: any) => {
          console.log(choiceResult.outcome === 'accepted' ? 'App installed' : 'App not installed');
          setDeferredPrompt(null); // Обнуляем событие
        });
    }
  };







  const [temperature, setTemperature] = useState<number | null>(null);
  const [icon, setIcon] = useState<string | null>(null);  
  const [city, setCity] = useState<string>('Phuket'); // Для хранения города
  const [popularLooks, setPopularLooks] = useState<Look[]>([]);
  const [weatherLooks, setWeatherLooks] = useState<Look[]>([]);


  
  // Функция для запроса погоды по городу или геолокации
  const fetchWeather = async (cityName: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/weather?city=${cityName}`);
      const temp = response.data.temperature || response.data.main?.temp;
      const iconCode = response.data.icon || response.data.weather?.[0]?.icon;
      setTemperature(temp);
      setIcon(iconCode);
    } catch (error) {
      console.error(error);
      message.error('Не удалось получить данные о погоде');
    }
  };

  // Функция для получения погоды по геолокации
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `http://localhost:3000/weather/coords?lat=${latitude}&lon=${longitude}`
            );
            console.log(response.data);
            const temp = response.data.temperature || response.data.main?.temp;
            const iconCode = response.data.icon || response.data.weather?.[0]?.icon;
            const cityName = response.data.name || response.data.city;
            console.log('Новый город:', cityName); // Логируем имя города
            setTemperature(temp);
            setIcon(iconCode);
            setCity(cityName); // Обновление города на основе геолокации
          } catch (err) {
            console.error('Ошибка при получении погоды по геолокации', err);
          }
        },
        (error) => {
          console.error('Ошибка с геолокацией', error);
          message.error('Ошибка с геолокацией');
        }
      );
    } else {
      console.warn('Геолокация не поддерживается этим браузером');
    }
  }, []);

  // Обновление погоды при изменении города
  useEffect(() => {
    console.log("Город изменился:", city);
    fetchWeather(city);
  }, [city]);

  useEffect(() => {
    axios.get('http://localhost:3000/feed/popular')
      .then((res) => {
        setPopularLooks(res.data);
      })
      .catch((err) => console.error('Ошибка при загрузке популярных образов', err));
  }, []);
  

  // Обработка изменения города в выпадающем списке
  const handleCityChange = (value: string) => {
    setCity(value);
  };

  useEffect(() => {
    if (temperature !== null) {
      axios.get(`http://localhost:3000/feed/recommended?city=${city}`)
      .then((res) => {
        setWeatherLooks(res.data.outfits); // <--- правильно
      })
      .catch((err) => console.error('Ошибка при загрузке образов по погоде', err));
    
    }
  }, [temperature]);

  const autoRotate: KeenSliderPlugin = (slider) => {
    let timeout: ReturnType<typeof setTimeout>;
    let mouseOver = false;
    
    function clearNextTimeout() {
      clearTimeout(timeout);
    }
    
    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) return;
      timeout = setTimeout(() => {
        if (!slider.track.details) return;
        slider.moveToIdx(slider.track.details.abs + 1, true);
      }, 8000); // каждые 8 секунды
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
  

  const timer = useRef<NodeJS.Timeout | null>(null);
  //прокрутка
  const [sliderRef/* , instanceRef */] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      selector: ".carousel__cell", // <-- Важно
      renderMode: "custom",         // <-- Важно
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
        clearInterval(timer.current); // Останавливаем автопрокрутку при взаимодействии
      }
    },
  },
    [carousel, autoRotate]  // <-- ВАЖНО подключить свой плагин
  );
  

  const [showSeasonOptions, setShowSeasonOptions] = useState(false);
  const [showTrendOptions, setShowTrendOptions] = useState(false);
  const handleSeasonClick = () => {
    setShowSeasonOptions(!showSeasonOptions);
    setShowTrendOptions(false); // Закрыть другие фильтры
  };
  
  const handleTrendClick = () => {
    setShowTrendOptions(!showTrendOptions);
    setShowSeasonOptions(false); // Закрыть другие фильтры
  };
  const handleFilterBySeason = (season: string) => {
    axios.get(`http://localhost:3000/feed/filter?season=${season}`)
      .then((res) => {
        setPopularLooks(res.data);  // Обновляем список образов
      })
      .catch((err) => console.error('Ошибка при фильтрации по сезону', err));
  };
    
  const handleResetFilters = async () => {
    try {
      const response = await axios.get('http://localhost:3000/feed/popular'); 
      setPopularLooks(response.data);  // ✅ вместо setFilteredLooks
    } catch (error) {
      console.error('Ошибка при сбросе фильтров', error);
    }
  };

  const handleFilterByTrend = (trend: string) => {
    axios.get(`http://localhost:3000/feed/filter?trend=${trend}`)
      .then((res) => {
        setPopularLooks(res.data);  // Обновляем список образов по тренду
      })
      .catch((err) => console.error('Ошибка при фильтрации по тренду', err));
  };
  
  
  
  

  return (
    
  
    <>
      <Routes>
        <Route path="/" element={
          localStorage.getItem('token')
          ? <Navigate to="/dashboard" replace />
          : <MainPage
            temperature={temperature}
            icon={icon}
            city={city}
            handleCityChange={handleCityChange}
            isAppInstalled={isAppInstalled}
            handleInstallClick={handleInstallClick}
            showSeasonOptions={showSeasonOptions}
            showTrendOptions={showTrendOptions}
            handleSeasonClick={handleSeasonClick}
            handleTrendClick={handleTrendClick}
            handleFilterBySeason={handleFilterBySeason}
            handleFilterByTrend={handleFilterByTrend}
            handleResetFilters={handleResetFilters}
            setShowSeasonOptions={setShowSeasonOptions}
            setShowTrendOptions={setShowTrendOptions}
            popularLooks={popularLooks}
            weatherLooks={weatherLooks}
            sliderRef={sliderRef}
            setLoginModalVisible={setLoginModalVisible}
          />
        } />
          {/* DASHBOARD ТОЛЬКО ДЛЯ АВТОРИЗОВАННЫХ */}
        <Route path="/dashboard" element={ localStorage.getItem('token')
        ? <AuthorizedPage 
          temperature={temperature}
          icon={icon}
          city={city}
          handleCityChange={handleCityChange}
          weatherLooks={weatherLooks}
          sliderRef={sliderRef}
          showSeasonOptions={showSeasonOptions}
          showTrendOptions={showTrendOptions}
          handleSeasonClick={handleSeasonClick}
          handleTrendClick={handleTrendClick}
          setShowSeasonOptions={setShowSeasonOptions}
          setShowTrendOptions={setShowTrendOptions}
          
          
          
          />
        : <Navigate to="/" replace />} />

          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/create-look" element={<CreateLookPage />} />
          <Route path="/constructor" element={<ConstructorPage />} />
          <Route path="/calendar" element={<CalendarPage/>} />
          <Route path="/wardrobe" element={<WardrobePage />} />
          <Route path="/my-outfits" element={<MyLooksPage />} />

      </Routes>
      {/* <LoginModal visible={isLoginModalVisible} onClose={() => setLoginModalVisible(false)}  onLoginSuccess={() => {
    setLoginModalVisible(false);
    navigate('/dashboard');
  }} /> */}
  <LoginModal
  visible={isLoginModalVisible}
  onClose={() => setLoginModalVisible(false)}
  onLoginSuccess={() => {
    setLoginModalVisible(false);
    navigate('/dashboard');
  }}
/>
      <ScrollToTopButton />
    </>
  );
};

export default App;

