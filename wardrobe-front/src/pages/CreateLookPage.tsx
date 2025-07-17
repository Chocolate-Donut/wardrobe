/* import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const CreateLookPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [season, setSeason] = useState('');
  const [trend, setTrend] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!title || !season || !trend || !image) {
      message.error('Заполните все поля и выберите изображение');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('tags', JSON.stringify(tags));
    formData.append('season', season);
    formData.append('trend', trend);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:3000/outfits/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success('Образ успешно создан!');
    } catch (err) {
      console.error(err);
      message.error('Ошибка при создании образа');
    }
  };

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2>Создать образ</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название" />
      <input value={season} onChange={(e) => setSeason(e.target.value)} placeholder="Сезон (summer, autumn...)" />
      <input value={trend} onChange={(e) => setTrend(e.target.value)} placeholder="Тренд (casual, glamor...)" />
      <input
        placeholder="Теги через запятую"
        onChange={(e) => setTags(e.target.value.split(',').map((tag) => tag.trim()))}
      />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button onClick={handleSubmit}>Создать</button>
    </div>
  );
};

export default CreateLookPage;
 */

import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateLookPage.css';
import LookUploadModal from '../components/LookUploadModal';

import RandomLookModal from '../components/RandomLookModal';
import NavigationMenu from '../components/NavigationMenu';


const CreateLookPage: React.FC = () => {
  const navigate = useNavigate();



  const [showModal, setShowModal] = useState(false);
  const [showRandomModal, setShowRandomModal] = useState(false);

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      backgroundImage: 'url(/bg_create.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundBlendMode: 'darken',
      color: 'white',
    }}>
      <NavigationMenu />

      <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', color:'white' }}>
        Create a Look <img src="/icons8-раздевалка-100.png" alt="icon" style={{ width: 45, verticalAlign: 'middle' }} />
      </h1>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '40px',
        flexWrap: 'wrap'
      }}>
        {/* Блок 1: Фото образа */}
        <div className="option-block" onClick={() => setShowModal(true)}>
            
          <div className="option-icon">
            <img src="/icons8-картина-100.png" alt="Фото" className="option-icon-img" />
          </div>
          <h2 className="option-title">From a photo</h2>
          <p className="option-desc">
             Upload a ready-made outfit photo — we’ll remove the background and extract the colors
          </p>
        </div>

        {/* Блок 2: Собрать из гардероба */}
        <div className="option-block" onClick={() => navigate('/constructor')}>
          <div className="option-icon">
            <img src="/icons8-угол-строительный-100.png" alt="Конструктор" className="option-icon-img" />
          </div>
          <h2 className="option-title">Build from wardrobe</h2>
          <p className="option-desc">
            Manually select items and arrange them on canvas as you wish
          </p>
        </div>

        {/* Блок 3: Случайный образ */}
        <div className="option-block" onClick={() => setShowRandomModal(true)}>

          

          <div className="option-icon">
            <img src="/icons8-головоломка-100.png" alt="Рандом" className="option-icon-img" />
          </div>
          <h2 className="option-title">Random look</h2>
          <p className="option-desc">
            Automatically create a look from your wardrobe items — pure or color-aware random
          </p>
        </div>
      </div>
      <LookUploadModal visible={showModal} onClose={() => setShowModal(false)} />
      <RandomLookModal
            visible={showRandomModal}
            onClose={() => {
              console.log('Closing modal'); // Добавьте для отладки
              setShowRandomModal(false);
            }}
            onApply={(items) => {
              localStorage.setItem('generatedLookItems', JSON.stringify(items));
              navigate('/constructor');
            }}
          />



    </div>
  );
};

export default CreateLookPage;

