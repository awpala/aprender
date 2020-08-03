import React, { useState } from 'react';

export const UserContext = React.createContext();

export const Provider = (props) => {
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
        if(freqId <= words.length - 1) { // freqId in range 1...4999
            setWords(prevState =>
                [
                    ...prevState.slice(0, freqId - 1), // N.B. offset by 1 (freqId indexed 1...5000)
                    {
                        frequency_id: freqId,
                        is_familiar: isFamiliar,
                        familiarity_score: familiarityScore,
                        encounters: encounters,
                        is_cognate: prevState[freqId].is_cognate,
                        pos_standardized: prevState[freqId].pos_standardized
                    },
                    ...prevState.slice(freqId)
                ]
            );
        } else { // update last word only (freqId === 5000)
            setWords(prevState =>
                [
                    ...prevState.slice(0, freqId - 1), // N.B. offset by 1 (freqId indexed 1...5000)
                    {
                        frequency_id: freqId,
                        is_familiar: isFamiliar,
                        familiarity_score: familiarityScore,
                        encounters: encounters,
                        is_cognate: prevState[freqId].is_cognate,
                        pos_standardized: prevState[freqId].pos_standardized
                    }
                ]
            );
        }
        
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