module.exports = {
  getUserProfile: async (req, res) => {
    const { userId } = req.params;
    const db = req.app.get('db');
    const userProfile = await db.profile.get_user_profile({ userId: +userId })
    res.status(200).send(userProfile);
  },
  resetUserProfile: async (req, res) => {
    const { userId } = req.params;
    const db = req.app.get('db');
    await db.profile.reset_user_profile({ userId });
    res.sendStatus(200);
  },
  deleteUserProfile: async (req, res) => {
    const { userId } = req.params;
    const db = req.app.get('db');
    await db.profile.delete_user_profile({ userId });
    res.sendStatus(200);
  },
}
