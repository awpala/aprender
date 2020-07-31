import React, { useState } from 'react';

export const UserContext = React.createContext();

export const Provider = (props) => {
    // -- state variables

    // session data
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);

    // user data
    const [ userId, setUserId ] = useState(null);
    const [ firstName, setFirstName ] = useState('');
    const [ username, setUsername ] = useState('');

    // user's words data
    const [ words, setWords ] = useState([]);

    // -- actions

    // session actions
    const handleUserSession = (userId, firstName, username) => {
        setUserId(userId);
        setFirstName(firstName);
        setUsername(username);
    }
    
    const handleLoginUser = (userId, firstName, username) => {
        setIsLoggedIn(true);
        handleUserSession(userId, firstName, username);
    }

    const handleSetWords = (words) => {
        setWords(words); 
    }

    const handleLogoutUser = () => {
        setIsLoggedIn(false);
        setUserId(null);
        setFirstName('');
        setUsername('');
        setWords([]);
    }

    // vocab word actions

    // TO-DO

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
                    actions: {
                        loginUser: handleLoginUser,
                        setSession: handleUserSession,
                        logoutUser: handleLogoutUser,
                        setUserWords: handleSetWords,
                        setIsLoggedIn
                    }
                }
            }
        >
            { props.children }
        </UserContext.Provider>
    );
}