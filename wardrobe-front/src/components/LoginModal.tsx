// components/LoginModal.tsx
/* import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      message.success('Welcome!');
      onClose();
      navigate(0); // перезагрузка страницы
    } catch (error) {
      message.error('Error');
    }
  }; */


import React, { useState, useEffect } from 'react';
import './LoginModal.css'; // добавим кастомные стили
/* import { useNavigate } from 'react-router-dom'; */
import axios from 'axios';
/* import { message } from 'antd'; */


interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose, onLoginSuccess }) => {

 /*  const navigate = useNavigate();  */

  const [isMouthOpen, setIsMouthOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  /* const navigate = useNavigate(); */

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMouthOpen(false);
    }, 1200); // через 1.2 секунды рот закрывается
  
    return () => clearTimeout(timeout);
  }, [isMouthOpen]);
  

  const handleInputChange = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setIsMouthOpen(prev => !prev); // 👉 Переключаем состояние
  };

const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:3000/auth/login', {
      email,
      password,
    });

    const { access_token, user } = res.data;

    localStorage.setItem('token', access_token);
    localStorage.setItem('username', user.username);
    localStorage.setItem('avatar', user.avatar || '');

    localStorage.setItem('login_success', 'true');


    onLoginSuccess?.();

  } catch (error) {
    alert('Login failed');
  }
};


  if (!visible) return null;

  const handleOverlayClick = () => {
    onClose(); // Закрыть окно
  };
  
 


  return (
    
   /*  <Modal
      title="Log in"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input.Password placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginTop: 10 }} />
      <Button type="primary" onClick={handleLogin} style={{ marginTop: 10, width: '100%' }}>
        Click here, Darling.
      </Button>
    </Modal> */

    <div className="login-overlay" onClick={handleOverlayClick}>
    <div className="login-container" onClick={(e) => e.stopPropagation()}>
      <div className="header">
        <img src="/headerlogin.svg" alt="cat1" className="cat" />
      </div>

      <label>✨ enter login:</label>
      <input
        type="email"
        value={email}
        /* onChange={(e) => setEmail(e.target.value)} */
        onChange={handleInputChange(setEmail)}
        className="input-field"
      />
      


      <label>✨ password:</label>
        <div className="password-wrapper">
        <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleInputChange(setPassword)}
            className="input-field"
        />
        <span
            className="eye-icon"
            onClick={() => setShowPassword(prev => !prev)}
            style={{ cursor: 'pointer' }}
        >
            {showPassword ? '🙈' : '👁️'}
        </span>
        </div>


      <div className="button-row">
        <button className="back-button" onClick={onClose}>↩</button>
        <a className="create-link" href="/signup">create new account</a>
        <button className="login-button" onClick={handleLogin}>✔</button>
      </div>
      <div className="cat-mouth-wrapper">
        <img src="/котикзакрытыйрот.ico" alt="closed" className={`cat-mouth ${isMouthOpen ? 'hidden' : 'visible'}`} />
        <img src="/котикоткрытыйрот.ico" alt="open" className={`cat-mouth ${isMouthOpen ? 'visible' : 'hidden'}`} />
      </div>



    </div>
    </div>

  );
};

export default LoginModal;
