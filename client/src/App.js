import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';

// import the provider 
import { Provider } from 'react-redux';
import store from './store';

import Navbar from './components/layout/navbar'
import Landing from './components/layout/landing'
import Register from './components/auth/register'
import Login from './components/auth/login'
import Alert from './components/layout/alert'

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App;
