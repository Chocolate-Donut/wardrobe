import React, { useRef, useEffect } from 'react';
import './FilterBar.css'

interface FilterBarProps {
  showSeasonOptions: boolean;
  showTrendOptions: boolean;
  handleSeasonClick: () => void;
  handleTrendClick: () => void;
  handleFilterBySeason: (season: string) => void;
  handleFilterByTrend: (trend: string) => void;
  handleResetFilters: () => void;
  closeFilters: () => void; // 👈 для клика вне компонента

  // ✅ Делаем необязательными:
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  selectedColor?: string | null;
  onColorChange?: (color: string) => void;
  onClearColor?: () => void;

}

const FilterBar: React.FC<FilterBarProps> = ({
  showSeasonOptions,
  showTrendOptions,
  handleSeasonClick,
  handleTrendClick,
  handleFilterBySeason,
  handleFilterByTrend,
  handleResetFilters,
  closeFilters,

  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedColor,
  onColorChange,
  onClearColor,

}) => {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        closeFilters();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeFilters]);

  return (
    <div className="filter-bar" ref={filterRef}>
      <div>
        <div style={{ flexShrink: 0 }}>
        <button className="filter-button" onClick={handleSeasonClick}>season</button>
        </div>
        <div className={`season-options-container ${showSeasonOptions ? 'show' : ''}`}>
          <button style={{ borderRadius: '30px' }} onClick={() => handleFilterBySeason('spring')}>🌸</button>
          <button style={{ borderRadius: '30px' }} onClick={() => handleFilterBySeason('summer')}>☀️</button>
          <button style={{ borderRadius: '30px' }} onClick={() => handleFilterBySeason('autumn')}>🍂</button>
          <button style={{ borderRadius: '30px' }} onClick={() => handleFilterBySeason('winter')}>❄️</button>
        </div>
      </div>

      <div>
        <div style={{ flexShrink: 0 }}>
        <button className="filter-button" onClick={handleTrendClick}>trend</button>
        </div>
        <div className={`trend-options-container ${showTrendOptions ? 'show' : ''}`}>
          <button style={{ borderRadius: '30px' }} onClick={() => handleFilterByTrend('casual')}>🌀 Casual</button>
          <button style={{ borderRadius: '30px' }} onClick={() => handleFilterByTrend('glamor')}>💎 Glamor</button>
          <button style={{ borderRadius: '30px' }} onClick={() => handleFilterByTrend('sport')}>🏋️‍♂️ Sport</button>
          <button style={{ borderRadius: '30px' }} onClick={() => handleFilterByTrend('retro')}>🕰️ Retro</button>
        </div>
      </div>

      <div style={{  flexShrink: 0 }}>
        <button onClick={handleResetFilters} className="reset-button">Reset</button>
      </div>


            {onSearchChange && onSearchSubmit && (
          <div className="search-container">
            <input
              type="text"
              placeholder="Search outfits..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button className="search-btn" onClick={onSearchSubmit}>Search</button>
          </div>
        )}

        {onColorChange && selectedColor !== undefined && (
          <div className="color-picker-container">
            <input
              type="color"
              onChange={(e) => onColorChange(e.target.value)}
              value={selectedColor || '#ffffff'}
              className="color-picker"
            />
            {selectedColor && onClearColor && (
              <div className="selected-color-preview" style={{ backgroundColor: selectedColor }}>
                <button className="clear-color-btn" onClick={onClearColor}>×</button>
              </div>
            )}
          </div>
        )}



    </div>
  );
};

export default FilterBar;
