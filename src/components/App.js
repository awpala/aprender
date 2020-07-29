import React from 'react';
import Header from './Header';
import routes from '../routes';

const App = () => {
    return (
        <div>
            <Header/>
            {routes}
        </div>
    );
}

export default App;