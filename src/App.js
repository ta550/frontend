import React from 'react'
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import AdminIndex from './AdminPanel/Pages/AdminIndex';
import AdminAddmcqs from './AdminPanel/Pages/AdminAddmcqs'
import AdminAddBoard from './AdminPanel/Pages/AdminAddBoard'
import AdminAddImages from './AdminPanel/Pages/AdminAddImages'
// Importing Bootstrap
import 'bootstrap/dist/css/bootstrap.css'
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/admin/panel/" component={AdminIndex} />
        <Route  exact path="/admin/panel/add/mcqs" component={AdminAddmcqs} />
        <Route  exact path="/admin/panel/add/board" component={AdminAddBoard} />
        <Route  exact path="/admin/panel/add/images" component={AdminAddImages} />
      </Switch>
    </Router>
  );
}

export default App;
