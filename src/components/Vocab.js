import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context';
import axios from 'axios';
import useKeyPress from '../hooks/useKeyPress'; // custom hook

const Vocab = (props) => {
    // -- component data

    // user data from context
    const { userId, isLoggedIn } = useContext(UserContext);

    // word data from context
    const [query, setQuery] = useState('');
    const [freqId, setFreqId] = useState(null);
    const [pOS, setPOS] = useState();
    const [isFamiliar, setIsFamiliar] = useState(false);
    const [familiarityScore, setFamiliarityScore] = useState(null);
    const [encounters, setEncounters] = useState(null);
    const [correct, setCorrect] = useState('');
    const [incorrect, setIncorrect] = useState([]);
    const [phraseEs, setPhraseEs] = useState('');
    const [phraseEn, setPhraseEn] = useState('');

    // component state data
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // component keypress event listeners
    const pressA = useKeyPress('a');
    const pressS = useKeyPress('s');
    const pressD = useKeyPress('d');
    const pressF = useKeyPress('f');
    const pressSpace = useKeyPress(' ');

    // -- component actions

    // initial mount
    useEffect(() => {
        if(isLoggedIn) {
            axios.get(`/api/vocab/${userId}`)
            .then(res => {
                setQuery(res.data[0].quiz_word_es);
                setFreqId(res.data[0].quiz_word_es_fid);
                setPOS(res.data[0].part_of_speech_full);
                setCorrect(res.data[0].correct_word_en);
                setIsFamiliar(res.data[0].is_familiar);
                setFamiliarityScore(res.data[0].familiarity_score);
                setEncounters(res.data[0].encounters);
                setIncorrect(res.data[0].incorrect_words_en);
                setPhraseEs(res.data[0].phrase_es);
                setPhraseEn(res.data[0].phrase_en);
            })
            .catch(err => console.log(err));
        }
    }, [isLoggedIn, userId]);

    // route to landing if user logs out
    useEffect(() => {
        if(!isLoggedIn) {
            props.history.push('/');
        }
    }, [isLoggedIn]);

    // create answers selections and assign to buttons in random order
    const answers = [...incorrect, correct].sort(() => Math.random() - 0.5);

    const mappedAnswers = answers.map((answer, index) => (
        <button
            key={index}
            onClick={() => handleSelection(index)}
        >
            {answer}
        </button>
    ));

    // handle user's selection and then re-render a new query word

    // user reponse via button click
    const handleSelection = (choice) => {
        setIsAnswered(true);
        setIsCorrect(answers[choice] === correct);
    }

    // user response via keypress
    useEffect(() => {
        if(!isAnswered && (
            pressA || pressS || pressD || pressF || pressSpace))
        {
            setIsAnswered(true);

            (
                (answers[0] === correct && pressA) ||
                (answers[1] === correct && pressS) ||
                (answers[2] === correct && pressD) ||
                (answers[3] === correct && pressF)
            )
            ? setIsCorrect(true)
            : setIsCorrect(false);
            
        }
    }, [isAnswered, pressA, pressS, pressD, pressF, pressSpace])

    const handleRefresh = () => {
        // TO-DO
    }

    // -- render component UI
    return (
        <div>
            <h3>Frequency ID: {freqId}/5000</h3>
            <h3>Part of Speech: {pOS}</h3>
            <h2>Spanish Word: {query}</h2>
            <h2>English Translation?</h2>
            {
                isAnswered
                ? <p>{correct}</p>
                : null
            }
            <div>
                {/* {mappedAnswers} */}
                {!isAnswered ? mappedAnswers : null}
            </div>
            {
                (!isAnswered
                ? <button onClick={() => handleSelection(null)}>I don't know! (SPACE key)</button>
                : <div>
                    <p>{phraseEs}</p>
                    <p>{phraseEn}</p>
                    <button onClick={() => handleRefresh()}>Next word (SPACE key)</button>
                </div>
                )
            }
        </div>
    );
}

export default Vocab;