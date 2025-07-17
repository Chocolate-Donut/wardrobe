import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignupPage.css';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // 👉 состояние после регистрации
  const [verificationCode, setVerificationCode] = useState(''); // код подтверждения

  const navigate = useNavigate();

  const handleInputChange = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setIsMouthOpen(true);
  };

  useEffect(() => {
    if (isMouthOpen) {
      const timeout = setTimeout(() => setIsMouthOpen(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [isMouthOpen]);

  // 👉 регистрация
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:3000/users/register', {
        email,
        username,
        password,
      });
      alert('Check your email for the verification code!');
      setIsRegistered(true); // переключаем интерфейс
    } catch (error) {
      alert('Registration failed');
      console.error(error);
    }
  };

  // 👉 подтверждение кода
  const handleVerifyCode = async () => {
    try {
      await axios.post('http://localhost:3000/users/verify', {
        email,
        code: verificationCode,
      });
      alert('Account verified successfully!');
      navigate('/'); // переход на главную
    } catch (error) {
      alert('Verification failed');
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <div className="cat-header">
        <img
          src="/котикзакрытыйрот.ico"
          alt="closed mouth"
          className={`upside-down-cat ${isMouthOpen ? 'hidden' : 'visible'}`}
        />
        <img
          src="/котикоткрытыйрот.ico"
          alt="open mouth"
          className={`upside-down-cat ${isMouthOpen ? 'visible' : 'hidden'}`}
        />
      </div>

      {!isRegistered ? (
        <>
          <h2>Create Account ✨</h2>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleInputChange(setEmail)}
            className="input-field"
          />

          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={handleInputChange(setUsername)}
            className="input-field"
          />

          <label>Password:</label>
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

          <label>Confirm Password:</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleInputChange(setConfirmPassword)}
              className="input-field"
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              style={{ cursor: 'pointer' }}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <button onClick={handleSignup} className="signup-button">
            Sign Up
          </button>
        </>
      ) : (
        <>
          <h2>Enter Verification Code</h2>
          <label>Code:</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="input-field"
          />
          <button onClick={handleVerifyCode} className="signup-button">
            Verify Account
          </button>
        </>
      )}
    </div>
  );
};

export default SignupPage;
