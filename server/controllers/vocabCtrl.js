module.exports = {
    getUserWords: (req, res) => {
        const {id} = req.params,
            db = req.app.get('db');

        db.vocab.get_user_words(id)
        .then(words => res.status(200).send(words))
        .catch(err => res.status(500).send(err));
    },
    updateWord: (req, res) => {
        let { id } = req.params,
            { freqId, isFamiliar, familiarityScore, encounters } = req.body,
            db = req.app.get('db');
        
        // console.log(id, freqId, isFamiliar, familiarityScore, encounters);

        db.vocab.update_word(id, freqId, isFamiliar, familiarityScore, encounters)
        .then(word => res.status(200).send(word))
        .catch(err => res.status(500).send(err));
    }
}