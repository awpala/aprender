const { DB } = require('../constants');

class ProfileController {
  constructor() {
    // auxiliary function
    this.getProfileData = this.getProfileData.bind(this);

    // controller functions
    this.getUserProfile = this.getUserProfile.bind(this);
    this.resetUserProfile = this.resetUserProfile.bind(this);
    this.deleteUserProfile = this.deleteUserProfile.bind(this);
  }

  getProfileData(req) {
    const {
      delete_user_profile: deleteUserProfile,
      get_user_profile: getUserProfile,
      reset_user_profile: resetUserProfile,
    } = req.app.get(DB).profile; 

    const db = {
      deleteUserProfile,
      getUserProfile,
      resetUserProfile,
    };

    return db;
  }

  async getUserProfile(req, res) {
    const userId = +req.params.userId;
    const { getUserProfile } = this.getProfileData(req);
    const userProfile = await getUserProfile({ userId });
    res.status(200).send(userProfile);
  }

  async resetUserProfile(req, res) {
    const userId = +req.params.userId;
    const { resetUserProfile } = this.getProfileData(req);
    await resetUserProfile({ userId });
    res.sendStatus(200);
  }

  async deleteUserProfile(req, res) {
    const userId = +req.params.userId;
    const { deleteUserProfile } = this.getProfileData(req);
    await deleteUserProfile({ userId });
    res.sendStatus(200);
  }
}

module.exports = ProfileController;
