// src/components/UploadClothingModal.tsx
import React, { useState, useEffect } from 'react';
import './UploadClothingModal.css';
import axios from 'axios'

interface Props {
  visible: boolean;
  onClose: () => void;
}

const UploadClothingModal: React.FC<Props> = ({ visible, onClose }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [detectedType, setDetectedType] = useState('');
    const [colors, setColors] = useState<string[]>([]);
    const [season, setSeason] = useState('');
    const [brand, setBrand] = useState('');
    const [tags, setTags] = useState('');




const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (!selected) return;

  setFile(selected);
  setImagePreview(URL.createObjectURL(selected));
  setLoading(true);

  const formData = new FormData();
  formData.append('file', selected);

  try {
    const res = await axios.post('http://localhost:3000/wardrobe/process', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    setProcessedUrl(`http://localhost:3000/${res.data.imageUrl}`);
    setDetectedType(res.data.type || '');
    setColors(res.data.colors || []);
  } catch (err) {
    console.error('Ошибка при обработке изображения:', err);
  } finally {
    setLoading(false);
  }
};





  const handleAdd = async () => {
  if (!file || !processedUrl) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', detectedType);
  formData.append('season', season);
  formData.append('brand', brand);

  tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
    .forEach(tag => formData.append('tags[]', tag)); // ✅ Массив

  colors.forEach(color => formData.append('colors[]', color)); // ✅ Массив

  try {
    await axios.post('http://localhost:3000/wardrobe/upload', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('✅ Успешно добавлено!');
    onClose();
  } catch (err) {
    console.error('Ошибка при добавлении вещи:', err);
  }
};




    
  // Общая функция сброса полей
  const clearState = () => {
    setFile(null);
    setImagePreview(null);
    setProcessedUrl(null);
    setLoading(false);
    setDetectedType('');
    setColors([]);
    setSeason('');
    setBrand('');
    setTags('');
  };

  // При каждом закрытии модалки сбрасываем форму
  useEffect(() => {
    if (!visible) clearState();
  }, [visible]);

    if (!visible) return null;

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal">
        <h2>Загрузка одежды</h2>

        {loading ? (
            <div className="spinner-wrapper">
                <div className="spinner" />
                <p style={{color:'white'}}>Обработка изображения...</p>
            </div>
            ) : !imagePreview ?  (
            <div className="upload-section">
                {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                />
                <p style={{color:'white'}}>Или сделай фото прямо сейчас 📷</p>
            </div>
            ) : (
            <div>
                {processedUrl && (
    <>
        <div className="preview-section">
        <img src={processedUrl} alt="Обработано" />
        </div>

        <div className="color-strip">
        {colors.map((c, i) => (
            <span key={i} className="color-circle" style={{ backgroundColor: c }} />
        ))}
        </div>

        <input type="text" placeholder="Тип одежды" value={detectedType} onChange={(e) => setDetectedType(e.target.value)} />
        <input type="text" placeholder="Теги (через запятую)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <input type="text" placeholder="Сезон" value={season} onChange={(e) => setSeason(e.target.value)} />
        <input type="text" placeholder="Бренд" value={brand} onChange={(e) => setBrand(e.target.value)} />
    </>
    )}

            </div>
            )}

            <div className="modal-buttons">
            <button className="cancel-btn" onClick={() => {
                clearState();
                onClose();
                }}>Отменить
            </button>

            <button className="confirm-btn" onClick={handleAdd}>Добавить</button>
            </div>
        </div>
        </div>
  );
};

export default UploadClothingModal;
