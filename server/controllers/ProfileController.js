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
    return req.app.get('db').profile;
  }

  async getUserProfile(req, res) {
    const { userId } = req.params;
    const userProfile = await this.getProfile(req).get_user_profile({ userId: +userId });
    res.status(200).send(userProfile);
  }

  async resetUserProfile(req, res) {
    const { userId } = req.params;
    await this.getProfile(req).reset_user_profile({ userId });
    res.sendStatus(200);
  }

  async deleteUserProfile(req, res) {
    const { userId } = req.params;
    await this.getProfile(req).delete_user_profile({ userId });
    res.sendStatus(200);
  }
}

module.exports = ProfileController;
