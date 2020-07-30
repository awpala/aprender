import React, { useContext } from 'react';
import Header from './Header';
import routes from '../routes';
import { UserContext } from './context';

const App = (props) => {
    const { isLoggedIn } = useContext(UserContext);

    return (
        <div>
            {isLoggedIn
            ? (
                <>
                    <Header/>
                    {routes}
                </>
            )
            : routes
            }
        </div>
    );
}

export default App;