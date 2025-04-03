import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AssetManagement from './pages/AssetManagement';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/assets" component={AssetManagement} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;