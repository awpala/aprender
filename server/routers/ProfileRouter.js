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
    const profileController = new ProfileController();
    app.get(`${PROFILE}/${userId}`, profileController.getUserProfile);
    app.post(`${PROFILE}/${userId}`, profileController.resetUserProfile);
    app.delete(`${PROFILE}/${userId}`, profileController.deleteUserProfile);
  }
}

module.exports = ProfileRouter
