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
            { frequencyId, isFamiliar, familiarityScore, encounters } = req.body,
            db = req.app.get('db');

        // type corrections
        id = +id;
        isFamiliar = (isFamiliar === 'true') ? true : false;

        db.vocab.update_word(id, frequencyId, isFamiliar, familiarityScore, encounters)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(500).send(err));
    }
}