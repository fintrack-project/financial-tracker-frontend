import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import BasePage from './pages/PlatformManagement/BasePage';
import Dashboard from './pages/PlatformManagement/Dashboard';
import Holdings from './pages/PlatformManagement/Holdings';
import Balance from './pages/PlatformManagement/Balance';
import PortfolioOverview from './pages/PlatformManagement/PortfolioOverview';
import Profile from './pages/UserAccount/Profile';
import Settings from './pages/UserAccount/Settings';
import Support from './pages/UserAccount/Support';
import NotFound from './pages/ErrorPages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/platform/dashboard"
          element={
            <BasePage>
              <Dashboard accountId={null} />
            </BasePage>
          }
        />
        <Route
          path="/platform/holdings"
          element={
            <BasePage>
              <Holdings accountId={null} />
            </BasePage>
          }
        />
        <Route
          path="/platform/portfolio_overview"
          element={
            <BasePage>
              <PortfolioOverview accountId={null} />
            </BasePage>
          }
        />
        <Route
          path="/platform/balance"
          element={
            <BasePage>
              <Balance accountId={null} />
            </BasePage>
          }
        />
        <Route
          path="/platform/profile"
          element={
            <BasePage>
              <Profile accountId={null} />
            </BasePage>
          }
        />
        <Route
          path="/platform/settings"
          element={
            <BasePage>
              <Settings accountId={null} />
            </BasePage>
          }
        />
        <Route
          path="/platform/support"
          element={
            <BasePage>
              <Support accountId={null} />
            </BasePage>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;