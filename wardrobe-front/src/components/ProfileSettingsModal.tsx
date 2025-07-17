import React, { useEffect, useState } from 'react';
import './ProfileSettingsModal.css';
import axios from 'axios';
import { message } from 'antd';

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface Profile {
  username: string;
  email: string;
  city: string;
  avatar: string;
  isPrivate: boolean;
}

const ProfileSettingsModal: React.FC<Props> = ({ visible, onClose }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editedUsername, setEditedUsername] = useState('');


  useEffect(() => {
    if (visible) {
      axios.get('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res =>{ setProfile(res.data);
      setEditedUsername(res.data.username);})
        .catch(err => {
          console.error('Ошибка получения профиля:', err);
          message.error('Не удалось загрузить профиль');
        });
    }
  }, [visible]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const res = await axios.post('http://localhost:3000/profile/upload-avatar', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      message.success('Аватар обновлён');
      setProfile(prev => prev ? { ...prev, avatar: res.data.filePath } : null);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      message.error('Не удалось обновить аватар');
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Настройки профиля</h2>
        {profile && (
          <>
            <img
              src={`http://localhost:3000${profile.avatar}`}
              alt="avatar"
              style={{ width: '100px', borderRadius: '50%', marginBottom: '1rem' }}
              onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
            />
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Имя:</strong>
              <input
                type="text"
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
                style={{
                  marginLeft: '0.5rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '5px',
                  color: 'white',
                  padding: '2px 8px'
                }}
              />
            </p>

            <button className="glass-button" onClick={async () => {
                try {
                  await axios.patch('http://localhost:3000/profile', { username: editedUsername }, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                  });
                  message.success('Имя обновлено');
                  setProfile(prev => prev ? { ...prev, username: editedUsername } : null);
                } catch (err) {
                  console.error('Ошибка обновления имени:', err);
                  message.error('Не удалось обновить имя');
                }
              }}>
                save new username
              </button>


            <p><strong>Email:</strong> {profile.email}</p>

            <input type="file" onChange={handleFileChange} />
            <button className="glass-button" onClick={handleUpload}>Загрузить аватар</button>
            <button className="glass-button logout" onClick={onClose}>Закрыть</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingsModal;
