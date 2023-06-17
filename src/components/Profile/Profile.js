import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileTable from './ProfileTable';
import ProfileChart from './ProfileChart';

const Profile = ({ history, userId, firstName, username, logOutUser }) => {
  const [isChartView, setIsChartView] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [view, setView] = useState(null);
  const [words, setWords] = useState(null);

  const views = {
    RESET: 'RESET',
    DELETE: 'DELETE',
  };

  const actions = {
    PROCEED: 'PROCEED',
    CANCEL: 'CANCEL',
  };

  const fetchData = async () => {
    const wordsData = await axios.get(`/api/profile/${userId}`);
    setWords(wordsData.data);
  }
  
  useEffect(() => {
    if (userId && !words) {
      fetchData();
    }
  // eslint-disable-next-line
  }, [userId, words])

  // declare user stats variables
  let filteredWords, totalEncounters, uniqueEncounters, accuracy;
  let wordsNonCognates, wordsCognates, wordsTotal;

  const wordCounts = (threshold, areCognates) => (
    (areCognates)
    ? filteredWords.filter(word => word.frequency_id <= threshold && word.is_cognate && word.is_familiar).length
    : filteredWords.filter(word => word.frequency_id <= threshold && !word.is_cognate && word.is_familiar).length
  );
  
  // assign user stats variables -- guard in IF to ensure words is loaded/populated prior to performing array methods
  if (words) {
    filteredWords =  words.filter((word) => word.encounters > 0); // filter for encountered words
    totalEncounters = filteredWords.reduce((acc, encounteredWord) => acc + encounteredWord.encounters, 0);
    uniqueEncounters = filteredWords.length;
  
    accuracy = (
      (words.reduce((acc, word) => acc + word.encounters, 0) === 0)
      ? 0 // initialize to 0 if no words encountered yet
      : (
        filteredWords.reduce((acc, word) => acc + word.familiarity_score, 0) /
        filteredWords.reduce((acc, word) => acc + word.encounters, 0)
        * 100
      )
    ).toFixed(2);
  
    wordsNonCognates = {
      top100: wordCounts(100, false),
      top500: wordCounts(500, false),
      top1000: wordCounts(1000, false),
      top5000: wordCounts(5000, false),
    };
  
    wordsCognates = {
      top100: wordCounts(100, true),
      top500: wordCounts(500, true),
      top1000: wordCounts(1000, true),
      top5000: wordCounts(5000, true),
    };
  
    wordsTotal = {
      top100: wordsNonCognates.top100 + wordsCognates.top100,
      top500: wordsNonCognates.top500 + wordsCognates.top500,
      top1000: wordsNonCognates.top1000 + wordsCognates.top1000,
      top5000: wordsNonCognates.top5000 + wordsCognates.top5000,
    };
  }

  //--- profile administration actions

  const clearState = () => {
    setView(null);
    setIsAdminView(false);
  }

  const resetProfile = async () => {
    // console.log('accessed reset');
    await axios.post(`/api/profile/${userId}`);
    clearState();
    window.location.reload();
  }

  const deleteProfile = async () => {
    // console.log('accessed delete');
    await axios.delete(`/api/profile/${userId}`);
    await axios.post('/auth/logout');
    clearState();
    history.push('/');
    logOutUser();
  }

  const handleIsAdminView = (newView) => {
    setView(newView);

    const { RESET, DELETE } = views;
    const isView = newView === RESET || newView === DELETE;
    setIsAdminView(isView);
  }

  const handleAdminAction = (action) => {
    const { RESET, DELETE } = views;
    const { PROCEED, CANCEL } = actions;

    switch (action) {
      case PROCEED: {
        if (view === RESET) resetProfile();
        if (view === DELETE) deleteProfile();
        break;
      }
      case CANCEL: clearState(null); break;
      default: break;
    }
  }

  // TO-DO: add data by part of speech

  return (
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
          {(!isChartView && words)
            && (
              <>
                <ProfileTable
                  wordsTotal={wordsTotal}
                  wordsCognates={wordsCognates}
                  wordsNonCognates={wordsNonCognates}
                />
              </>
            )
          }
          {(isChartView && words)
            && (
              <>
                <ProfileChart
                  wordsCognates={wordsCognates}
                  wordsNonCognates={ wordsNonCognates}
                />
              </>
            )
          }
        </div>
      </div>
      <div className="profile-admin">
        <h1>Profile Administration</h1>
        <div>
          <button
            className="profile-btn administration"
            onClick={() => handleIsAdminView(views.RESET)}
          >
            Reset<br/>Profile
          </button>
          {(username !== 'guest')
            && (
              <button
                className="profile-btn administration"
                onClick={() => handleIsAdminView(views.DELETE)}
              >
                Delete User<br/>Account
              </button>
            )
          }
        </div>
        {isAdminView
          && (
            <div>
              <p>
                Okay to proceed? <span className="warning">WARNING: </span>
                {view === views.RESET ? 'reset' : 'delete'} action is
                <span className="warning"> NOT</span> reversible!
              </p>
              <div>
                <button
                  className="profile-btn admin-affirm"
                  onClick={() => handleAdminAction(actions.PROCEED)}
                >
                  Proceed
                </button>
                <button
                  className="profile-btn admin-negate"
                  onClick={() => handleAdminAction(actions.CANCEL)}
                >
                  Cancel Action
                </button>
              </div>
            </div>
          )
        }
      </div>
    </section>
  );
}

export default Profile;
