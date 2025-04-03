import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AssetForm from './components/AssetForm';
import AssetList from './components/AssetList';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/assets/new" component={AssetForm} />
          <Route path="/assets" component={AssetList} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;