import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import CookieConsent from './components/CookieConsent';
import NavigationMenu from './components/NavigationMenu';
import FilesPage from './pages/FilesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NoPage from './pages/NoPage';
import OfflinePage from './pages/OfflinePage';
import PrivacyPage from './pages/PrivacyPage';
import FooterMenu from './components/FooterMenu';
import SupportPage from './pages/SupportPage';
import DesignProvider from './components/DesignProvider';
import DownloadPage from './pages/DownloadPage';
import DonatePage from './pages/DonatePage';

import './App.css';

function App() {
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
    <DesignProvider>
      {online
        ? (
          <BrowserRouter>
            <div style={{
              display: 'flex',
              minHeight: '100vh',
              flexDirection: 'column',
            }}
            >
              <div style={{ flexGrow: 1 }}>
                <NavigationMenu />
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route path="files" element={<FilesPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="support" element={<SupportPage />} />
                  <Route path="donate" element={<DonatePage />} />
                  <Route path="file/download/:shareToken" element={<DownloadPage />} />
                  <Route path="*" element={<NoPage />} />
                </Routes>
              </div>
              <FooterMenu />
            </div>
          </BrowserRouter>
        )
        : <OfflinePage />}
      <CookieConsent />
    </DesignProvider>
  );
}

export default App;
