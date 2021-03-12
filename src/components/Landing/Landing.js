import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import useKeyPress from '../../hooks/useKeyPress'; // custom hook

const Landing = ({ history, getUser }) => {
  // -- component data

  // form status
  const [isRegistered, setIsRegistered] = useState(true);

  // form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifiedPass, setVerifiedPass] = useState('');

  // -- component actions

  // form event handlers
  const loginUser = (username, userId, firstName) => {
    getUser(username, userId, firstName);
    history.push('/vocab');
  }

  const handleRegister = async (firstName, lastName, username, password, verifiedPass) => {
    if(password && password === verifiedPass) {
      const userData = await axios.post('/auth/register', {firstName, lastName, username, password});
      const { data } = userData;
      loginUser(data.username, data.user_id, data.first_name);
    } else {
      alert('Passwords do not match, please review.');
    }
  }

  const handleLogin = async (username, password) => {
    if (username && password) {
      const userData = await axios.post('/auth/login', {username, password});
      const { data } = userData;
      loginUser(data.username, data.user_id, data.first_name, data.last_name);
    } else {
      alert('Enter username and password.');
    }
  }

  // submit form using Enter key
  const pressEnter = useKeyPress('Enter');

  useEffect(() => {
      if(pressEnter) {
          isRegistered
          ? handleLogin(username, password)
          : handleRegister(firstName, lastName, username, password, verifiedPass);
      }
  // eslint-disable-next-line
  }, [pressEnter])

  // -- render component UI
  return(
    <div className="landing">
      <header className="landing-header">
        <h1>¡Aprender!</h1>
      </header>
      <section className="landing-form">
        {!isRegistered 
          ? (
            <div className="landing-heading">
              <h2>Register below</h2>
              <p className="landing-view">Have an account?
                <strong
                  onClick={() => setIsRegistered(true)}
                >
                  Log in here
                </strong>
              </p>
            </div>
          )
          : (
            <div className="landing-heading">
                <h2>Log in below</h2>
                <p className="landing-view">Don't have an account?
                    <strong
                      onClick={() => setIsRegistered(false)}> Register here
                    </strong>
                </p>
            </div>
          )
        }
        {/* TO-DO: "Log in as guest" */}
        <div className="landing-card">
          {!isRegistered
            && (
              <>
                <p className="landing-fieldname">First Name</p>
                <input
                  className="landing-fieldform"
                  value={firstName}
                  type='text'
                  name='firstName'
                  placeholder='First name'
                  onChange={e => setFirstName(e.target.value)}
                />
                <p className="landing-fieldname">Last Name</p>
                <input
                  className="landing-fieldform"
                  value={lastName}
                  type='text'
                  name='lastName'
                  placeholder='Last name'
                  onChange={e => setLastName(e.target.value)}
                />
              </>
            )
          }
          <p className="landing-fieldname">Username</p>
          <input
            className="landing-fieldform"
            value={username}
            type='text'
            name='username'
            placeholder='Username'
            onChange={e => setUsername(e.target.value)}
          />
          <p className="landing-fieldname">Password</p>
          <input
            className="landing-fieldform"
            value={password}
            type='password'
            name='password'
            placeholder='Password'
            onChange={e => setPassword(e.target.value)}
          />
          {!isRegistered
            && (
              <>
                <p className="landing-fieldname">Verify Password</p>
                <input
                  className="landing-fieldform"
                  value={verifiedPass}
                  type='password'
                  name='verPass'
                  placeholder='Verify Password'
                  onChange={e => setVerifiedPass(e.target.value)}
                />
              </>
            )
          }
        </div>
        <div className="form-actions">
          {!isRegistered
            ? (
              <>
                <button
                  className="landing-btn"
                  onClick={() => {
                    handleRegister(firstName, lastName, username, password, verifiedPass);
                  }}
                >
                  Register
                </button>
              </>
            )
            : (
              <>
                <button
                  className="landing-btn"
                  onClick={() => {
                    handleLogin(username, password);
                  }}
                >
                  Log in
                </button>
              </>
            )
          }
          <button
            className="landing-btn"
            onClick={() => {
              setFirstName('');
              setLastName('');
              setUsername('');
              setPassword('');
              setVerifiedPass('');
            }}
          >
            Clear Fields
          </button>
        </div>
      </section>
    </div>
  );
}

Landing.propTypes = {
  history: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
}

export default Landing;
