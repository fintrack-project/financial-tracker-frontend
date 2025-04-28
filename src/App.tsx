import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Holdings from './pages/Holdings/Holdings';
import Balance from './pages/Balance/Balance';
import PortfolioOverview from './pages/PortfolioOverview/PortfolioOverview';
import Profile from './pages/Profile/Profile';
import Support from './pages/Support/Support';
import NotFound from './pages/NotFound/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/platform/dashboard" element={<Dashboard />} />
        <Route path="/platform/holdings" element={<Holdings />} />
        <Route path="/platform/portfolio_overview" element={<PortfolioOverview />} />
        <Route path="/platform/balance" element={<Balance />} />
        <Route path="/platform/profile" element={<Profile />} />
        <Route path="/platform/support" element={<Support />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;