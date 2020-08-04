import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context';
import axios from 'axios';
import useKeyPress from '../hooks/useKeyPress'; // custom hook

const Vocab = (props) => {
    // -- component data

    // user data from context
    const { userId, isLoggedIn } = useContext(UserContext);

    // word data from database/API
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
    const [isSpaceReset, setIsSpaceReset] = useState(true);

    // component keypress event listeners (via custom hook useKeyPress)
    const pressA = useKeyPress('a');
    const pressS = useKeyPress('s');
    const pressD = useKeyPress('d');
    const pressF = useKeyPress('f');
    const pressSpace = useKeyPress(' ');

    // -- component actions

    // route to landing if user logs out
        useEffect(() => {
            if(!isLoggedIn) {
                props.history.push('/');
            }
        }, [isLoggedIn, props.history]);

    // render/re-render new vocabulary query word and choices
    useEffect(() => {
        // if(isLoggedIn) {
        // if(isLoggedIn && !isAnswered && (isCorrect === null)) {
        if(isLoggedIn && !isAnswered && (isCorrect === null) && isSpaceReset) {
            axios.get(`/api/vocab/${userId}`)
            .then(res => {
                const { 
                    quiz_word_es,
                    quiz_word_es_fid,
                    part_of_speech_full,
                    phrase_es,
                    phrase_en,
                    correct_word_en,
                    incorrect_words_en,
                    is_familiar,
                    familiarity_score,
                    encounters
                } = res.data[0];

                // word attributes
                setQuery(quiz_word_es);
                setFreqId(quiz_word_es_fid);
                setPOS(part_of_speech_full);
                setPhraseEs(phrase_es);
                setPhraseEn(phrase_en);
                setCorrect(correct_word_en);

                // set choices to appear in random order
                setChoices(
                    [...incorrect_words_en, correct_word_en]
                    .sort(() => Math.random() - 0.5)
                );

                // user's word data to be updated following user response
                setIsFamiliar(is_familiar);
                setFamiliarityScore(familiarity_score);
                setEncounters(encounters);

                // setIsSpaceReset(false);
            })
            .catch(err => console.log(err));

            setIsSpaceReset(false);
        }
    // }, [isLoggedIn]);
    // }, [isLoggedIn, isAnswered, isCorrect]);
    }, [isLoggedIn, isAnswered, isCorrect, isSpaceReset]);
    // }, [isLoggedIn, isCorrect]);



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
        // if(pressSpace && (isAnswered && (isCorrect === null) && !isSpaceReset)) {
        //     setIsSpaceReset(true);
        //     setIsAnswered(false);
        // }

        // if(!isAnswered && (pressA || pressS || pressD || pressF || pressSpace))
        if(!isAnswered &&
            (pressA || pressS || pressD || pressF || (pressSpace && isSpaceReset)) && 
            (isCorrect === null))
        {
            console.log('accessed answer selectors');
            setIsAnswered(true);

            (
                (choices[0] === correct && pressA) ||
                (choices[1] === correct && pressS) ||
                (choices[2] === correct && pressD) ||
                (choices[3] === correct && pressF)
            )
            ? setIsCorrect(true)
            : setIsCorrect(false);

            setIsSpaceReset(false);
        }
    // }, [isAnswered, pressA, pressS, pressD, pressF, pressSpace]);
    }, [isAnswered, isCorrect, isSpaceReset, pressA, pressS, pressD, pressF, pressSpace]);

    // update words data upon user response via method actions.updateWord()
    const { actions } = useContext(UserContext);

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
                    const { frequency_id, is_familiar, familiarity_score, encounters } = res.data[0];

                    actions.updateWord(frequency_id, is_familiar, familiarity_score, encounters);
                })
                .catch(err => console.log(err));
            } else if(!isCorrect) {
                // console.log('accessed !isCorrect');
                setIsFamiliar(false);
                setFamiliarityScore(0);

                axios.put(`/api/vocab/${userId}`, {freqId, isFamiliar: false, familiarityScore: 0, encounters: encounters + 1})
                .then(res => {
                    // console.log('put incorrect');
                    const { frequency_id, is_familiar, familiarity_score, encounters } = res.data[0];

                    actions.updateWord(frequency_id, is_familiar, familiarity_score, encounters);
                })
                .catch(err => console.log(err));
            }

            setIsCorrect(null);
            setIsSpaceReset(false);
            // setIsAnswered(false);
        }
    // }, [isAnswered, isCorrect]);
    }, [isAnswered, isCorrect, isSpaceReset]);


    // reset to next word via button click
    const handleReset = () => {
        if(isAnswered && (isCorrect === null)) {
            setIsAnswered(false);
            // setIsCorrect(null);
            // console.log(isCorrect);
            setIsSpaceReset(true);
        }
    }

    // reset to next word via keypress (Space)
    useEffect(() => {
        if(pressSpace && isAnswered && (isCorrect === null) && !isSpaceReset) {
            console.log('accessed space');
            // setIsAnswered(false);
            // console.log(isAnswered);
            console.log(pressSpace, isAnswered, isCorrect, isSpaceReset);
            handleReset();
            // setIsSpaceReset(true);
        }
    // }, [pressSpace, isAnswered, isCorrect, isSpaceReset]);
    }, [pressSpace, isCorrect, isAnswered]);

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
                    <button onClick={() => handleReset()}>Next word (SPACE key)</button>
                </div>
                )
            }
        </div>
    );
}

export default Vocab;