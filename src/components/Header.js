import React from 'react';
import { withRouter, Link } from 'react-router-dom';

const Header = (props) => {
    return(
        <div>
            {
                props.location.pathname !== '/'
                ? (<nav>
                        <Link to='/vocab'>Vocab</Link>
                        <Link to='/profile'>Profile</Link>
                        <Link to='/about'>About</Link>
                        <button>Logout</button>
                    </nav>
                )
                : null
            }
        </div>
    );
}

export default withRouter(Header);