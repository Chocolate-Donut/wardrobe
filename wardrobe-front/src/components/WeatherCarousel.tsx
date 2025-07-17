import React from 'react';
import LookCard from './LookCard';

interface Props {
  weatherLooks: any[];
  sliderRef: ((node: HTMLDivElement | null) => void) | null;
  isAuthorized?: boolean; 
  favoriteIds?: number[]; 

}

const WeatherCarousel: React.FC<Props> = ({ weatherLooks, sliderRef, isAuthorized = false, favoriteIds,  }) => {
  

  if (weatherLooks.length < 3) {
    return (
      <div style={{ textAlign: 'center', marginTop: '6rem', paddingBottom:'5rem' }}>
        Loading... <img src="/blackcat.gif" alt="Loading" style={{ width: '90px', height: '60px' }} />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="scene">
        <div ref={sliderRef} className="carousel keen-slider">
          {weatherLooks.filter(look => look.isPrivate === false).slice(0, 9).map((look) => (
            <div key={look.id} className="carousel__cell">
              <LookCard look={look} isAuthorized={isAuthorized} isInitiallyFavorite={favoriteIds?.includes(look.id)} />
      
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCarousel;
