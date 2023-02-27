import React, { useState, useEffect } from 'react';
import { ConfigProvider as DesignProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NavigationMenu from './components/NavigationMenu';
import FilesPage from './pages/FilesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NoPage from './pages/NoPage';
import OfflinePage from './pages/OfflinePage';
import PrivacyPage from './pages/PrivacyPage';
import FooterMenu from './components/FooterMenu';

import './App.css';

function App() {
  const defaultTheme = {
    token: {
      // fontFamily: "'Roboto', sans-serif",
      colorPrimary: '#158bdc',
      colorSplit: '#d9d9d9',
      colorInfo: '#158bdc',
    },
  };

  const [online, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    window.addEventListener('online', () => {
      setOnline(true);
    });
    window.addEventListener('offline', () => {
      setOnline(false);
    });
  }, []);

  return (
    <DesignProvider theme={defaultTheme}>
      {online
        ? (
          <BrowserRouter>
            <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
              <div style={{ flexGrow: 1 }}>
                <NavigationMenu />
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route path="files" element={<FilesPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="*" element={<NoPage />} />
                </Routes>
              </div>
              <FooterMenu />
            </div>
          </BrowserRouter>
        )
        : <OfflinePage />}
    </DesignProvider>
  );
}

export default App;
