import React, {  } from 'react';
import {  Select } from 'antd';
import {   EnvironmentOutlined } from '@ant-design/icons';


interface WeatherBlockProps {
    temperature: number | null;
    icon: string | null;
    city: string;
    onCityChange: (value: string) => void;
  }
  
  

  const WeatherBlock: React.FC<WeatherBlockProps> = ({ temperature, icon, city, onCityChange }) => {
    return(
        <div style={{ display: 'flex', alignItems: 'center' }}>
                      {temperature !== null && (
                        <div className="weather-location-block" /* style={{ display: 'flex', alignItems: 'center', gap:'0.05vw', }} */>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {icon && (
                              <img
                                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                                alt="weather icon"
                                width='90rem'  // Размер иконки погоды
                                height='90rem'  // Размер иконки погоды
                              />
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <span style={{ color: 'white', fontSize: '0.9em' }}>Today is</span>
                            <span style={{ color: 'white', fontSize: '1em', fontWeight: 'bold' }}>{temperature}°C</span>
                          </div>
                        </div>
                      )}
        
        
        
                      <EnvironmentOutlined style={{ fontSize: '2rem' , marginLeft: '1rem'  }} />
                      <Select
                        value={city}  // Используем city из состояния для отображения в Select
                        style={{fontSize: '1rem', width: '140px', height: 'auto',/* fontSize: '10vw', width: '9vw', height:'5wh', */ marginLeft:'0.3rem' , color: 'black'}}
                        onChange={onCityChange/* handleCityChange */}
                        >   
                              <Select.Option value="Astana">Astana</Select.Option>
                              <Select.Option value="Almaty">Almaty</Select.Option>
                              <Select.Option value="Shymkent">Shymkent</Select.Option>
                              <Select.Option value="Semei">Semei</Select.Option>
                              <Select.Option value="Karagandy">Karagandy</Select.Option>
                              <Select.Option value="Petropavl">Petropavl</Select.Option>
                              <Select.Option value="Aktobe">Aktobe</Select.Option>
                              <Select.Option value="Taraz">Taraz</Select.Option>
                              <Select.Option value="kyzylorda">Kyzylorda</Select.Option>
                              <Select.Option value="phuket">Phuket</Select.Option>
                      </Select>
        </div>
    )

};
export default WeatherBlock;