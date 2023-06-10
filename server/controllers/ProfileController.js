const { DB } = require('../constants');

class ProfileController {
  constructor() {
    // auxiliary function
    this.getProfile = this.getProfile.bind(this);

    // controller functions
    this.getUserProfile = this.getUserProfile.bind(this);
    this.resetUserProfile = this.resetUserProfile.bind(this);
    this.deleteUserProfile = this.deleteUserProfile.bind(this);
  }

  getProfile (req) {
    const db = req.app.get(DB).profile; 
    return db;
  }

  async getUserProfile(req, res) {
    const { userId } = req.params;
    const db = this.getProfile(req);
    const userProfile = await db.get_user_profile({ userId: +userId });
    res.status(200).send(userProfile);
  }

  async resetUserProfile(req, res) {
    const { userId } = req.params;
    const db = this.getProfile(req);
    await db.reset_user_profile({ userId: +userId });
    res.sendStatus(200);
  }

  async deleteUserProfile(req, res) {
    const { userId } = req.params;
    const db = this.getProfile(req);
    await db.delete_user_profile({ userId: +userId });
    res.sendStatus(200);
  }
}

module.exports = ProfileController;
