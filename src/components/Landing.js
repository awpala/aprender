import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context';
import useKeyPress from '../hooks/useKeyPress'; // custom hook

const Landing = (props) => {
    // -- component data

    // form status
    const [isRegistered, setIsRegistered] = useState(true);

    // form data
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifiedPass, setVerifiedPass] = useState('');

    // store data
    const { actions, isLoggedIn, userId  } = useContext(UserContext);

    // -- component actions

    // redirect user to app if session active or logged in
    useEffect(() => {
        // set user back into session if not logged out (retains session if page refreshed)
        if(!isLoggedIn && userId) {
            getUserProfile(userId);
            actions.setIsLoggedIn(true);
        }

        // redirect to vocab if logged in
        if(isLoggedIn) {
            props.history.push('/vocab');
        }
    }, [isLoggedIn, userId])

    // form event handlers
    const getUserProfile = (id) => {
        axios.get(`/api/profile/${id}`)
        .then(res => {
            // console.log(res.data);
            actions.setWords(res.data);
        })
        .catch(err => console.log(err));
    }

    const handleRegister = (firstName, lastName, username, password, verifiedPass) => {
        if(password && password === verifiedPass) {
            axios.post('/auth/register', {firstName, lastName, username, password})
            .then(res => {
                actions.loginUser(res.data.user_id, res.data.first_name, res.data.username);

                getUserProfile(res.data.user_id);
            })
            .catch(err => console.log(err));
        } else {
            alert('Passwords do not match, please review.')
        }
    }

    const handleLogin = (username, password) => {
        axios.post('/auth/login', {username, password})
        .then(res => {
            // console.log(res.data);
            actions.loginUser(res.data.user_id, res.data.first_name, res.data.username);

            getUserProfile(res.data.user_id);
        })
        .catch(err => console.log(err));
    }

    // submit form using Enter key
    const pressEnter = useKeyPress('Enter');

    useEffect(() => {
        if(pressEnter) {
            isRegistered
            ? handleLogin(username, password)
            : handleRegister(firstName, lastName, username, password, verifiedPass);
        }
    }, [pressEnter])

    // -- render component UI
    return(
        <div className="landing">
            <header className="landing-header">
                <h1>
                    ¡Aprender!
                </h1>
            </header>
            <section className="landing-form">
                {!isRegistered 
                    ? (
                        <div className="landing-heading">
                            <h2>Register below</h2>
                            <p className="landing-view">Have an account?
                                <strong
                                    onClick={() => setIsRegistered(true)}
                                > Log in here
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
                        ? (
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
                        : null
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
                        ? (
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
                        : null
                    }
                </div>
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
            </section>
        </div>
    );
}

export default Landing;