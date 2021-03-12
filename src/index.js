import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import { ContextProvider } from './context';
import App from './App';

const Router = process.env.NODE_ENV === 'development' ? HashRouter : BrowserRouter;

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // optional argument to visualize Redux store's state in browser Redux Dev Tools
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <Router>
          <App />
        </Router>
      </ContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();