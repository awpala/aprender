import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context';

const Profile = (props) => {
    const { isLoggedIn, firstName } = useContext(UserContext);

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
        ? filteredWords.filter(word => word.frequency_id <= threshold && word.is_cognate && word.is_familiar).reduce((acc, word) => acc + word.encounters, 0)
        : filteredWords.filter(word => word.frequency_id <= threshold && word.is_familiar).reduce((acc, word) => acc + word.encounters, 0);
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

    // TO-DO: add data by part of speech

    return(
        <div>
            <h1>Here is your progress, {firstName}!</h1>
            <h2>Total Words Reviewed: {totalEncounters}</h2>
            <h2>Unique Words Reviewed: {uniqueEncounters}</h2>
            <h2>Overall Accuracy: {accuracy}%</h2>
            <h2>Familiarity By Counts</h2>
            <table>
                <thead>
                    <tr>
                        <th>Frequency Range</th>
                        <th>Total</th>
                        <th>Cognates</th>
                        <th>Non-Cognates</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Top 100</td>
                        <td>{wordsTotal.top100}</td>
                        <td>{wordsCognates.top100}</td>
                        <td>{wordsNonCognates.top100}</td>
                    </tr>
                    <tr>
                        <td>Top 500</td>
                        <td>{wordsTotal.top500}</td>
                        <td>{wordsCognates.top500}</td>
                        <td>{wordsNonCognates.top500}</td>
                    </tr>
                    <tr>
                        <td>Top 1000</td>
                        <td>{wordsTotal.top1000}</td>
                        <td>{wordsCognates.top1000}</td>
                        <td>{wordsNonCognates.top1000}</td>
                    </tr>
                    <tr>
                        <td>Top 5000</td>
                        <td>{wordsTotal.top5000}</td>
                        <td>{wordsCognates.top5000}</td>
                        <td>{wordsNonCognates.top5000}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Profile;