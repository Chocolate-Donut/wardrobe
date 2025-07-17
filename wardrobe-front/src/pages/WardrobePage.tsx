import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WardrobePage.css';
import { useMemo } from 'react';


import NavigationMenu from '../components/NavigationMenu';
import UploadClothingModal from '../components/UploadClothingModal';
import FloatingActionButton from '../components/FloatingActionButton';
import EditClothingModal from '../components/EditClothingModal';

interface WardrobeItem {
  id: number;
  imageUrl: string;
  colors: string[];
  type: string;
  tags: string[];
  season?: string;
  brand?: string;
}
/* 
interface EditClothingModalProps {
  visible: boolean;
  item: WardrobeItem;
  onClose: () => void;
  onSave: (updatedItem: WardrobeItem) => void;
} */




function hexToHsl(hex: string): number {
  let r = 0, g = 0, b = 0;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const d = max - min;

  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }




  return h;
}


const WardrobePage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  /* const [filtered, setFiltered] = useState<any[]>([]); */
  const [colors, setColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  



 /*  const [activeCategory, setActiveCategory] = useState('all'); */

  type CategoryKey = 'all' | 'tops' | 'fullbody' | 'outwear' | 'footwear' | 'accessories'| 'bottom';

const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');


  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Tops', value: 'tops' },
    { label: 'Full Body', value: 'fullbody' },
    { label: 'Outwear', value: 'outwear' },
    { label: 'Footwear', value: 'footwear' },
    { label: 'Accessories', value: 'accessories' },
    {label: 'Bottom', value: 'bottom'}
  ];
/* 
  const categoryMatch = {
    tops: ['t-shirt', 'tank', 'shirt', 'blouse', 'longsleeve', 'top'],
    fullbody: ['dress', 'jumpsuit', 'sundress'],
    outwear: ['coat', 'jacket', 'trench', 'hoodie', 'windbreaker'],
    footwear: ['shoes', 'boots', 'sneakers', 'heels', 'sandals', 'footwear'],
    accessories: ['glasses', 'bag', 'accessory', 'bracelet', 'necklace', 'earrings'],
  }; */

  const categoryMatch: Record<Exclude<CategoryKey, 'all'>, string[]> = {
  tops: ['t-shirt', 'tank', 'shirt', 'blouse', 'longsleeve', 'top'],
  fullbody: ['dress', 'jumpsuit', 'sundress'],
  outwear: ['outwear','coat', 'jacket', 'trench', 'hoodie', 'windbreaker'],
  footwear: ['shoes', 'boots', 'sneakers', 'heels', 'sandals', 'footwear'],
  accessories: ['accessories', 'glasses', 'bag', 'accessory', 'bracelet', 'necklace', 'earrings'],
  bottom:['bottom', 'jeans', 'pants', 'shorts', 'trousers', 'tracksuit bottom', ' leggings' ]
};

  // Загружаем список цветов (уникальные из гардероба)
  useEffect(() => {
    axios.get('http://localhost:3000/wardrobe/colors', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setColors(res.data);
      })
      .catch(err => {
        console.error('Error fetching colors:', err);
      });
  }, []);

  // Загружаем всё в items (без фильтрации)
useEffect(() => {
  axios.get('http://localhost:3000/wardrobe', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
    .then(res => {
      setItems(res.data);
    })
    .catch(err => {
      console.error('Wardrobe fetch error:', err);
    });
}, []);

// Комбинированная фильтрация по цвету, категории и поиску
const filteredItems = useMemo(() => {
  return items.filter(item => {
    // Фильтрация по категории
    const categoryMatchResult =
      activeCategory === 'all' ? true :
      categoryMatch[activeCategory].some(cat =>
        item.type?.toLowerCase().includes(cat)
      );

    // Фильтрация по цвету
    const colorMatchResult =
      !selectedColor || item.colors?.includes(selectedColor);

    // Фильтрация по поиску (тип + теги)
    const search = searchQuery.trim().toLowerCase();
    const searchMatchResult = !search || (
      item.type?.toLowerCase().includes(search) ||
      (Array.isArray(item.tags) && item.tags.some((tag: string) => tag.toLowerCase().includes(search)))
    );

    return categoryMatchResult && colorMatchResult && searchMatchResult;
  });
}, [items, activeCategory, selectedColor, searchQuery]);



const handleCategoryClick = (category: string) => {
  setActiveCategory(category as CategoryKey);
};


  const handleColorClick = (color: string) => {
    setSelectedColor(prev => prev === color ? null : color);
  };

  
const sortedColors = useMemo(() => {
  return [...colors].sort((a, b) => hexToHsl(a) - hexToHsl(b));
}, [colors]);


// Поиск по тегам/типам делаем локально, так как API фильтрует по тегам строго
/*   const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const lowerQuery = searchQuery.toLowerCase();

    return items.filter(item => {
      const typeMatch = item.type?.toLowerCase().includes(lowerQuery);
      const tagsMatch = Array.isArray(item.tags) && item.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery));
      return typeMatch || tagsMatch;
    });
  }, [items, searchQuery]); */


  //загрузка одежды
  const [isModalOpen, setModalOpen] = useState(false);

  //удаление
  const handleDelete = async (id: number) => {
  const confirmed = window.confirm('Вы уверены, что хотите удалить эту вещь?');
  if (!confirmed) return;

  try {
    await axios.delete(`http://localhost:3000/wardrobe/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    setItems(prev => prev.filter(item => item.id !== id));
    alert('❌ Вещь удалена');
  } catch (err) {
    console.error('Ошибка при удалении:', err);
    alert('Ошибка при удалении вещи');
  }
};



  return (
    <div style={{}}>
    <div className="wardrobe-container">
      <h1 style={{ color: 'white' }}>My Wardrobe</h1>
         <NavigationMenu />

      <div className="category-buttons">
        {categories.map(c => (
          <button
            key={c.value}
            className={activeCategory === c.value ? 'active' : ''}
            onClick={() => handleCategoryClick(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>
        <div className="filter-row">
            <div className="color-filter">
                {sortedColors.map(color => (
                <div
                    key={color}
                    className={`color-circle ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                />
                ))}
            </div>
            <div className="search-container">
                <input 
                type="text"
                placeholder="Search by tags or types..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}/>
            </div>
      </div>

        <div className="wardrobe-grid">
        {filteredItems.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center' }}>No items found.</p>
        ) : (
            filteredItems.map(item => (
            <div className="wardrobe-item" key={item.id}>
                <img src={`http://localhost:3000/${item.imageUrl}`} alt={item.type} />
                 <button
                  className="edit-btn"
                  onClick={() => setEditingItem(item)}
                >
                  <img src="/icons8-шариковая-ручка-100.png" alt="trash" style={{width:'25px', height:'25px'}}/>
                  
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  <img src="/icons8-мусор-100.png" alt="trash" style={{width:'25px', height:'25px'}}/>
                </button>
            </div>
            ))
        )}
        </div>
          <EditClothingModal
            visible={!!editingItem}
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={(updatedItem: WardrobeItem) => {
              setItems(prev =>
                prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
              );
              setEditingItem(null);
            }}
          />

          <UploadClothingModal visible={isModalOpen} onClose={() => setModalOpen(false)} />
          <FloatingActionButton onClick={() => setModalOpen(true)} />
    </div>
    </div>
  );
};

export default WardrobePage;
