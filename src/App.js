import React, { useContext } from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import {AuthContext} from './context/auth-context'

const App = props => {
  const authContext = useContext(AuthContext);
  let comp = <Auth />
  if(authContext.isAuth) {
    comp = <Ingredients />
  }
  return comp;
};

export default App;
