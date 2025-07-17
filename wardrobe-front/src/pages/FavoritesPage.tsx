import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LookCard from '../components/LookCard';
import './FavoritesPage.css'
import NavigationMenu  from '../components/NavigationMenu';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

const handleRemoveFavorite = (id: number) => {
  setRemovedIds(prev => [...prev, id]);

  setTimeout(() => {
    setFavorites(prev => prev.filter((look) => look.id !== id));
    setFavoriteIds(prev => prev.filter((favId) => favId !== id));
  }, 400); // задержка под CSS-анимацию
};



useEffect(() => {
  axios.get('http://localhost:3000/favorites/my-favorites', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((res) => {
        const data: { id: number }[] = res.data;
        setFavorites(data);
        setFavoriteIds(data.map((look) => look.id));
        })
    .catch(err => console.error('❌ Ошибка при получении избранных', err));
}, []);

const [removedIds, setRemovedIds] = useState<number[]>([]);




  return (
    <div className='favorites-container'>
      <NavigationMenu />
    <div style={{
      padding: '0rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'center',
      color: 'white'
    }}>
      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'white' }}>
        <p>You don't have any favorites yet. 💔</p>
        </div>
      ) : 
      (
        <div>
             <h1
                 style={{
                fontSize: '1.5rem',
                color: 'white',
                textAlign: 'center',
                marginBottom: '2rem',
                fontWeight: 600,
                textShadow: '1px 1px 6px rgba(0,0,0,0.3)',
                }}
             >
                💖 Ваши избранные образы
            </h1>
            <div style={{
            padding: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'center',
          }}>
        {favorites.map((look) => (
           <div
                key={look.id}
                className={`card-container ${removedIds.includes(look.id) ? 'fade-out' : ''}`}
                >
                <LookCard key={look.id} look={look}
                isAuthorized
                isInitiallyFavorite={favoriteIds.includes(look.id)}  
                onRemoveFavorite={handleRemoveFavorite}/>
            </div>
        ))}</div>
        </div>
      )}
    </div>
    </div>
  );
};

export default FavoritesPage;
