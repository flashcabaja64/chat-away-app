import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const Root = () => (
  // <React.StrictMode>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  // </React.StrictMode>
)

ReactDOM.render(<Router><Root /></Router>, document.getElementById('root'));
