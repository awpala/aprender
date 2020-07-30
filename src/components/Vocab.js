import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './context';
import axios from 'axios';

const Vocab = (props) => {
    // user data from context
    const { userId, isLoggedIn } = useContext(UserContext);

    // word data
    const [query, setQuery] = useState('');
    const [freqId, setFreqId] = useState();
    const [pOS, setPOS] = useState();
    const [correct, setCorrect] = useState('');
    const [incorrect, setIncorrect] = useState([]);
    const [phraseEs, setPhraseEs] = useState('');
    const [phraseEn, setPhraseEn] = useState('');

    // component state data
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // initial mount
    useEffect(() => {
        if(isLoggedIn) {
            axios.get(`/api/vocab/${userId}`)
            .then(res => {
                // console.log(res.data[0]);
                setQuery(res.data[0].quiz_word_es);
                setFreqId(res.data[0].quiz_word_es_fid);
                setPOS(res.data[0].part_of_speech_full);
                setCorrect(res.data[0].correct_word_en);
                setIncorrect(res.data[0].incorrect_words_en);
                setPhraseEs(res.data[0].phrase_es);
                setPhraseEn(res.data[0].phrase_en);
            })
            .catch(err => console.log(err));
        }
    }, [isLoggedIn, userId])

    // route to landing if user logs out
    useEffect(() => {
        if(!isLoggedIn) {
            props.history.push('/');
        }
    }, [isLoggedIn]);

    const answers = [...incorrect, correct];

    // Randomize answers' order via Fisher-Yates algorithm
    // (cf. https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb)
    for(let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = answers[i];
        answers[i] = answers[j];
        answers[j] = temp;
    }

    const mappedAnswers = answers.map((answer, index) => (
        <button key={index}>{answer}</button>
    ));

    return (
        <div>
            <h1>Vocab</h1>
            <h2>Spanish Word: {query}</h2>
            <h3>Frequency ID: {freqId}/5000</h3>
            <h3>Part of Speech: {pOS}</h3>
            <h2>English Translation?</h2>
            <div>
                {mappedAnswers}
            </div>
            <button>I don't know!</button>
        </div>
    );
}

export default Vocab;