import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './firebase';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import reducer from './reducers';
import { setUser } from './actions'

const Root = ({ setUser }) => {
  let history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(authUser => {
      console.log(authUser)
      setUser(authUser)
      authUser && history.push('/')
    })
  }, []) 

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

const store = createStore(reducer, composeWithDevTools())
const RootAuth = connect(null, { setUser })(Root)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootAuth />
    </Router>
  </Provider>, 
  document.getElementById('root')
);