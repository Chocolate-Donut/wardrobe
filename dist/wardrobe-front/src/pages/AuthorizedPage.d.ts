import React from 'react';
import './AuthorizedPage.css';
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
declare const AuthorizedPage: React.FC<Props>;
export default AuthorizedPage;
