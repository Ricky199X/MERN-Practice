import React, { Fragment } from 'react';
import './App.css';

import Navbar from './components/layout/navbar'
import Landing from './components/layout/landing'

const App = () => {
  return (
    <Fragment>
      <Navbar />
      <Landing />
    </Fragment>
  )
}

export default App;
