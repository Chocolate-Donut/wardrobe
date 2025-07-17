import React from 'react';
interface WeatherBlockProps {
    temperature: number | null;
    icon: string | null;
    city: string;
    onCityChange: (value: string) => void;
}
declare const WeatherBlock: React.FC<WeatherBlockProps>;
export default WeatherBlock;
