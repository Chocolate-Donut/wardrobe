import React, { useState, useEffect, useRef } from 'react';
import './ConstructorPage.css';
import { Button, Input, Select, Switch, Modal, message } from 'antd';
import axios from 'axios';

import NavigationMenu from '../components/NavigationMenu';

declare global {
  interface Window {
    lastPinchDist?: number | null;
  }
}

const ConstructorPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [season, setSeason] = useState<string | undefined>(undefined); // важно!
  const [trend, setTrend] =useState<string | undefined>(undefined);
  const [isPrivate, setIsPrivate] = useState(false);
  const [wardrobe, setWardrobe] = useState<any[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dpr = window.devicePixelRatio || 1;
  const [layersCollapsed, setLayersCollapsed] = useState(false);
  const layersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {


    axios.get('http://localhost:3000/wardrobe', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => setWardrobe(res.data))
      .catch((err) => console.error('Ошибка при получении гардероба:', err));
  }, []);

  const handleSave = async () => {
  if (!title || items.length === 0) {
    return message.error('Add title and at least one item');
  }

  try {
    /* const response = */ await axios.post('http://localhost:3000/outfits/constructor/json', {
      title,
      tags,
      season,
      trend,
      isPrivate,
      items, // x/y уже сохранены правильно
      canvasWidth: 280,
      canvasHeight: 400,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    message.success('Look saved!');
    setItems([]);
    setTitle('');
    setTags([]);
    setSeason('');
    setTrend('');
    setIsPrivate(false);
  } catch (err) {
    console.error('Ошибка сохранения:', err);
    message.error('Save failed');
  }
};


  useEffect(() => {

    const handleMouseMove = (e: MouseEvent) => {
  if (draggedIndex !== null) {
    const updated = [...items];
    const canvas = document.querySelector('.canvas') as HTMLElement;
    const canvasRect = canvas.getBoundingClientRect();
    
    
    const newX = (e.clientX - offset.x) * dpr;
    const newY = (e.clientY - offset.y) * dpr;



    // Проверка границ с учетом масштаба
    const imgWidth = 100 * (updated[draggedIndex].scale || 1);
    const imgHeight = (100 * (updated[draggedIndex].scale || 1)) * (updated[draggedIndex].aspectRatio || 1);
    
    updated[draggedIndex] = {
      ...updated[draggedIndex],
      x: Math.max(0, Math.min(newX, canvasRect.width - imgWidth)),
      y: Math.max(0, Math.min(newY, canvasRect.height - imgHeight)),
    };
    
    setItems(updated);
  }
};

    const handleTouchMove = (e: TouchEvent) => {
      if (draggedIndex === null) return;
      const updated = [...items];
      
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const canvas = document.querySelector('.canvas') as HTMLElement;
        const canvasRect = canvas.getBoundingClientRect();
        
        
        const newX = (touch.clientX - offset.x) * dpr;
        const newY = (touch.clientY - offset.y) * dpr;



        // Проверка границ canvas
        const imgWidth = 100 * (updated[draggedIndex].scale || 1);
        const imgHeight = (100 * (updated[draggedIndex].scale || 1)) * (updated[draggedIndex].aspectRatio || 1);
        
        updated[draggedIndex] = {
          ...updated[draggedIndex],
          x: Math.max(0, Math.min(newX, canvasRect.width - imgWidth)),
          y: Math.max(0, Math.min(newY, canvasRect.height - imgHeight)),
        };
        
        setItems(updated);
      }
    };

    const handleEnd = () => {
      setDraggedIndex(null);
      window.lastPinchDist = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [draggedIndex, offset, items]);



  //рандом
  useEffect(() => {
  const saved = localStorage.getItem('generatedLookItems');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const enriched = parsed.map((item: any, index: number) => ({
          ...item,
          x: item.x ?? 50 + index * 30,
          y: item.y ?? 50 + index * 40,
          scale: item.scale ?? 1,
          aspectRatio: item.aspectRatio ?? 1,
        }));
        setItems(enriched);
        localStorage.removeItem('generatedLookItems');
      }
    } catch (err) {
      console.error('Failed to parse generated look items:', err);
    }
  }
}, []);





  return (
    <div className="constructor-container">
      <NavigationMenu />
      <div className="constructor-sidebar">
      <div className="bottom-panel">
        <Button className="btn-add" onClick={() => setShowWardrobeModal(true)}>Add Clothing</Button>

        <Input className="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input className="tags" placeholder="Tags (comma separated)" onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))} />

        
        <Select placeholder="Season" value={season} onChange={setSeason} options={[
          { value: 'spring', label: 'Spring' },
          { value: 'summer', label: 'Summer' },
          { value: 'autumn', label: 'Autumn' },
          { value: 'winter', label: 'Winter' },
        ]} />
        
        <Select placeholder="Trend" value={trend} onChange={setTrend} options={[
          { value: 'casual', label: 'Casual' },
          { value: 'glamor', label: 'Glamor' },
          { value: 'classic', label: 'Classic' },
        ]} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Private:</span>
          <Switch checked={isPrivate} onChange={setIsPrivate} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Button className="btn-cancel"  onClick={() => setItems([])}>Cancel</Button>
          <Button type="default" onClick={handleSave} style={{ marginLeft: '1rem' }} className='btn-save'>Save Look</Button>
        </div>
      </div>



      </div>






      


      <div className="canvas">
        {items.map((item, index) => {
          const src = `http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`;
          return (
            <img
              key={index}
              src={src}
              alt="item"
              className="canvas-item"
             
              style={{
                top: item.y,
                left: item.x,
                position: 'absolute',
                cursor: 'move',
                zIndex: index,
                touchAction: 'none',
                transform: `scale(${item.scale || 1})`,
                transformOrigin: 'top left',
              }}
              onWheel={(e) => {
                if (!e.shiftKey) return;
                e.preventDefault();
                const updated = [...items];
                const newScale = Math.max(
                    0.3,
                    Math.min((item.scale || 1) + (e.deltaY < 0 ? -0.1 : 0.1), 3)
                );
                updated[index] = { ...item, scale: newScale };
                setItems(updated);
                }}
              onMouseDown={(e) => {
                setDraggedIndex(index);
                setOffset({
                  x: e.clientX - item.x / dpr,
                  y: e.clientY - item.y / dpr
                });

              }}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                setDraggedIndex(index);
                setOffset({
                  x: touch.clientX - item.x / dpr,
                  y: touch.clientY - item.y / dpr
                });

              }}
            />
          );
        })}
      </div>


      <div className={`layers-panel ${layersCollapsed ? 'collapsed' : ''}`}>
        <h3 className="layers-header" onClick={() => setLayersCollapsed(!layersCollapsed)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Layers  
        <img src="/icons8-на-задний-план-100.png" className="layers-icon-img" alt="toggle"
        style={{ transform: layersCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}/></h3> 
        <div
        ref={layersRef}
        className={`layers-content ${layersCollapsed ? 'collapsed' : 'expanded'}`}
        >
        {items.map((item, index) => (
            <div key={index} className="layer-item">
              <span>{item.type}</span>
              <Button size="small" onClick={() => {
                const updated = [...items];
                updated.splice(index, 1);
                setItems(updated);
              }}>🗑</Button>
              <Button size="small" disabled={index === 0} onClick={() => {
                const updated = [...items];
                [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                setItems(updated);
              }}>🔼</Button>
              <Button size="small" disabled={index === items.length - 1} onClick={() => {
                const updated = [...items];
                [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                setItems(updated);
              }}>🔽</Button>
            </div>
          ))}
        </div>


      </div>

      









      <Modal
  open={showWardrobeModal}
  onCancel={() => setShowWardrobeModal(false)}
  footer={null}
  title="Choose clothing"
  width={600}
>
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    maxHeight: '400px',
    overflowY: 'auto',
    justifyContent: 'center'
  }}>
    {wardrobe.map((item) => {
      const src = `http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`;
      return (
        <div
          key={item.id}
          onClick={() => {
  const newItem = {
    ...item,
    x: 50 + items.length * 20,
    y: 50 + items.length * 20,
    scale: 1,
    aspectRatio: 1
  };
  setItems((prev) => [...prev, newItem]);
  setShowWardrobeModal(false);
}}
          style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '5px',
            cursor: 'pointer',
            width: '100px',
            textAlign: 'center',
          }}
        >
          <img
            src={src}
            alt={item.type}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />
          <div style={{ fontSize: '12px', marginTop: '4px' }}>{item.type}</div>
        </div>
      );
    })}
  </div>
