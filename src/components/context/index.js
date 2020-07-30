import React, { useState } from 'react';
import axios from 'axios';

export const UserContext = React.createContext();

export const Provider = (props) => {
    // -- state variables

    // word data
    const [ words, setWords ] = useState([]);

    // user data
    const [ userId, setUserId ] = useState();
    const [ firstName, setFirstName ] = useState();
    const [ username, setUsername ] = useState();

    // TO-DO: event handlers & actions

    const getUserProfile = (id) => {
        axios.get(`/api/profile/${id}`)
        .then(res => {
            console.log(res.data);
            setWords(res.data)
        })
        .catch(err => console.log(err));
    }

    // -- session actions

    const handleRegister = (firstName, lastName, username, password, verifiedPass) => {
        if(password && password === verifiedPass) {
            axios.post('/auth/register', {firstName, lastName, username, password})
            .then(res => {
                console.log(res.data);
                setUserId(res.data.user_id);
                setFirstName(res.data.first_name);
                setUsername(res.data.username);
                
                console.log(res.data.user_id, res.data.first_name, res.data.username);

                getUserProfile(res.data.user_id);
            })
            .catch(err => console.log(err));
        } else {
            alert('Passwords do not match, please review.')
        }
    }

    const handleLogin = () => {
        // TO-DO
    }

    const handleLogout = () => {
        // TO-DO
    }

    // TO-DO: add state variables to value object
    return (
        <UserContext.Provider
            value={
                {
                    userId,
                    firstName,
                    username,
                    actions: {
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