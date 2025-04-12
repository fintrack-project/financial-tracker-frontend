import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Holdings from './pages/Holdings/Holdings';
import Balance from './pages/Balance/Balance';
import PortfolioOverview from './pages/PortfolioOverview/PortfolioOverview';
import NotFound from './pages/NotFound/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/holdings" element={<Holdings />} />
        <Route path="/PortfolioOverview" element={<PortfolioOverview />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;