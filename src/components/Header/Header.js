import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

const Header = ({ history, location: { pathname }, userId, logOutUser }) => {
  const handleLogout = async () => {
    await axios.post('/auth/logout');
    logOutUser();
    history.push('/');
  }

  return(
    <header className="app-header">
      {(pathname !== '/' && userId)
        && (
          <div className="header-contents">
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
          </div>
        )
      }
    </header>
  );
}

export default withRouter(Header);
