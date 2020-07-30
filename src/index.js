import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from './components/context';

import App from './components/App';

ReactDOM.render(
    <Provider>
    <HashRouter>
    <React.StrictMode>
    <App />
    </React.StrictMode>
    </HashRouter>
    </Provider>,
    document.getElementById('root')
);