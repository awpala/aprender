import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Landing from './components/Landing';
import Vocab from './components/Vocab';
import Profile from './components/Profile';
import About from './components/About';
import NotFound from './components/NotFound';

export default (
    <Switch>
        <Route exact path='/' component={Landing} />
        <Route path='/vocab' component={Vocab} />
        <Route path='/profile' component={Profile} />
        <Route path='/about' component={About} />
        <Route component={NotFound} />
    </Switch>
)