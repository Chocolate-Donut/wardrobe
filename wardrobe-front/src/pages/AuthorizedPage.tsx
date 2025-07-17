//AuthorizedPage.tsx
import React, {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { message, Spin } from 'antd';
import axios from 'axios';

import './AuthorizedPage.css'

import WeatherCityBlock from '../components/WeatherBlock';
import WardrobeActions from '../components/WardrobeActions';
import WeatherCarousel from '../components/WeatherCarousel';
import FilterBar from '../components/FilterBar';
import LookCard from '../components/LookCard';
import ProfileSettingsModal from '../components/ProfileSettingsModal';


interface Props {
  temperature: number | null;
  icon: string | null;
  city: string;
  handleCityChange: (value: string) => void;
  weatherLooks: any[];
  sliderRef: ((node: HTMLDivElement | null) => void) | null;
  showSeasonOptions: boolean;
  showTrendOptions: boolean;
  handleSeasonClick: () => void;
  handleTrendClick: () => void;
  setShowSeasonOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTrendOptions: React.Dispatch<React.SetStateAction<boolean>>;
}




const AuthorizedPage: React.FC <Props> = ({temperature, icon, city, handleCityChange,  weatherLooks,
  showSeasonOptions, showTrendOptions,
  handleSeasonClick, handleTrendClick,
  setShowSeasonOptions, setShowTrendOptions,
  sliderRef,}) =>{
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');     // Удаляем токен
        navigate('/');                        // Отправляем на главную
      };
    
      //аватар
      const username = localStorage.getItem('username') || 'User';
      const rawAvatar = localStorage.getItem('avatar') || '';
      const avatarUrl = rawAvatar?.includes('http')
        ? rawAvatar
        : `http://localhost:3000${rawAvatar}`;
      const [showSettingsModal, setShowSettingsModal] = useState(false);
      const [showProfileModal, setShowProfileModal] = useState(false);

      



console.log('avatarUrl:', avatarUrl);

useEffect(() => {
  const loginSuccess = localStorage.getItem('login_success');
  console.log('login_success:', loginSuccess);

  if (loginSuccess === 'true') {
    // ⏱ Ждём отрисовки DOM и подключение CSS
    setTimeout(() => {
      message.success('Вы успешно вошли!');
      localStorage.removeItem('login_success');
    }, 100); // 100–200 мс
  }
}, []);


useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }
  loadSmartFeed();
}, []);
//избр
const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

useEffect(() => {
  axios.get('http://localhost:3000/favorites/my-favorites', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(res => {
      setFavoriteIds(res.data.map((look: any) => look.id));
    })
    .catch(err => console.error('Не удалось загрузить избранные', err));
}, []);

type Outfit = {
  id: number;
  title: string;
  imageUrl: string;
  colors: string[];
  tags: string[];
  season?: string;
  trend?: string;
  type?: string;
  rating?: number;
  isPrivate?: boolean;
  createdAt?: string;
};


const [smartFeed, setSmartFeed] = useState<Outfit[]>([]);

/* useEffect(() => {
  axios.get('http://localhost:3000/feed/smart', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
    .then(res => setSmartFeed(res.data))
    .catch(err => console.error('Ошибка смарт-ленты:', err));
}, []); */


const [isLoading, setIsLoading] = useState(false);
const [fallbackFeed, setFallbackFeed] = useState<Outfit[]>([]);

const loadSmartFeed = async () => {
  try {
    const res = await axios.get('http://localhost:3000/feed/smart', {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    });
    setSmartFeed(res.data);
  } catch (err) {
    console.error('Ошибка при загрузке smart feed:', err);
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        // Токен недействителен - перенаправляем на логин
        localStorage.removeItem('token');
        navigate('/login');
        return;
      } // Fallback: загружаем обычные образы если smart feed не работает
      try {
        const fallbackRes = await axios.get('http://localhost:3000/outfits', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFallbackFeed(fallbackRes.data);
        message.warning('Используем стандартные образы вместо рекомендаций');
      } catch (fallbackErr) {
        message.error('Не удалось загрузить образы');
      }
    }
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }
  loadSmartFeed();
}, [navigate]);


//фильтр
const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
const [selectedTrend, setSelectedTrend] = useState<string | null>(null);


const handleFilterBySeason = (season: string) => {
  setSelectedSeason(season);
};

const handleFilterByTrend = (trend: string) => {
  setSelectedTrend(trend);
};

