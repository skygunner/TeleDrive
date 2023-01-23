import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import DashboardPage from "./pages/DashboardPage/DashboardPage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import NoPage from "./pages/NoPage/NoPage";

export const AppContainer = styled.section`
  text-align: center;
  margin-top: 50px;
`;

const App = () => {
  return (
    <AppContainer>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </AppContainer>
  );
};

export default App;
