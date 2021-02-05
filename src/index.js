import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './firebase';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';

const store = createStore(() => {}, composeWithDevTools())

const Root = () => {
  let history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(authUser => {
        authUser && history.push('/')
    })
  }) 

  return (
      // <React.StrictMode>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  // </React.StrictMode>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Root />
    </Router>
  </Provider>, 
  document.getElementById('root')
);
