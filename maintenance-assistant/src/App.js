import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './assets/styles.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/tasks" component={TaskList} />
        <Route path="/tasks/new" component={TaskForm} />
        <Route path="/tasks/edit/:id" component={TaskForm} />
      </Switch>
    </Router>
  );
};

export default App;