import React from 'react';
import './FilterBar.css';
interface FilterBarProps {
    showSeasonOptions: boolean;
    showTrendOptions: boolean;
    handleSeasonClick: () => void;
    handleTrendClick: () => void;
    handleFilterBySeason: (season: string) => void;
    handleFilterByTrend: (trend: string) => void;
    handleResetFilters: () => void;
    closeFilters: () => void;
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    onSearchSubmit?: () => void;
    selectedColor?: string | null;
    onColorChange?: (color: string) => void;
    onClearColor?: () => void;
}
declare const FilterBar: React.FC<FilterBarProps>;
export default FilterBar;
