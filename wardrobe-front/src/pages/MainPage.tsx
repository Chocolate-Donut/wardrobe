import React, { /* useEffect, useState, useRef  */ } from 'react';
import { Button,/*  message,  *//* Select */ } from 'antd';
import { Link } from 'react-router-dom';
/* import axios from 'axios'; */
import '../App.css';
import "keen-slider/keen-slider.min.css";
import BubbleButton from '../BubbleButton';
import TypewriterText from '../TypewriterText';
/* import LoginModal from '../components/LoginModal'; */
import ScrollToTopButton from '../components/ScrollToTopButton';
import WeatherCityBlock from '../components/WeatherBlock';
import FilterBar from '../components/FilterBar';
import LookCard from '../components/LookCard'; 
import WeatherCarousel from '../components/WeatherCarousel';

interface Props {
  temperature: number | null;
  icon: string | null;
  city: string;
  handleCityChange: (value: string) => void;
  isAppInstalled: boolean;
  handleInstallClick: () => void;
  showSeasonOptions: boolean;
  showTrendOptions: boolean;
  handleSeasonClick: () => void;
  handleTrendClick: () => void;
  handleFilterBySeason: (season: string) => void;
  handleFilterByTrend: (trend: string) => void;
  handleResetFilters: () => void;
  setShowSeasonOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTrendOptions: React.Dispatch<React.SetStateAction<boolean>>;
  popularLooks: any[];
  weatherLooks: any[];
  sliderRef: ((node: HTMLDivElement | null) => void) | null;
  setLoginModalVisible: (visible: boolean) => void;
}

const MainPage: React.FC<Props> = ({
  temperature, icon, city, handleCityChange,
  isAppInstalled, handleInstallClick,
  showSeasonOptions, showTrendOptions,
  handleSeasonClick, handleTrendClick,
  handleFilterBySeason, handleFilterByTrend,
  handleResetFilters, setShowSeasonOptions, setShowTrendOptions,
  popularLooks, weatherLooks, sliderRef,
  setLoginModalVisible,
}) => {

  return (
    <div className="app-wrapper">
    

      <div style={{    backgroundAttachment:'relative', 
        backgroundRepeat: 'no-repeat', 
        background: 'linear-gradient(to bottom, rgba(36, 36, 36, 0.85), rgba(53, 53, 53, 0.5)), url(/pink_dress_bg.png)',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply', 
        /* backgroundPosition: 'center', */ 
       }}>
          
      
        <div className="main-container" >



          {/* Приветствие и погода */}
          <div style={{marginBottom:'20px'}}>
            {/* Показываем кнопку установки только если приложение не установлено */}
            {!isAppInstalled && (
              <button onClick={handleInstallClick}>Download as App</button>
            )}
          </div>
          <div className="header-bar" /* style={{  paddingTop: '5vh',paddingRight:'1vw' ,paddingLeft: '5vw', display: 'flex',  gap: '1rem',flexWrap: 'wrap',justifyContent: 'space-between', alignItems: 'center', marginBottom: '10vh',  }} */>
            <img src="/logo.svg" alt="Logo" style={{ height: '2.5rem' }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <WeatherCityBlock
                temperature={temperature}
                icon={icon}
                city={city}
                onCityChange={handleCityChange}
              />
              <div style={{marginRight: '0.8rem', marginLeft:'2rem'}}>
              <BubbleButton onClick={() => setLoginModalVisible(true)} >Log in</BubbleButton>
              </div>
              <Link to="/signup" /* style={{  marginRight: '2rem' }} */>
                <Button type="primary" style={{color:'rgb(255, 255, 255)', backgroundColor:'rgba(255, 255, 255, 0.33)', backgroundBlendMode:'soft-light', border:0, fontSize:'1em'}}>Sign up</Button>
              </Link>
            </div>
          </div>
          {/* <h1 style={{fontSize:'2rem', textAlign:'center', paddingBottom:'8vh'}}>Welcome, Dear.</h1> */}
          <div style={{paddingBottom:'3rem', color:'white'}}>
          <TypewriterText text="Welcome, Dear."  />
          </div>
              

              
          {/* Рекомендации */}
          <h2 style={{ fontSize: '1rem', fontWeight: '-moz-initial',  marginBottom: '-2rem', paddingLeft:'10rem' }}>Recommendations:</h2>
          {/* Контейнер с flexbox для одной линии */}


            <WeatherCarousel weatherLooks={weatherLooks} sliderRef={sliderRef} />
          {/* {weatherLooks.length >= 3 ? (
            <div className="wrapper">
              <div className="scene">
                <div ref={sliderRef} className="carousel keen-slider">
                  {weatherLooks.slice(0, 9).map((look) => (
                    <div key={look.id} className="carousel__cell">
                      <LookCard look={look} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ) : (
            <div style={{ textAlign: 'center', marginTop: '6rem', paddingBottom:'5rem' }}>
              Loading...    <img src="/blackcat.gif" alt="Loading" style={{ width: '90px', height: '60px' }} />
            </div>
            
          )} */}

          <h2 style={{ fontSize: '1rem', fontWeight: '-moz-initial',  marginBottom: '2rem', paddingLeft:'10rem' }}>Most popular now:</h2>

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
          />



          <div style={{ /* boxSizing: 'border-box',marginLeft:'10vw',marginRight:'10vw',display: 'flex',flexWrap: 'wrap',gap: '40px',overflowY: 'auto',scrollBehavior: 'smooth',justifyContent: 'center',padding: '80px 1vw 0 1vw', */ 
            boxSizing: 'border-box',
            padding: '2rem 5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '40px',
            overflowY: 'auto', 
            scrollBehavior: 'smooth', 
            justifyContent: 'center',
            paddingTop: '80px'
            }}>
      

            {popularLooks.map((look) => (
              <LookCard look={look} />

            ))}
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="goo">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix"
                values="1 0 0 0 0  
                        0 1 0 0 0  
                        0 0 1 0 0  
                        0 0 0 19 -9" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
          </defs>
       </svg>
      </div>
      {/* <LoginModal visible={isLoginModalVisible} onClose={() => setLoginModalVisible(false)} /> */}
      <ScrollToTopButton />
    </div>
  );
};

export default MainPage;
