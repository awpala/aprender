import React from 'react';

const ProfileTable = ({ wordsTotal, wordsCognates, wordsNonCognates }) => {
    return (
        <div>
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

export default ProfileTable;