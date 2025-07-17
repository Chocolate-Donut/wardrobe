// src/AppRoutes.tsx
//import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
//import LoginModal from './components/LoginModal';
import SignupPage from './pages/SignupPage';

const AppRoutes = () => {
  //const token = localStorage.getItem('token');
  //const isAuthenticated = !!token;

  return (
    <Routes>
      <Route path="/*" element={<App />} />
      
      <Route path="/signup" element={<SignupPage />} /> 
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
