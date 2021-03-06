import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './components/Login/login';
import Profile from './components/Dashboard/profile';

const App = () => {
    return (
        <BrowserRouter>
        <div>
            <Route exact path='/' component={Login}></Route>
            <Route exact path='/profile' component={Profile}></Route>
        </div>
    </BrowserRouter>
    )
} 

export default App;
