import React, { useContext, useEffect } from 'react';
import { UserContext } from './context';

const Profile = (props) => {
    const { isLoggedIn } = useContext(UserContext);

    // route to landing if user logs out
    useEffect(() => {
        if(!isLoggedIn) {
            props.history.push('/');
        }
    }, [isLoggedIn]);

    return(
        <div>Profile</div>
    );
}

export default Profile;