import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Holdings from './pages/Holdings/Holdings';
import Balance from './pages/Balance/Balance';
import AssetManagement from './pages/AssetManagement/AssetManagement';
import NotFound from './pages/NotFound/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/holdings" element={<Holdings />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/assetmanagement" element={<AssetManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;