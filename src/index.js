import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './firebase';
import Spinner from './Spinner';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import reducer from './reducers';
import { setUser, clearUser } from './actions'

const store = createStore(reducer, composeWithDevTools())

const Root = ({ setUser, isLoading, clearUser }) => {
  let history = useHistory();

  useEffect(() => {
      firebase.auth().onAuthStateChanged(authUser => {
        if(authUser) {
          setUser(authUser)
          history.push('/home')
        } else {
          clearUser();
          history.push('/login');
        }
      })
  }, []) 

  return (
    isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/home" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    )
  )
}

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
})


const RootAuth = connect(mapStateFromProps, { setUser, clearUser })(Root)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootAuth />
    </Router>
  </Provider>, 
  document.getElementById('root')
);