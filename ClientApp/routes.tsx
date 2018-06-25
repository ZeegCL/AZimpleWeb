import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './home/Home';
import { Register } from './register/Register';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/register' component={ Register } />
</Layout>;
