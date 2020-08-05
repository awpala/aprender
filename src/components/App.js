import React, { useContext, useEffect } from 'react';
import Header from './Header';
import routes from '../routes';
import { UserContext } from '../context';
import axios from 'axios';

const App = () => {
    const { actions, isLoggedIn } = useContext(UserContext);

    // retain session information if page is refreshed
    useEffect(() => {
        if(!isLoggedIn) {
            axios.get('/auth/session')
            .then(res => {
                // console.log(res.data);
                if(res.data){
                    actions.setSession(res.data.user_id, res.data.first_name, res.data.username);
                }
            })
        }
    }, [isLoggedIn])

    return (
        <div className="app">
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