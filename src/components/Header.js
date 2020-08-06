import React, { useContext, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context';

const Header = (props) => {
    const { isLoggedIn, actions } = useContext(UserContext);

    const handleLogout = () => {
        axios.get('/auth/logout')
        .then(() => {
            actions.logoutUser();
        })
    }
    
    // route to landing if user logs out
    useEffect(() => {
        if(!isLoggedIn) {
            props.history.push('/');
        }
    }, [isLoggedIn, props.history])

    return(
        <header className="app-header">
            {
                props.location.pathname !== '/'
                ? (<div className="header-contents">
                    <nav>
                        <Link to='/vocab'>Vocab</Link>
                        <Link to='/profile'>Profile</Link>
                        <Link to='/about'>About</Link>
                    </nav>
                    <button
                            className="header-btn"
                            onClick={() => handleLogout()}
                        >
                            Logout
                    </button>
                </div>)
                : null
            }
        </header>
    );
}

export default withRouter(Header);