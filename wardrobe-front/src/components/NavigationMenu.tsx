// src/components/NavigationMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import './NavigationMenu.css';

const NavigationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

/*   const toggleMenu = () => setIsOpen(!isOpen);
  const goTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  }; */

  


    // ❗ Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

    const menuItems = [
    { label: '🏠 Home', path: '/dashboard' },
    { label: '👚 Wardrobe', path: '/wardrobe' },
    { label: '💖 Favorites', path: '/favorites' },
    { label: '➕ Create Look', path: '/create-look' },
    { label: '📅 Calendar', path: '/calendar' },
    { label: '👗 My outfits', path: '/my-outfits' },
  ];

    const totalAnimationDuration = menuItems.length * 100 + 300; // ~700ms

    const toggleMenu = () => {
      if (isOpen) {
        // Запуск анимации закрытия
        setIsClosing(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsClosing(false);
        }, totalAnimationDuration);
      } else {
        setIsOpen(true);
      }
    };

    const goTo = (path: string) => {
      navigate(path);
      toggleMenu();
    };
  return (<div className="nav-container" ref={menuRef}>
      <button className="menu-button" onClick={toggleMenu}>
        <MenuOutlined style={{ fontSize: 20, color: 'white' }} />
      </button>

      {(isOpen || isClosing) && (
        <div className="nav-dropdown">
          {menuItems.map((item, index) => (
            <button
              key={item.path}
              className={`nav-item ${isClosing ? 'fade-out' : 'fade-in'}`}
              style={{
                animationDelay: isClosing
                  ? `${(menuItems.length - index - 1) * 0.1}s`
                  : `${index * 0.1}s`,
              }}
              onClick={() => goTo(item.path)}
              disabled={isClosing}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavigationMenu;
