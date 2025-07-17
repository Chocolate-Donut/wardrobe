// src/components/EditClothingModal.tsx
import React, { useState, useEffect } from 'react';
import './UploadClothingModal.css';
import axios from 'axios';

interface EditClothingModalProps {
  visible: boolean;
  item: WardrobeItem | null;
  onClose: () => void;
  onSave: (updatedItem: WardrobeItem) => void;
}
interface WardrobeItem {
  id: number;
  imageUrl: string;
  colors: string[];
  type: string;
  tags: string[];
  season?: string;
  brand?: string;
}




const EditClothingModal: React.FC<EditClothingModalProps> = ({ visible, onClose, item, onSave }) => {
  const [type, setType] = useState('');
  const [tags, setTags] = useState('');
  const [season, setSeason] = useState('');
  const [brand, setBrand] = useState('');

  useEffect(() => {
    if (visible && item) {
      setType(item.type || '');
      setTags((item.tags || []).join(', '));
      setSeason(item.season || '');
      setBrand(item.brand || '');
    }
  }, [visible, item]);

  if (!visible) return null;

  const handleSave = async () => {
  if (!item) return;

  const dto = {
    type,
    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    season,
    brand,
  };

  try {
    await axios.put(`http://localhost:3000/wardrobe/${item.id}/type`, dto, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    alert('✅ Успешно обновлено!');
    onSave({
      ...item,
      ...dto
    });
    onClose();
  } catch (err) {
    console.error('Ошибка при обновлении:', err);
  }
};


  if (!visible || !item) return null;


  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal">
        <h2>Редактировать вещь</h2>

        <div className="preview-section">
          <img src={`http://localhost:3000/${item.imageUrl}`} alt="Текущее изображение" />
        </div>

        <input type="text" placeholder="Тип одежды" value={type} onChange={(e) => setType(e.target.value)} />
        <input type="text" placeholder="Теги (через запятую)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <input type="text" placeholder="Сезон" value={season} onChange={(e) => setSeason(e.target.value)} />
        <input type="text" placeholder="Бренд" value={brand} onChange={(e) => setBrand(e.target.value)} />

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Отменить</button>
          <button className="confirm-btn" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default EditClothingModal;
