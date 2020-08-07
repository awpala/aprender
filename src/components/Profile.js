import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context';
import ProfileTable from './ProfileTable';
import ProfileChart from './ProfileChart';

const Profile = (props) => {
    const [isChartView, setIsChartView] = useState(false);
    const [isAdminView, setIsAdminView] = useState(false);
    const [adminMode, setAdminMode] = useState(0);

    const { isLoggedIn, firstName, userId } = useContext(UserContext);

    // route to landing if user logs out
    useEffect(() => {
        if(!isLoggedIn) {
            props.history.push('/');
        }
    }, [isLoggedIn, props.history]);

    // compute user statistics via words data array from context
    const { words } = useContext(UserContext);

    const filteredWords =  words.filter((word) => word.encounters > 0); // filter for encountered words

    const totalEncounters = filteredWords.reduce((acc, encounteredWord) => acc + encounteredWord.encounters, 0);

    const uniqueEncounters = filteredWords.length;

    const accuracy = (
        (words.reduce((acc, word) => acc + word.encounters, 0) === 0)
        ? 0 // initialize to 0 if no words encountered yet
        : filteredWords.reduce((acc, word) => acc + word.familiarity_score, 0) /
        filteredWords.reduce((acc, word) => acc + word.encounters, 0)
        * 100
    ).toFixed(2)
    ;

    const wordCounts = (threshold, areCognates) => {
        return (areCognates)
        ? filteredWords.filter(word => word.frequency_id <= threshold && word.is_cognate && word.is_familiar).length
        : filteredWords.filter(word => word.frequency_id <= threshold && word.is_familiar).length
    }

    const wordsTotal = {
        top100: wordCounts(100, false),
        top500: wordCounts(500, false),
        top1000: wordCounts(1000, false),
        top5000: wordCounts(5000, false)
    };

    const wordsCognates = {
        top100: wordCounts(100, true),
        top500: wordCounts(500, true),
        top1000: wordCounts(1000, true),
        top5000: wordCounts(5000, true)
    };

    const wordsNonCognates = {
        top100: wordsTotal.top100 - wordsCognates.top100,
        top500: wordsTotal.top500 - wordsCognates.top500,
        top1000: wordsTotal.top1000 - wordsCognates.top1000,
        top5000: wordsTotal.top5000 - wordsCognates.top5000
    };

    // profile administration actions

    const { actions } = useContext(UserContext);

    const resetProfile = () => {
        // console.log('accessed reset');
        axios.put(`/api/profile/${userId}`)
        .then(res => {
            actions.setWords(res.data);
        })
        .catch(err => console.log(err));
    }

    const deleteProfile = () => {
        // console.log('accessed delete');
        axios.delete(`/api/profile/${userId}`)
        .catch(err => console.log(err));

        axios.get('/auth/logout')
        .then(() => {
            actions.logoutUser();
        })
        .catch(err => console.log(err));
    }

    const handleAdminRequest = (mode) => {
        if((!isAdminView || adminMode !== 0) && mode !== null) {
            switch (mode) {
                case 1:
                    setIsAdminView(true);
                    setAdminMode(1);
                    break;
                case 2:
                    setIsAdminView(true);
                    setAdminMode(2);
                    break;
                default:
                    setIsAdminView(false);
                    setAdminMode(0);
                    break;
            }
        } else if (isAdminView && adminMode !== 0 && mode === null) {
            switch (adminMode) {
                case 1:
                    setIsAdminView(false);
                    setAdminMode(0);
                    resetProfile();
                    break;
                case 2:
                    setIsAdminView(false);
                    setAdminMode(0);
                    deleteProfile();
                    break;
                default:
                    setIsAdminView(false);
                    setAdminMode(0);
                    break;
            }
        }
    }

    // TO-DO: add data by part of speech

    return(
        <section className="profile">
            <h1>User Profile</h1>
            {!isChartView
                ? (
                    <>
                        <button
                            className="profile-btn select-view"
                            onClick={() => setIsChartView(prevView => !prevView)}
                        >
                            View Chart<br/>(Percentages)
                        </button>
                    </>
                )
                : (
                    <>
                        <button
                            className="profile-btn select-view"
                            onClick={() => setIsChartView(prevView => !prevView)}
                        >
                            View Table<br/>(Counts)
                        </button>
                    </>
                )}
            <div className="profile-data">
                <div className="profile-card view-stats">
                    <h2>
                        <span className="profile-stats">{firstName}</span>'s Progress
                    </h2>
                    <p>
                        Total Words Reviewed: <span className="profile-stats">{totalEncounters}</span>
                    </p>
                    <p>
                        Unique Words Reviewed: <span className="profile-stats">{uniqueEncounters}</span>/5000
                    </p>
                    <p>
                        Overall Accuracy: <span className="profile-stats">{accuracy}%</span>
                    </p>
                </div>
                <div className="profile-summary">
                    {!isChartView
                    ? (
                        <>
                            <ProfileTable
                                wordsTotal={wordsTotal}
                                wordsCognates={wordsCognates}
                                wordsNonCognates={wordsNonCognates}
                            />
                        </>
                    )
                    : (
                        <>
                            <ProfileChart
                                words={words}
                                wordsCognates={wordsCognates}
                                wordsNonCognates={wordsNonCognates}
                            />
                        </>
                    )}
                </div>
            </div>
            <div className="profile-admin">
                <h1>Profile Administration</h1>
                <div>
                    <button
                        className="profile-btn administration"
                        onClick={() => handleAdminRequest(1)}
                    >
                        Reset<br/>Profile
                    </button>
                    <button
                        className="profile-btn administration"
                        onClick={() => handleAdminRequest(2)}
                    >
                        Delete User<br/>Account
                    </button>
                </div>
                {isAdminView
                    ? (<div>
                        <p>
                            Okay to proceed? <span className="warning">WARNING: </span>
                            {adminMode === 1 ? 'reset' : 'delete'} action is
                            <span className="warning"> NOT</span> reversible!
                        </p>
                        <div>
                            <button
                                className="profile-btn admin-affirm"
                                onClick={() => handleAdminRequest(null)}
                            >
                                Proceed
                            </button>
                            <button
                                className="profile-btn admin-negate"
                                onClick={() => handleAdminRequest(0)}
                            >
                                Cancel Action
                            </button>
                        </div>
                    </div>
                    )
                    : null
                }
            </div>
        </section>
    );
}

export default Profile;