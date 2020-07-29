import React from 'react';
import { withRouter, Link } from 'react-router-dom';

const Header = (props) => {
    return(
        <div>
            <h1>¡Aprender!</h1>
            {
                props.location.pathname !== '/'
                ? (<nav>
                        <Link to='/vocab'>Vocab</Link>
                        <Link to='/profile'>Profile</Link>
                        <Link to='/about'>About</Link>
                    </nav>
                )
                : null
            }
        </div>
    );
}

export default withRouter(Header);