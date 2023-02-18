import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NavigationMenu from './components/NavigationMenu';
import FilesPage from './pages/FilesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NoPage from './pages/NoPage';
import FooterMenu from './components/FooterMenu';

import './App.css';

function App() {
  const defaultTheme = {
    token: {
      colorPrimary: '#158bdc',
      colorSplit: '#d9d9d9',
      colorInfo: '#1579be',
    },
  };

  return (
    <BrowserRouter>
      <ConfigProvider theme={defaultTheme}>
        <div className="page">
          <div className="page-content">
            <NavigationMenu />
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="files" element={<FilesPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </div>
          <FooterMenu />
        </div>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
