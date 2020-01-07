import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ProtectedRoute } from "./protectedRoute";
import Login from "./screens/loginScreen";
import AppLayout from "./screens/appLayoutScreen";
import CONSTS from "./constants";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <ProtectedRoute exact path={CONSTS.SECURED_VIEW} component={AppLayout} />
          <Route path={CONSTS.LOGIN} component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
