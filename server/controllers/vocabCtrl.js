module.exports = {
    getUserWords: (req, res) => {
        const {id} = req.params,
            db = req.app.get('db');

        db.vocab.get_user_words(id)
        .then(words => res.status(200).send(words))
        .catch(err => res.status(500).send(err));
    }
}