const handleResetFilters = () => {
  setSelectedSeason(null);
  setSelectedTrend(null);
   setSearchQuery('');
  setSelectedColor(null);

  // Повторно загрузить smartFeed
  axios.get('http://localhost:3000/feed/smart', {
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


//
const handleOpenSettings = () => {
  setShowSettingsModal(false);      // закрываем первую модалку
  setShowProfileModal(true);       // открываем модалку профиля
};


//


const [searchQuery, setSearchQuery] = useState('');
const [selectedColor, setSelectedColor] = useState<string | null>(null);

// Поиск по тексту
const handleSearchSubmit = () => {
  console.log('🔍 Поиск отправлен:', searchQuery);
  axios.get(`http://localhost:3000/outfits/search?query=${searchQuery}`, {
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



// Поиск по цвету
const handleColorChange = (color: string) => {
  setSelectedColor(color);
  axios.post(`http://localhost:3000/outfits/search-by-color`, { palette: [color] },
        {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  )
    .then(res => setSmartFeed(res.data))
    .catch(err => console.error('Ошибка при поиске по цвету', err));
};

const handleClearColor = () => {
  setSelectedColor(null);
  handleResetFilters(); // сбрасываем на дефолтный список
};

useEffect(() => {
  if (searchQuery.trim() === '') {
    axios.get('http://localhost:3000/feed/smart', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setSmartFeed(res.data))
      .catch(err => console.error('Ошибка при сбросе smartFeed:', err));
  }
}, [searchQuery]);




  return (
<div>
  <div style={{backgroundAttachment:'relative', 
    backgroundRepeat: 'no-repeat', 
    background: 'linear-gradient(to bottom, rgba(36, 36, 36, 0.85), rgba(53, 53, 53, 0.5)), url(/kimono_bg.png)',
    backgroundSize: 'cover',
    backgroundBlendMode: 'multiply',
    }}>

    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 6rem',
      backgroundColor: ' rgba(0, 0, 0, 0.282)',
      backdropFilter: 'blur(7px)',
      borderBottomLeftRadius:'20px',
      borderBottomRightRadius:'20px'
      }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img
          src={avatarUrl}
          alt="avatar"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-avatar.png';
          }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: 'none',
            imageRendering: 'auto', 
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)', 
          }}
        />
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>{username}</span>

      </div>
      <div style={{ display: 'flex', gap: '5rem' }}>
        <WeatherCityBlock
        temperature={temperature}
        icon={icon}
        city={city}
        onCityChange={handleCityChange}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <img src="/icons8-закрытый-почтовый-ящик,-флаг-опущен-100.png" style={{ width: '40px', cursor: 'pointer' }} />
          <div style={{ position: 'relative' }}>
            <img
              src="/icons8-сервисы-100.png"
              style={{ width: '35px', cursor: 'pointer' }}
              onClick={() => setShowSettingsModal(true)}
            />

            {showSettingsModal && (
              <div
                className="modal-backdrop"
                onClick={() => setShowSettingsModal(false)} // клик вне — закрывает
              >
                <div
                  className="dropdown-modal"
                  onClick={(e) => e.stopPropagation()} // клик по модалке — НЕ закрывает
                    >
                      <button className="settings" onClick={handleOpenSettings}>
                        profile settings
                      </button>
                      <button className="logout" onClick={handleLogout}>
                        log out
                      </button>
                    </div>
                  </div>
                )}
              </div>


      </div>
      </div>  
    </div>

    
    <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
      
      <WardrobeActions
        carousel={
        <WeatherCarousel weatherLooks={weatherLooks} sliderRef={sliderRef} isAuthorized favoriteIds={favoriteIds} />
        }
      /> 
    </div>
    <div >
      <FilterBar
        showSeasonOptions={showSeasonOptions}
        showTrendOptions={showTrendOptions}
        handleSeasonClick={handleSeasonClick}
        handleTrendClick={handleTrendClick}
        handleFilterBySeason={handleFilterBySeason}
        handleFilterByTrend={handleFilterByTrend}
        handleResetFilters={handleResetFilters}
        closeFilters={() => {
          setShowSeasonOptions(false);
          setShowTrendOptions(false);
        }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          selectedColor={selectedColor}
          onColorChange={handleColorChange}
          onClearColor={handleClearColor}
      />

    


    <div style={{ padding: '3rem', color: 'white' }}>

{isLoading ? (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <Spin size="large" />
  </div>
) : (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
    {filteredSmartFeed.map((look) => (
    <LookCard
      key={look.id}
      look={look}
      isAuthorized={true}
      isInitiallyFavorite={favoriteIds.includes(look.id)}
      onRemoveFavorite={(id) =>
        setFavoriteIds(prev => prev.filter(favId => favId !== id))
      }

    />
    ))}
  </div>
)}



</div>
</div>


 </div>



<ProfileSettingsModal
  visible={showProfileModal}
  onClose={() => setShowProfileModal(false)}
/>

</div>
  );
};

export default AuthorizedPage;
