const { ProfileController } = require('../controllers');
const {
  routes: { PROFILE },
  urlParams: { userId },
} = require('../constants');

/**
 * Router for entity `profile`
 */
class ProfileRouter {
  constructor(app) {
    this.app = app;

    this.configure = this.configure.bind(this);
  }

  /**
   * Configure routes for entity `profile`
   */
  configure() {
    const { app } = this;

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
