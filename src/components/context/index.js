import React, { useState } from 'react';
import axios from 'axios';

export const UserContext = React.createContext();

export const Provider = (props) => {
    // -- state variables

    // session data
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);

    // user data
    const [ userId, setUserId ] = useState();
    const [ firstName, setFirstName ] = useState();
    const [ username, setUsername ] = useState();

    // user's words data
    const [ words, setWords ] = useState([]);

    // -- event handlers & actions

    // auxiliary helpers

    const getUserProfile = (id) => {
        axios.get(`/api/profile/${id}`)
        .then(res => {
            // console.log(res.data);
            setWords(res.data);
        })
        .catch(err => console.log(err));
    }

    // session actions

    const handleRegister = (firstName, lastName, username, password, verifiedPass) => {
        if(password && password === verifiedPass) {
            axios.post('/auth/register', {firstName, lastName, username, password})
            .then(res => {
                setIsLoggedIn(true);

                console.log(res.data);
                setUserId(res.data.user_id);
                setFirstName(res.data.first_name);
                setUsername(res.data.username);
                
                // console.log(res.data.user_id, res.data.first_name, res.data.username);

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
            setUserId(res.data.user_id);
            setFirstName(res.data.first_name);
            setUsername(res.data.username);
            
            // console.log(res.data.user_id, res.data.first_name, res.data.username);

            getUserProfile(res.data.user_id);

            setIsLoggedIn(true);
        })
        .catch(err => console.log(err));
    }

    const handleLogout = () => {
        axios.get('/auth/logout')
        .then(() => {
            setIsLoggedIn(false);
            setUserId(null);
            setFirstName('');
            setUsername('');
            setWords([]);
        })
    }

    // -- return context object
    return (
        <UserContext.Provider
            value={
                {
                    isLoggedIn,
                    userId,
                    firstName,
                    username,
                    words,
                    sessionActions: {
                        registerUser: handleRegister,
                        loginUser: handleLogin,
                        logoutUser: handleLogout
                    }
                }
            }
        >
            { props.children }
        </UserContext.Provider>
    );
}