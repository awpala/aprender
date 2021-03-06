import React from 'react';

const ProfileTable = ({ wordsTotal, wordsCognates, wordsNonCognates }) => (
  <div className="profile-card view-table">
    <h2>Familiarity by Counts</h2>
    <table className="profile-table">
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
          <td className="profile-total">{wordsTotal.top100}</td>
          <td>{wordsCognates.top100}</td>
          <td>{wordsNonCognates.top100}</td>
        </tr>
          <tr>
            <td>Top 500</td>
            <td className="profile-total">{wordsTotal.top500}</td>
            <td>{wordsCognates.top500}</td>
            <td>{wordsNonCognates.top500}</td>
          </tr>
          <tr>
            <td>Top 1000</td>
            <td className="profile-total">{wordsTotal.top1000}</td>
            <td>{wordsCognates.top1000}</td>
            <td>{wordsNonCognates.top1000}</td>
          </tr>
          <tr>
            <td>Top 5000</td>
            <td className="profile-total">{wordsTotal.top5000}</td>
            <td>{wordsCognates.top5000}</td>
            <td>{wordsNonCognates.top5000}</td>
          </tr>
      </tbody>
    </table>
  </div>
);

export default ProfileTable;
