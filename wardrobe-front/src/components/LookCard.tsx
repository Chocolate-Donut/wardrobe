import React, { useRef, useEffect, useState } from 'react';
import { Card, Tooltip, Button } from 'antd';
import axios from 'axios'; 
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd'; // вверху файла
/* import { useNavigate } from 'react-router-dom'; */



interface LookCardProps {
  look: any;
  isAuthorized?: boolean; // по умолчанию false
  isInitiallyFavorite?: boolean;
  onRemoveFavorite?: (id: number) => void;
  onDelete?: (id: number) => void;
  isSelected?: boolean;
  isSelectMode?: boolean;
  onSelect?: (id: number) => void;
  onEdit?: (id: number) => void;
  
}




const LookCard: React.FC<LookCardProps> = ({ look,isAuthorized = false, isInitiallyFavorite = false, onRemoveFavorite, onDelete,  isSelected = false,
  isSelectMode = false,
  onSelect,
  onEdit}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [overflowIndex, setOverflowIndex] = useState<number | null>(null);

    // ⭐ Сердечко
  const [showHeart, setShowHeart] = useState(false);
  

    const handleLongPress = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 2000);
  };

  //добавить в избр
  const [isFavorite, setIsFavorite] = useState<boolean>(isInitiallyFavorite);
  useEffect(() => {
    setIsFavorite(isInitiallyFavorite); // 🛠 корректно применит при рендере
  }, [isInitiallyFavorite]);

/*   const handleToggleFavorite = async () => {
  const token = localStorage.getItem('token');
  if (!token || isFavorite) return; // 💥 Не добавляем повторно

  try {
    await axios.post(`http://localhost:3000/favorites/${look.id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setIsFavorite(true);
  } catch (err) {
    console.error('❌ Ошибка при добавлении в избранное', err);
  }
};
 */
