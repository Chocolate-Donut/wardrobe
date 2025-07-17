import React from 'react';
interface Props {
    weatherLooks: any[];
    sliderRef: ((node: HTMLDivElement | null) => void) | null;
    isAuthorized?: boolean;
    favoriteIds?: number[];
}
declare const WeatherCarousel: React.FC<Props>;
export default WeatherCarousel;
