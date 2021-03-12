import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useKeyPress from '../../hooks/useKeyPress'; // custom hook

const Vocab = ({ userId }) => {
  // -- component data

  // word data from database/API
  const [query, setQuery] = useState('');
  const [freqId, setFreqId] = useState(null);
  const [pOS, setPOS] = useState();
  const [correct, setCorrect] = useState('');
  const [choices, setChoices] = useState([]);
  const [phraseEs, setPhraseEs] = useState('');
  const [phraseEn, setPhraseEn] = useState('');

  // component state data
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // component keypress event listeners (via custom hook useKeyPress)
  const pressA = useKeyPress('a');
  const pressS = useKeyPress('s');
  const pressD = useKeyPress('d');
  const pressF = useKeyPress('f');
  const pressSpace = useKeyPress(' ');
  const pressW = useKeyPress('w');

  // -- component actions

  const getWord = async () => {
   // console.log('1) access mount');
    const wordData = await axios.get(`/api/vocab/${userId}`);

    const {
      quiz_word_es,
      quiz_word_es_fid,
      part_of_speech_full,
      phrase_es,
      phrase_en,
      correct_word_en,
      incorrect_words_en,
    } = wordData.data;

    // word attributes
    setQuery(quiz_word_es);
    setFreqId(quiz_word_es_fid);
    setPOS(part_of_speech_full);
    setPhraseEs(phrase_es);
    setPhraseEn(phrase_en);
    setCorrect(correct_word_en);

    // set choices to appear in random order
    
    // initialize choicesArray 
    const choicesArray = [...incorrect_words_en, correct_word_en];

    // Randomize choices' order via Fisher-Yates algorithm	
    // (cf. https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb)
    for(let i = choicesArray.length - 1; i > 0; i--) {	
      const j = Math.floor(Math.random() * (i + 1));	
      const temp = choicesArray[i];	
      choicesArray[i] = choicesArray[j];	
      choicesArray[j] = temp;	
    }

    setChoices(choicesArray);
  }

  // render/re-render new vocabulary query word and choices
  useEffect(() => {
    if(userId && !isAnswered && (isCorrect === null)) {
      getWord();
    }
  // eslint-disable-next-line
  }, [userId, isAnswered, isCorrect]);

  const mappedChoices = choices.map((choice, index) => (
    <button
      className="vocab-btn choice"
      key={index}
      onClick={() => handleSelection(index)}
    >
      {choice}
    </button>
  ));

  // handle user's selection and then re-render a new query word

  // user reponse via button click
  const handleSelection = (choice) => {
    // console.log('2A) selection via click');
    setIsCorrect(choices[choice] === correct);
  }

  // user response via keypress
  useEffect(() => {
    if(!isAnswered &&
      (isCorrect === null) &&
      (pressA || pressS || pressD || pressF || pressSpace)
    )
    {
      // console.log('2B) selection via keypress');

      setIsCorrect(
        (choices[0] === correct && pressA) ||
        (choices[1] === correct && pressS) ||
        (choices[2] === correct && pressD) ||
        (choices[3] === correct && pressF)
      );
    }
  // eslint-disable-next-line
  }, [isAnswered, isCorrect, pressA, pressS, pressD, pressF, pressSpace]);

  const handleWordSelection = async (isCorrect) => {
    await axios.put(`/api/vocab/${userId}`, { freqId, isCorrect })
  }

  useEffect(() => {
    if(!isAnswered && (isCorrect !== null)) {    
      // console.log('3) handle word selection');
      handleWordSelection(isCorrect);
      setIsAnswered(true);
    }
  // eslint-disable-next-line
  }, [isAnswered, isCorrect]);

  // reset to next word via button click
  const handleReset = () => {
    if(isAnswered) {
      // console.log('4A) reset via click');
      setIsAnswered(false);
      setIsCorrect(null);
    }
  }

  // reset to next word via keypress (W)
  useEffect(() => {
    if(pressW && isAnswered && (isCorrect !== null)) {
      // console.log('4B) reset via W');
      handleReset();
    }
  // eslint-disable-next-line
  }, [pressW]);

  // -- render component UI
  return (
    <div className="vocab">
      <h1>Vocab Drills</h1>
      <div className="vocab-card">
        <div className="vocab-metadata">
          <p>
            <span>Frequency ID: </span>
            <span className="query-word">{freqId}</span>
            <span>/5000</span>
          </p>
          <p>
            <span>Part of Speech: </span>
            <span className="query-word">{pOS}</span>
          </p>
        </div>
        <p className="vocab-word">
          <span>Spanish Word: </span>
          <span className="query-word">{query}</span>
        </p>
        <p><br/></p>
      </div>
      <div className="user-response">
        <h2 className="vocab-word">
          <span>English Translation?</span>
        </h2>
        <div className="vocab-choices">
          {!isAnswered ? mappedChoices : null}
        </div>
          {!isAnswered
            ? (
              <button
                className="vocab-btn action"
                onClick={() => handleSelection(null)}
              >
                I don't know!<br/>(SPACE key)
              </button>
            )
            : (
              <div className="vocab-answered">
                {isCorrect
                  ? <p className="vocab-correct">{correct}</p>
                  : <p className="vocab-incorrect">{correct}</p>
                }
                <p className="vocab-metadata">
                  <strong>Ejemplo:</strong> {phraseEs}
                </p>
                <p className="vocab-metadata">
                  <strong>Example:</strong> {phraseEn}
                </p>
                <button
                  className="vocab-btn action"
                  onClick={() => handleReset()}
                >
                  Next word<br/>(W key)
                </button>
              </div>
            )
          }
      </div>
        <p className="vocab-tip">
          <strong>Note:</strong> Keypresses <strong>A</strong>,
          <strong> S</strong>, <strong> D</strong>, <strong>F</strong> can
          be used to enter your selection.
        </p>
    </div>
  );
}

export default Vocab;
