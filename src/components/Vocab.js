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
    const [choices, setChoices] = useState([]);
    const [phraseEs, setPhraseEs] = useState('');
    const [phraseEn, setPhraseEn] = useState('');

    // component state data
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

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
                // set choices to appear in random order
                setChoices([...res.data[0].incorrect_words_en, res.data[0].correct_word_en].sort(() => Math.random() - 0.5));
                setPhraseEs(res.data[0].phrase_es);
                setPhraseEn(res.data[0].phrase_en);
            })
            .catch(err => console.log(err));
        }
    }, [isLoggedIn]);

    // route to landing if user logs out
    useEffect(() => {
        if(!isLoggedIn) {
            props.history.push('/');
        }
    }, [isLoggedIn, props.history]);

    const mappedChoices = choices.map((choice, index) => (
        <button
            key={index}
            onClick={() => handleSelection(index)}
        >
            {choice}
        </button>
    ))

    // handle user's selection and then re-render a new query word

    // user reponse via button click
    const handleSelection = (choice) => {
        setIsAnswered(true);
        setIsCorrect(choices[choice] === correct);
    }

    // user response via keypress
    useEffect(() => {
        if(!isAnswered && (pressA || pressS || pressD || pressF || pressSpace))
        {
            setIsAnswered(true);

            (
                (choices[0] === correct && pressA) ||
                (choices[1] === correct && pressS) ||
                (choices[2] === correct && pressD) ||
                (choices[3] === correct && pressF)
            )
            ? setIsCorrect(true)
            : setIsCorrect(false);
            
        }
    }, [isAnswered, pressA, pressS, pressD, pressF, pressSpace])

    // update words data
    const { actions } = useContext(UserContext);

    // handleUpdateWord

    useEffect(() => {
        if(isAnswered && (isCorrect !== null)) {
            // console.log('accessed isAnswered');
            setEncounters(prevEncounters => prevEncounters + 1);

            if(isCorrect) {
                // console.log('accessed isCorrect');
                setIsFamiliar(true);
                setFamiliarityScore(prevScore => prevScore + 1);

                axios.put(`/api/vocab/${userId}`, {freqId, isFamiliar: true, familiarityScore: familiarityScore + 1, encounters: encounters + 1})
                .then(res => {
                    // console.log('put correct');
                    actions.updateWord(res.data[0].frequency_id, res.data[0].is_familiar, res.data[0].familiarity_score, res.data[0].encounters);
                })
                .catch(err => console.log(err));
            } else if(!isCorrect) {
                // console.log('accessed !isCorrect');
                setIsFamiliar(false);
                setFamiliarityScore(0);

                axios.put(`/api/vocab/${userId}`, {freqId, isFamiliar: false, familiarityScore: 0, encounters: encounters + 1})
                .then(res => {
                    // console.log('put incorrect');
                    actions.updateWord(res.data[0].frequency_id, res.data[0].is_familiar, res.data[0].familiarity_score, res.data[0].encounters);
                })
                .catch(err => console.log(err));
            }

            setIsCorrect(null);
        }
    }, [isAnswered, isCorrect])

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
                {!isAnswered ? mappedChoices : null}
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