const handleToggleFavorite = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  // 🗑 УДАЛЕНИЕ
  if (isFavorite && onRemoveFavorite) {
    try {
      await axios.delete(`http://localhost:3000/favorites/${look.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorite(false);
      onRemoveFavorite(look.id); // уведомить родителя
    } catch (err) {
      console.error('❌ Ошибка при удалении из избранного', err);
    }
    return;
  }

  // ➕ ДОБАВЛЕНИЕ
  if (!isFavorite) {
    try {
      await axios.post(`http://localhost:3000/favorites/${look.id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorite(true);
    } catch (err) {
      console.error('❌ Ошибка при добавлении в избранное', err);
    }
  }
};



  const imageUrl = look.imageUrl?.includes('http')
    ? look.imageUrl
    : `http://localhost:3000/uploads/${look.imageUrl.split(/uploads[\\/]/).pop()}`;

  const tags = typeof look.tags === 'string' ? JSON.parse(look.tags) : look.tags;
  const season = look.season?.replace(/"/g, '');
  const trend = look.trend?.replace(/"/g, '');

  useEffect(() => {
  tagRefs.current = []; // ✅ здесь безопасно сбрасывать

  const checkOverflow = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    let totalWidth = 0;

    for (let i = 0; i < tagRefs.current.length; i++) {
      const tag = tagRefs.current[i];
      if (!tag) continue;

      totalWidth += tag.offsetWidth + 5;

      if (totalWidth > containerWidth) {
        setOverflowIndex(i);
        return;
      }
    }

    setOverflowIndex(null);
  };

  checkOverflow();

  const resizeObserver = new ResizeObserver(checkOverflow);
  if (containerRef.current) resizeObserver.observe(containerRef.current);
  window.addEventListener('resize', checkOverflow);

  return () => {
    resizeObserver.disconnect();
    window.removeEventListener('resize', checkOverflow);
  };
}, [tags]);

  

const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
const [showDeleteButton, setShowDeleteButton] = useState(false);

const handleLongPressStart = () => {
    if (!isSelectMode) {
      setPressTimer(setTimeout(() => {
        if (onSelect) {
          onSelect(look.id);
        }
      }, 800)); // 800ms для долгого нажатия
    }
  };

  const handleLongPressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleCardClick = () => {
    if (isSelectMode && onSelect) {
      onSelect(look.id);
    } else {
      setShowDeleteButton(prev => !prev);
    }
  };

  useEffect(() => {
    return () => {
      if (pressTimer) clearTimeout(pressTimer);
    };
  }, [pressTimer]);


/* const navigate = useNavigate(); */

/* const handleEdit = (id: number) => {
  navigate(`/edit-look/${id}`);
}; */



  return (
    <div
    onMouseEnter={() => setShowHeart(true)}
    onMouseLeave={(/* e */) => {
      setShowHeart(false);
      handleLongPressEnd();
    }}
    onTouchStart={handleLongPressStart}
      onTouchEnd={handleLongPressEnd}
      onMouseDown={handleLongPressStart}
      onMouseUp={handleLongPressEnd}
      
    style={{ position: 'relative' , cursor: 'pointer', outline: isSelected ? '3px solid #1890ff' : 'none', transition: 'transform 0.2s',
        transform: isSelected ? 'scale(0.98)' : 'scale(1)'}}
    
    >
    <Card
      /* onClick={() => setShowDeleteButton((prev) => !prev)} */ 
      onClick={handleCardClick}
        onTouchStart={(/* e */) => {
          if (isSelectMode && onSelect) {
            onSelect(look.id);
          } else {
            handleLongPress();
          }
        }}
      hoverable
      className="look-card"
      style={{
      width: '170px',
      height: showDeleteButton ? '340px' : '300px', 
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '20px',
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.21)', // полупрозрачный
      backdropFilter: 'blur(15px)',                 // размытие
      WebkitBackdropFilter: 'blur(15px)',           // для Safari
      border: '1px solid rgba(255, 255, 255, 0.13)', // для стеклянного эффекта
      transition: 'height 0.3s ease',
      }}
      cover={
        <img
          alt={look.title}
          src={imageUrl}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/no-image.png';
          }}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'contain',
            
          }}
        />
      }
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          
        }}
      >
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.005rem', marginTop: '-1.3rem',color: 'white' }}>
            {look.title.replace(/"/g, '')}
          </h3>
          <div style={{ fontSize: '0.7rem', color: 'white', marginBottom: '0.2rem' }}>
            <span style={{ marginRight: 8, }}> {season}</span>
            <span>✨ {trend}</span>
          </div>
        </div>

        <div
          ref={containerRef}
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: '0.3rem',
            overflow: 'hidden',
            position: 'relative',
            maxHeight: '60px',
            paddingBottom: '0.7rem', 
            /* maxWidth: '100%', */ 
          }}
        >

          {
              (() => { tagRefs.current = []; return null })() // 💡 обнуляем здесь
          }

          {tags?.map((tag: string, index: number) => {
            if (overflowIndex !== null && index >= overflowIndex) return null;
            return (
              <span
                key={index}
                ref={(el: HTMLSpanElement | null) => {
                  tagRefs.current[index] = el;
                }}
                
                style={{
                  backgroundColor: '#eee',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '1rem',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                  color: 'black', 
                }}
              >
                {tag.replace(/"/g, '')}
              </span>
            );
          })}

          {overflowIndex !== null && (
            <Tooltip title={tags.slice(overflowIndex).join(', ')}>
              <span
                style={{
                  backgroundColor: '#eee',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '1rem',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ...
              </span>
            </Tooltip>
          )}
        </div>
      </div>

          {onDelete && (
  <div style={{
    height: showDeleteButton ? '100px' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.9s ease',
  }}>
    <Popconfirm
      title="Are you sure you want to delete this look?"
      onConfirm={() => onDelete(look.id)}
      okText="Yes"
      cancelText="No"
    >
      <Button
        danger
        type="primary"
        size="small"
        style={{
          width: '100%',
          marginTop: '0rem',
        }}
      >
        Delete
      </Button>
    </Popconfirm>
            <Button
      type="default"
      size="small"
      style={{ width: '100%',  marginTop: '0.4rem',}}
      onClick={() => onEdit?.(look.id)}

    >
      ✏️ Edit
    </Button>




    
  </div>
)}






{isSelectMode && (
          <div style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: isSelected ? '#1890ff' : '#fff',
            border: '2px solid #1890ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}>
            {isSelected && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
          </div>
        )}

    </Card>
    {/* ❤️ Сердечко при авторизации и наведении/долгом нажатии */}
      {isAuthorized &&  (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '50%',
            padding: '6px',
            cursor: 'pointer',
            opacity: showHeart ? 1 : 0.4, 
          }}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? <HeartFilled style={{ color: '#ff4d4f', fontSize: '20px' }} /> : <HeartOutlined style={{ color: 'white', fontSize: '20px' }} />}
  
        </div>
      )}
    </div>
  );
};

export default LookCard;
