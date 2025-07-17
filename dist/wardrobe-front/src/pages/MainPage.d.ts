import React from 'react';
import '../App.css';
import "keen-slider/keen-slider.min.css";
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
declare const MainPage: React.FC<Props>;
export default MainPage;
