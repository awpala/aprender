import React, { useState } from 'react';

export const UserContext = React.createContext();

export const ContextProvider = (props) => {
    // -- context state variables

    // session data
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);

    // user data
    const [ userId, setUserId ] = useState(null);
    const [ firstName, setFirstName ] = useState('');
    const [ username, setUsername ] = useState('');

    // user's words data
    const [ words, setWords ] = useState([]);

    // -- context actions

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

    const handleLogoutUser = () => {
        setIsLoggedIn(false);
        setUserId(null);
        setFirstName('');
        setUsername('');
        setWords([]);
    }

    // vocab word actions
    const handleUpdateWord = (freqId, isFamiliar, familiarityScore, encounters) => {
        // N.B. offset index by 1 ("freqId" indexed 1...5000 vs. array "words" indexed 0...4999)
        const offset = freqId - 1;

        setWords(prevWords =>
            [
                ...prevWords.slice(0, offset), 
                {
                    frequency_id: freqId,
                    is_familiar: isFamiliar,
                    familiarity_score: familiarityScore,
                    encounters: encounters,
                    is_cognate: prevWords[offset].is_cognate,
                    pos_standardized: prevWords[offset].pos_standardized
                },
                ...prevWords.slice(offset + 1)
            ]
        );
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
                    actions: {
                        setIsLoggedIn,
                        setWords,
                        setSession: handleUserSession,
                        loginUser: handleLoginUser,
                        logoutUser: handleLogoutUser,
                        updateWord: handleUpdateWord
                    }
                }
            }
        >
            { props.children }
        </UserContext.Provider>
    );
}