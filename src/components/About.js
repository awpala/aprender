import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context';

const About = (props) => {
    const { isLoggedIn } = useContext(UserContext);

    // route to landing if user logs out
    useEffect(() => {
        if(!isLoggedIn) {
            props.history.push('/');
        }
    }, [isLoggedIn, props.history]);

    return(
        <section>
            <h2>Purpose and Methodology</h2>
            <p>
                The purpose of this application is to train the user's 
                familiarity with Spanish vocabulary. The set of words included
                in this application are the top 5000 Spanish words in common
                usage, based on linguistic analysis of spoken and written word. The frequency ID identifies a given word's ranking by this
                methodology (i.e., ID 1 is the most frequently used Spanish
                word, whereas ID 5000 is the 5000th most frequently used
                Spanish word).
            </p>
            <h2>Usage</h2>
            <p>
                The "Vocab" page randomly queries a word from a dynamically
                generated range, starting with the top 100 words. Once these
                words are familiarized, the range expands to the top 500
                words. If any words from the top 100 range become unfamiliar in
                this phase, the selection will adjust to focus on these words
                before returning to the top 500 range. The application
                proceeds in this manner through the top 500, top 1000, and then
                top 5000 word range. 
            </p>
            <p>
                In general, it is ill-advised to "guess" a selection; rather,
                "I don't know!" should be selected if a word is unfamiliar. This
                will be more conducive to training procedural memory to promote
                retention of unfamiliar words (i.e., returning these words into
                the "unfamiliar pool" of randomly generated candidate query
                words).
            </p>
            <p>
                Additionally, the "Profile" page will summarize progress on
                gaining familiarity with the 5000 words. Summaries are provided
                with respect to <emphasis>cognates</emphasis> (words that share 
                a resemblance between Spanish and English, i.e., via common 
                etymology) and <emphasis>non-cognates</emphasis> (unresembling
                words).
            </p>
        </section>
    );
}

export default About;