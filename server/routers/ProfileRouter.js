const { ProfileController } = require('../controllers');
const {
  routes: { PROFILE },
  urlParams: { userId },
} = require('../constants');

class ProfileRouter {
  constructor() {
    this.configure = this.configure.bind(this);
  }

  configure(app) {
    const {
      getUserProfile,
      resetUserProfile,
      deleteUserProfile,
    } = new ProfileController();

    app.get(`${PROFILE}/${userId}`, getUserProfile);
    app.post(`${PROFILE}/${userId}`, resetUserProfile);
    app.delete(`${PROFILE}/${userId}`, deleteUserProfile);
  }
}

module.exports = ProfileRouter
