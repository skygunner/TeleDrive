import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavigationMenu from "./components/NavigationMenu/NavigationMenuComponent";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import NoPage from "./pages/NoPage/NoPage";

const App = () => {
  const defaultTheme = {
    token: {
      colorPrimary: "#2aabee",
    },
  };

  return (
    <ConfigProvider theme={defaultTheme}>
      <NavigationMenu />
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};
export default App;