</Modal>
    </div>
  );
};

export default ConstructorPage;

/* 
import React, { useState, useEffect } from 'react';
import './ConstructorPage.css';
import { Button, Input, Select, Switch, Modal, message } from 'antd';
import axios from 'axios';

declare global {
  interface Window {
    lastPinchDist?: number | null;
  }
}

const ConstructorPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [season, setSeason] = useState('');
  const [trend, setTrend] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [wardrobe, setWardrobe] = useState<any[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dpr = window.devicePixelRatio || 1;

  useEffect(() => {


    axios.get('http://localhost:3000/wardrobe', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => setWardrobe(res.data))
      .catch((err) => console.error('Ошибка при получении гардероба:', err));
  }, []);

  const handleSave = async () => {
  if (!title || items.length === 0) {
    return message.error('Add title and at least one item');
  }

  try {
    const response = await axios.post('http://localhost:3000/outfits/constructor/json', {
      title,
      tags,
      season,
      trend,
      isPrivate,
      items, // x/y уже сохранены правильно
      canvasWidth: 400,
      canvasHeight: 500,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    message.success('Look saved!');
    setItems([]);
    setTitle('');
    setTags([]);
    setSeason('');
    setTrend('');
    setIsPrivate(false);
  } catch (err) {
    console.error('Ошибка сохранения:', err);
    message.error('Save failed');
  }
};


  useEffect(() => {

    const handleMouseMove = (e: MouseEvent) => {
  if (draggedIndex !== null) {
    const updated = [...items];
    const canvas = document.querySelector('.canvas') as HTMLElement;
    const canvasRect = canvas.getBoundingClientRect();
    
    
    const newX = (e.clientX - offset.x) * dpr;
    const newY = (e.clientY - offset.y) * dpr;



    // Проверка границ с учетом масштаба
    const imgWidth = 100 * (updated[draggedIndex].scale || 1);
    const imgHeight = (100 * (updated[draggedIndex].scale || 1)) * (updated[draggedIndex].aspectRatio || 1);
    
    updated[draggedIndex] = {
      ...updated[draggedIndex],
      x: Math.max(0, Math.min(newX, canvasRect.width - imgWidth)),
      y: Math.max(0, Math.min(newY, canvasRect.height - imgHeight)),
    };
    
    setItems(updated);
  }
};

    const handleTouchMove = (e: TouchEvent) => {
      if (draggedIndex === null) return;
      const updated = [...items];
      
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const canvas = document.querySelector('.canvas') as HTMLElement;
        const canvasRect = canvas.getBoundingClientRect();
        
        
        const newX = (touch.clientX - offset.x) * dpr;
        const newY = (touch.clientY - offset.y) * dpr;



        // Проверка границ canvas
        const imgWidth = 100 * (updated[draggedIndex].scale || 1);
        const imgHeight = (100 * (updated[draggedIndex].scale || 1)) * (updated[draggedIndex].aspectRatio || 1);
        
        updated[draggedIndex] = {
          ...updated[draggedIndex],
          x: Math.max(0, Math.min(newX, canvasRect.width - imgWidth)),
          y: Math.max(0, Math.min(newY, canvasRect.height - imgHeight)),
        };
        
        setItems(updated);
      }
    };

    const handleEnd = () => {
      setDraggedIndex(null);
      window.lastPinchDist = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [draggedIndex, offset, items]);



  //рандом
  useEffect(() => {
  const saved = localStorage.getItem('generatedLookItems');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const enriched = parsed.map((item: any, index: number) => ({
          ...item,
          x: item.x ?? 50 + index * 30,
          y: item.y ?? 50 + index * 40,
          scale: item.scale ?? 1,
          aspectRatio: item.aspectRatio ?? 1,
        }));
        setItems(enriched);
        localStorage.removeItem('generatedLookItems');
      }
    } catch (err) {
      console.error('Failed to parse generated look items:', err);
    }
  }
}, []);

  return (
    <div className="constructor-wrapper">
      <div className="constructor-sidebar">
        <div className="bottom-panel">
          <Button onClick={() => setShowWardrobeModal(true)}>➕ Add Clothing</Button>
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Tags (comma separated)" onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))} />
          <Select placeholder="Season" value={season} onChange={setSeason} options={[
            { value: 'spring', label: 'Spring' },
            { value: 'summer', label: 'Summer' },
            { value: 'autumn', label: 'Autumn' },
            { value: 'winter', label: 'Winter' },
          ]} />
          <Select placeholder="Trend" value={trend} onChange={setTrend} options={[
            { value: 'casual', label: 'Casual' },
            { value: 'glamor', label: 'Glamor' },
            { value: 'classic', label: 'Classic' },
          ]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Private:</span>
            <Switch checked={isPrivate} onChange={setIsPrivate} />
          </div>
          <div className="action-buttons">
            <Button danger onClick={() => setItems([])}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save Look</Button>
          </div>
        </div>

        <div className="layers-panel">
          <h3>Layers</h3>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>{item.type}</span>
              <Button size="small" onClick={() => {
                const updated = [...items];
                updated.splice(index, 1);
                setItems(updated);
              }}>🗑</Button>
              <Button size="small" disabled={index === 0} onClick={() => {
                const updated = [...items];
                [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                setItems(updated);
              }}>🔼</Button>
              <Button size="small" disabled={index === items.length - 1} onClick={() => {
                const updated = [...items];
                [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                setItems(updated);
              }}>🔽</Button>
            </div>
          ))}
        </div>
      </div>

      <div className="constructor-canvas">
        <div className="canvas">
          {items.map((item, index) => {
            const src = `http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`;
            return (
              <img
              key={index}
              src={src}
              alt="item"
              className="canvas-item"
             
              style={{
                top: item.y,
                left: item.x,
                position: 'absolute',
                cursor: 'move',
                zIndex: index,
                touchAction: 'none',
                transform: `scale(${item.scale || 1})`,
                transformOrigin: 'top left',
              }}
              onWheel={(e) => {
                if (!e.shiftKey) return;
                e.preventDefault();
                const updated = [...items];
                const newScale = Math.max(
                    0.3,
                    Math.min((item.scale || 1) + (e.deltaY < 0 ? -0.1 : 0.1), 3)
                );
                updated[index] = { ...item, scale: newScale };
                setItems(updated);
                }}
              onMouseDown={(e) => {
                setDraggedIndex(index);
                setOffset({
                  x: e.clientX - item.x / dpr,
                  y: e.clientY - item.y / dpr
                });

              }}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                setDraggedIndex(index);
                setOffset({
                  x: touch.clientX - item.x / dpr,
                  y: touch.clientY - item.y / dpr
                });

              }}
            />
            );
          })}
        </div>
      </div>

      <Modal
  open={showWardrobeModal}
  onCancel={() => setShowWardrobeModal(false)}
  footer={null}
  title="Choose clothing"
  width={600}
>
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    maxHeight: '400px',
    overflowY: 'auto',
    justifyContent: 'center'
  }}>
          {wardrobe.map((item) => {
      const src = `http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`;
      return (
        <div
          key={item.id}
          onClick={() => {
  const newItem = {
    ...item,
    x: 50 + items.length * 20,
    y: 50 + items.length * 20,
    scale: 1,
    aspectRatio: 1
  };
  setItems((prev) => [...prev, newItem]);
  setShowWardrobeModal(false);
}}
          style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '5px',
            cursor: 'pointer',
            width: '100px',
            textAlign: 'center',
          }}
        >
          <img
            src={src}
            alt={item.type}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />
          <div style={{ fontSize: '12px', marginTop: '4px' }}>{item.type}</div>
        </div>
      );
    })}
        </div>
      </Modal>
    </div>
  );
};

export default ConstructorPage;
 */