import React, { useContext, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { UserContext } from '../context';

const Header = (props) => {
    const { isLoggedIn, sessionActions } = useContext(UserContext);

    useEffect(() => {
        if(!isLoggedIn) {
            props.history.push('/');
        }
    }, [isLoggedIn])

    return(
        <div>
            {
                props.location.pathname !== '/'
                ? (<nav>
                        <Link to='/vocab'>Vocab</Link>
                        <Link to='/profile'>Profile</Link>
                        <Link to='/about'>About</Link>
                        <button onClick={() => sessionActions.logoutUser()}>
                            Logout
                        </button>
                    </nav>
                )
                : null
            }
        </div>
    );
}

export default withRouter(Header);