import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import RequestPasswordReset from './pages/Authentication/RequestPasswordReset';
import ResetPassword from './pages/Authentication/ResetPassword';
import BasePage from './pages/PlatformManagement/BasePage';
import Dashboard from './pages/PlatformManagement/Dashboard';
import Holdings from './features/finance/pages/Holdings';
import Balance from './features/finance/pages/Balance';
import PortfolioOverview from './features/finance/pages/PortfolioOverview';
import Profile from './features/profile/pages/UserAccount/Profile';
import Settings from './features/profile/pages/UserAccount/Settings';
import Support from './features/profile/pages/UserAccount/Support';
import VerifyEmail from './pages/Authentication/VerifyEmail';
import NotFound from './pages/ErrorPages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request-password-reset" element={<RequestPasswordReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;