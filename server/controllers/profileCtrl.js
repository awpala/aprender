module.exports = {
    getUserProfile: (req, res) => {
        const {id} = req.params,
            db = req.app.get('db');

        db.profile.get_user_profile(id)
        .then(profile => res.status(200).send(profile))
        .catch(err => res.status(500).send(err));
    },
    resetUserProfile: (req, res) => {
        const {id} = req.params,
        db = req.app.get('db');

        db.profile.reset_user_profile(id)
        .then(profile => res.status(200).send(profile))
        .catch(err => res.status(500).send(err));
    },
    deleteUserProfile: (req, res) => {
        const {id} = req.params,
        db = req.app.get('db');

        db.profile.delete_user_profile(id)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(500).send(err));
    }
}