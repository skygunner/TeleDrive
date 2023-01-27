import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavigationMenu from "./components/NavigationMenu";
import FilesPage from "./pages/FilesPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NoPage from "./pages/NoPage";

const App = () => {
  const defaultTheme = {
    token: {
      colorPrimary: "#158bdc",
      colorSplit: "#d9d9d9",
    },
  };

  return (
    <BrowserRouter>
      <ConfigProvider theme={defaultTheme}>
        <NavigationMenu />
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
