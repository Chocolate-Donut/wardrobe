/* import { StrictMode, } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './AppRoutes';
import 'antd/dist/reset.css'; // 👈 стили Ant Design
import { BrowserRouter } from 'react-router-dom'; // 👈 добавь
 */


/* // Регистрация сервис-воркера
if ('serviceWorker' in navigator) {
  useEffect(() => {
    navigator.serviceWorker
      .register('/service-worker.js')  // Путь к сервис-воркеру
      .then((registration) => {
        console.log('Service Worker тіркелді:', registration);
      })
      .catch((error) => {
        console.log('Service Worker тіркеу кезінде қате:', error);
      });
  }, []);
} */

/* 
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('❌ Ошибка при регистрации Service Worker:', error);
      });
  });
} */


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRoutes from './AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';

/* import { registerSW } from 'virtual:pwa-register';


registerSW({ immediate: true }) */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <AppRoutes />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
