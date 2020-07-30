import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './context';

const Landing = (props) => {
    // form status
    const [isRegistered, setIsRegistered] = useState(false);

    // form data
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifiedPass, setVerifiedPass] = useState('');

    // actions from context: registerUser, loginUser
    const { isLoggedIn, sessionActions } = useContext(UserContext);

    // route to application if user is logged in
    useEffect(() => {
        if(isLoggedIn) {
            props.history.push('/vocab');
        }
    }, [isLoggedIn])


    return(
        <div>
            <header>
                <h1>
                    ¡Aprender!
                </h1>
            </header>
            <div>
                <section>
                    {!isRegistered
                        ? (
                            <>
                                <h3>Register Below</h3>
                                <input
                                    value={firstName}
                                    type='text'
                                    name='firstName'
                                    placeholder='First name'
                                    onChange={e => setFirstName(e.target.value)}
                                />
                                <input
                                    value={lastName}
                                    type='text'
                                    name='lastName'
                                    placeholder='Last name'
                                    onChange={e => setLastName(e.target.value)}
                                />
                            </>
                        )
                        : <h3>Log in below</h3>
                    }
                    <input
                        value={username}
                        type='text'
                        name='username'
                        placeholder='Username'
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        value={password}
                        type='password'
                        name='password'
                        placeholder='Password'
                        onChange={e => setPassword(e.target.value)}
                    />
                    {!isRegistered
                        ? (
                            <>
                                <input
                                    value={verifiedPass}
                                    type='password'
                                    name='verPass'
                                    placeholder='Verify Password'
                                    onChange={e => setVerifiedPass(e.target.value)}
                                />
                                <button 
                                    onClick={() => {
                                        sessionActions.registerUser(firstName, lastName, username, password, verifiedPass);
                                    }}
                                >
                                    Register
                                </button>
                                <p>Have an account? <span onClick={() => setIsRegistered(!isRegistered)}>Log in here</span></p>
                            </>
                        )
                        : (
                            <>
                                <button 
                                    onClick={() => {
                                        sessionActions.loginUser(username, password);
                                    }}
                                >
                                    Log in
                                </button>
                                <p>Don't have an account? <span onClick={() => setIsRegistered(!isRegistered)}>Register here</span></p>
                                {/* TO-DO: "Log in as guest" */}
                            </>
                        )
                    }
                    <button
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
        </div>
    );
}

export default Landing;